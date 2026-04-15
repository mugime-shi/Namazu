# Plan: Overview Tab — National Swedish Electricity Dashboard

## Context

SweClockers Smarta Hem フォーラムで Prelatur から「Elmix per elområde より Sverige total が見たい」というフィードバックを受けた (3 upvotes)。

現状の Unagi は全タブが zone 別の詳細情報。初訪問ユーザーが「今のスウェーデンはどんな電力状況か」を一瞥で把握する手段がない。

C 案 (独立した Overview タブ) で対応。既存データと既存コンポーネントの再利用で今日中に実装可能。新しいデータソース不要。

## アーキテクチャ

| 決定 | 選択 | 理由 |
|------|------|------|
| ナビ位置 | Top レベル新タブ, **先頭** (Overview > Prices > Cost > Simulators) | 初訪問者が最初に見る。階層: National → Zone → Your bill |
| 集計方法 | フロントエンドで SE1-4 を合算 | バックエンドに新エンドポイント不要。既存 `/generation/today` を4回呼ぶだけ |
| 表示データ | Real-time (今の瞬間) のみ、過去時系列なし | スコープを絞り今日中に完成。過去は既存タブで見れる |
| コンポーネント再利用 | `GenerationChart`, `WeeklySummary` を流用 | 新規実装を最小化 |

## UI レイアウト

```
┌─────────────────────────────────────────────────────┐
│ Unagi logo    Overview | Prices | Cost | Simulators │
└─────────────────────────────────────────────────────┘

🇸🇪 Sweden right now                      11:45

┌─────────────────────┐  ┌─────────────────────┐
│ Renewable           │  │ Carbon intensity    │
│   62%               │  │   18 gCO₂/kWh       │
│   hydro 48%         │  │   [gauge]           │
│   wind 12% ...      │  │   Low               │
└─────────────────────┘  └─────────────────────┘

Generation mix — today (nationwide)
[stacked area chart — today, national aggregate]

Spot price by zone                         11:00
┌──────┬─────────┬──────────┬──────────┐
│ Zone │ Current │ Today avg│ Sparkline│
├──────┼─────────┼──────────┼──────────┤
│ SE1  │ 18 öre  │ 22       │   ╲╱╲    │
│ SE2  │ 20 öre  │ 23       │   ╲╱╲    │
│ SE3  │ 46 öre  │ 52       │   ╱╲╱    │
│ SE4  │ 58 öre  │ 65       │   ╱╲╱    │
└──────┴─────────┴──────────┴──────────┘
Each zone clickable → Prices tab with that zone selected

Next 7 days (SE3 default, zone selector)
[existing WeeklySummary component]
```

## 実装ステップ

### Step 1: 集計ロジック (新規 hook)

**`frontend/src/hooks/useNationalGeneration.ts`** (新規)
- 内部で `useGeneration()` を 4 回呼ぶ (SE1-4)
- 時刻ごとに 4 zone の値を合算
- 返却: `time_series` (national aggregated), `totals` (current moment)
- renewable %, carbon intensity は加重平均

**`frontend/src/hooks/useAllZonePrices.ts`** (新規)
- `usePrices("today")` を 4 回呼ぶ (SE1-4)
- 各 zone の current price + today avg + hourly series (sparkline用)
- 返却: `Record<Area, { current, todayAvg, slots }>`

### Step 2: Overview コンポーネント (新規)

**`frontend/src/components/Overview.tsx`** (新規)
- 上部: Renewable % + Carbon intensity の 2 カード
- 中部: National Generation chart (既存 GenerationChart を national mode で)
- 下部: Zone comparison table (click → area + tab 切替)
- 最下部: WeeklySummary (既存、デフォルト SE3)

### Step 3: GenerationChart 拡張

**`frontend/src/components/GenerationChart.tsx`** 改修:
- Optional prop `mode: "zone" | "national"` 追加 (default "zone")
- national mode: タイトルに "Nationwide" 追加、subtitle から zone 表示を外す
- 既存の zone モードはそのまま動作

### Step 4: App.tsx 統合

- `Layer` 型に `"overview"` 追加
- Nav 順序変更: `overview → prices → cost → simulators`
- デフォルトを `overview` に (初訪問者の体験を優先)
- Overview タブ内で zone click → `setLayer("prices")` + `setArea(clickedZone)`
- モバイルスライドインドロワーも更新

### Step 5: 検証

- ローカルで 4 zone の集計値が妥当か確認
- Zone click で正しく Prices タブに遷移するか
- モバイルでレイアウト崩れなし
- Light/Dark 両対応

## 対象ファイル

| ファイル | 操作 |
|---------|------|
| `frontend/src/hooks/useNationalGeneration.ts` | 新規 |
| `frontend/src/hooks/useAllZonePrices.ts` | 新規 |
| `frontend/src/components/Overview.tsx` | 新規 |
| `frontend/src/components/GenerationChart.tsx` | 改修: mode prop |
| `frontend/src/App.tsx` | 改修: layer 追加、ナビ、ルーティング |
| `frontend/src/types/index.ts` | 改修: Layer 型 |

バックエンド変更なし。

## 検証項目

- [ ] `npm run build` エラーなし
- [ ] Overview タブがデフォルトで開く
- [ ] 再エネ % が SE1-4 の加重平均と一致
- [ ] Carbon intensity が加重平均で計算される
- [ ] Generation chart が全国合算で表示
- [ ] Zone table の current price が `/prices/today` と一致
- [ ] Zone row クリック → Prices タブ + 該当 zone 選択
- [ ] モバイル: 2 カードが縦並びに
- [ ] Light/Dark: 両テーマで読みやすい

## リスク

- **API 4 本並列リクエスト**: 4 zone × 2 種類 = 8 リクエスト。Lambda cold start で遅延の可能性
  → 並列実行 (Promise.all) で体感速度を保つ
- **Default tab 変更**: 既存ユーザーが「Prices が消えた」と感じるリスク
  → Overview に「Continue to Prices →」的な明示的誘導を入れる
- **カバレッジ不整合**: SE1 の generation データが欠けていると集計がずれる
  → 欠損ゾーンは除外し、どの zone が含まれたかをフッターに明記

## 今後 (本 plan 範囲外)

- Phase 2 (retailer 比較) 完了後、Overview に "Retailer market overview" カードを追加
- 過去 24h / 7 日のナショナル傾向を Overview にも表示
- Spot price の zone 間価格差 (flaskhals) 可視化
