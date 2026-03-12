# TASKS.md
# Namazu — 実装タスクリスト

> Claude Codeでの作業単位として使う。各タスクは1セッションで完了できるサイズ。
> 完了したらチェックを入れる。

---

## Phase 1: Foundation（目安: Week 1前半）

### 1.1 プロジェクト初期化
- [x] Gitリポジトリ作成（`Namazu`）
- [x] `backend/` ディレクトリ: Python 3.12, requirements.txt, FastAPI scaffold
- [x] `frontend/` ディレクトリ: React (Vite), Tailwind CSS 初期設定
- [x] `docker-compose.yml`: FastAPI + PostgreSQL
- [x] `Dockerfile`: dev/lambda 2ターゲット構成（Lambda Web Adapter 対応）
- [x] `docker-compose up` で FastAPI が `localhost:8000` で応答することを確認
- [x] FastAPI の `/health` エンドポイントが動作すること

**完了条件**: `docker-compose up` → ブラウザで `localhost:8000/docs` にSwagger UIが表示される

### 1.2 ENTSO-E API 疎通
- [ ] ENTSO-E Transparency Platform でAPIキーを取得（要ユーザー登録）※ユーザー作業
- [x] `services/entsoe_client.py`: SE3のday-ahead prices を取得する関数
- [x] XMLレスポンスのパース（ElementTree）— PT15M / PT60M 両対応
- [x] EUR/MWh → SEK/kWh の変換（固定レート、config.pyで管理）
- [x] `scripts/fetch_prices_smoke.py`: APIキー設定後にコンソール出力で確認可能

**完了条件**: Pythonスクリプトを実行 → SE3の翌日24時間分のスポット価格がSEK/kWhで表示される

### 1.3 DB + 価格API
- [x] `db/database.py`: PostgreSQL接続（SQLAlchemy、docker-compose内のローカルDB）
- [x] `db/migrations/`: spot_prices テーブル作成（Alembic、ARCHITECTURE.md のスキーマ準拠）
- [x] `services/price_service.py`: ENTSO-Eから取得 → DBにUPSERT → DBから読み出し（APIキーなし時はモックデータにフォールバック）
- [x] `routers/prices.py`: `GET /api/v1/prices/today`, `GET /api/v1/prices/tomorrow` エンドポイント
- [x] テスト: `test_prices.py`（13テスト、SQLite in-memoryで動作）

**完了条件**: `curl localhost:8100/api/v1/prices/today` → SE3の今日のスポット価格（モック）がJSONで返る ✓
**Note**: docker-compose のポートを `API_PORT`（デフォルト8100）、`DB_PORT`（デフォルト5533）で設定可能に変更

### 1.4 最小フロントエンド
- [x] React アプリから `/api/v1/prices/today` を fetch（`usePrices` hook）
- [x] Recharts で時間帯別価格チャートを表示（`PriceChart.jsx`）
- [x] 現在の時間帯をハイライト（青い点）+ 安い/高い/普通インジケーター（`PriceIndicator.jsx`）
- [x] `npm run dev` で localhost:5173 → Vite proxy → API:8100 の構成で動作確認済み

**完了条件**: ブラウザで今日のSE3スポット価格の折れ線グラフが表示される ✓
**起動方法**: `docker compose up -d` → `cd frontend && npm run dev`

---

## Phase 2: Layer 1 MVP（目安: Week 1後半〜Week 2前半）

### 2.1 価格APIの拡充
- [x] `GET /api/v1/prices/tomorrow`（13:00以降に翌日分が取得可能）
- [x] `GET /api/v1/prices/range?start=...&end=...`（期間指定）
- [x] `GET /api/v1/prices/cheapest-hours?date=...&duration=2`（最安連続時間帯）
- [x] 明日の価格が未公開（13:00前）の場合のハンドリング（`published` フィールドで表現）

**完了条件**: 3つのエンドポイントが全て動作し、cheapest-hoursが正しい時間帯を返す ✓
**テスト**: 24テスト全通過（SQLite in-memory）

### 2.2 価格自動取得（Scheduler）
- [x] `tasks/fetch_prices.py`: 日次の価格取得スクリプト（CLIから実行可能）
- [x] 過去データのバックフィル機能（指定期間の価格をまとめて取得）
- [x] エラーハンドリング（API障害時のリトライ×3、ログ出力）
- [x] ローカルではcron or 手動実行、デプロイ時にEventBridgeに接続（`lambda_handler` 実装済み）

**完了条件**: `python -m app.tasks.fetch_prices --backfill 30` → 過去30日分の価格がDBに保存される ✓
**Note**: `backend/.env` の `DATABASE_URL` を `localhost:5533` に修正（ホストからの接続用）

### 2.3 消費シミュレーション
- [x] `POST /api/v1/simulate/consumption` エンドポイント
- [x] 入力: 月間消費量(kWh), 固定価格契約の価格, shiftable_pct, shift_hours
- [x] 出力: 固定価格コスト, ダイナミック平均コスト, 最適化時コスト, 節約額・節約率
- [x] 電力価格の構成要素を正確に反映（マージン, 送電料, エネルギー税, VAT）
- [x] テスト: `test_simulate.py`（14テスト全通過）

**完了条件**: 月500kWhの消費で固定 vs ダイナミックの比較結果が返り、数値が妥当 ✓

### 2.3b Göteborg Energi 月平均価格契約対応
- [x] 「月平均価格 × 使用電力量」契約タイプをシミュレーターに追加
  - 月の全スロット価格の平均値を契約価格として使用
  - 固定価格・月平均・ダイナミック・最適化の **4パターン比較**に拡張
- [x] フロントエンド: 4枚目のResultCard「Gbg Energi (mo. avg)」追加（`grid-cols-2 sm:grid-cols-4`）
- [x] 月平均の表示: 「This month's avg spot so far: X.XX SEK/kWh (N days)」を青文字で表示

**完了条件**: 自分のGöteborg Energi契約（月平均×kWh）でのコストが他契約と並んで表示される ✓
**Note**: 月平均価格はDBの当月データから計算。月途中はその時点までの平均を使用

### 2.4 Layer 1 フロントエンド完成
- [x] 今日・明日の価格チャート（タブ切り替え）
- [x] 「今安い / 高い / 普通」のカラーインジケーター（日平均比）
- [x] 「洗濯機（2h）/ 食洗機（2h）/ EV充電（4h）をいつ回すべきか」ウィジェット（`CheapHoursWidget.jsx`）
- [x] 消費シミュレーター: 月間kWhを入力 → 固定 vs ダイナミックの月額比較（`ConsumptionSimulator.jsx`）
- [x] レスポンシブ対応（flex-wrap・sm:px-6・グリッド対応）
- [x] 価格サマリーに月平均追加: Min / Avg (today) / Avg (month) / Max の4カード表示
  - `summary.month_avg_sek_kwh`（当月全スロット平均）をバックエンドで計算し返却
  - フロントエンド: `grid-cols-2 sm:grid-cols-4` でレスポンシブ4列

**完了条件**: 自分のスマホからアクセスして、今日の最安時間帯と消費シミュレーション結果が見える ✓
**起動方法**: `docker compose up -d` → `cd frontend && npm run dev`

---

## Phase 3: Layer 2 MVP（目安: Week 2後半〜Week 3前半）

### 3.1 天候データ取得
- [x] `services/smhi_client.py`: SMHI Open Data APIからヨーテボリの日照データ取得
- [x] 全天日射量（global radiation, W/m²）のパース（Parameter 11, Station 71415: Göteborg Sol）
- [x] 気温データ（Parameter 1）を同時取得、タイムスタンプで結合
- [x] `models/weather_data.py`: WeatherData ORM モデル
- [x] `migrations/b8f2c9d1a3e5_create_weather_data_table.py`: Alembicマイグレーション
- [x] weather_data テーブルへのUPSERT（PostgreSQL `ON CONFLICT DO UPDATE`）
- [x] テスト: `test_smhi.py`（10テスト全通過）

**完了条件**: ヨーテボリの直近数ヶ月の日射量データがDBに保存される ✓
**Note**: `fetch_and_store(db)` で全データ取得+保存。`alembic upgrade head` でテーブル作成

### 3.2 太陽光発電シミュレーション
- [x] `services/solar_model.py`: 発電量推定モデル
  - 計算式: `generation_kwh = panel_kwp × (radiation_wm2 / 1000) × performance_ratio`
  - 実SMHIデータ優先 → DBにデータなければ参照テーブルにフォールバック
  - 出力: 月間合計・日平均・時間単位スロット（SMHIデータ時のみ）
- [x] ヨーテボリの月別日射量の参照テーブル（DOMAIN_KNOWLEDGE.md参照）
- [x] テスト: `test_solar_model.py`（15テスト全通過）

**完了条件**: 6kWpパネルの7月の推定月間発電量が500〜800kWhの範囲に収まる ✓ (~773kWh)
**Note**: SMHIデータは時間単位。hourly_slotsにtimestamp+radiation+generationが入る

### 3.3 売電最適化ロジック
- [x] `POST /api/v1/simulate/solar` エンドポイント（`routers/solar.py`）
- [x] 入力: パネル容量, 蓄電池容量, 年間消費量, 対象月（YYYY-MM）, PR
- [x] 閾値ベース最適化: spot > daily_avg×1.2 → 売電優先、spot < daily_avg×0.8 → 充電/購入優先
- [x] 税控除あり（≤2025年）vs なし（2026年〜）の比較計算
  - eligible_kwh = min(sold_kwh, bought_kwh)（買電量上限の制約を反映）
  - 年間上限18,000 SEKも表示
- [x] テスト: `test_solar_model.py`（21テスト全通過）

**完了条件**: 税控除あり/なしで月次クレジット差が正しく計算される ✓
**Note**: savings = (total_cons - bought) × avg_full_retail（バッテリー放電分も含む正しい式）

### 3.4 Layer 2 フロントエンド
- [x] ソーラーシミュレーター入力フォーム（パネル容量, 蓄電池, 消費量, 対象月）
- [x] エネルギーバランス表示: 発電量 / 自家消費 / 売電 / 購入の4カード
- [x] 売電収益 / 自家消費節約額 / 蓄電池効果の内訳表示
- [x] 税控除廃止前後の比較ビュー（≤2025 vs 2026+）― 月次・年次の両方を表示
- [x] Layer 1 ↔ Layer 2 のナビゲーション（ヘッダー右上 Prices / Solar タブ）
- [x] データソースバッジ（SMHI real data / Reference table）
- [ ] 月間の発電量 vs 消費量チャート（Nice to have）

**完了条件**: ソーラーシミュレーターにパラメータを入力 → 税控除あり/なしの年間収益が表示される ✓
**実装ファイル**:
- `src/hooks/useSolar.js`: POST `/api/v1/simulate/solar`
- `src/components/SolarSimulator.jsx`: フォーム + 結果表示
- `src/App.jsx`: Prices / Solar レイヤーナビゲーション追加

---

## Phase 4: Deploy & Polish（目安: Week 3後半）

### 4.0 環境セットアップ（デプロイ前提条件）

#### AWS — 個人プロファイル追加
- [ ] 個人AWSアカウントにログイン → IAMコンソールへ
- [ ] IAMユーザー作成: `namazu-deploy`
  - アクセス許可: `AdministratorAccess`（後で絞ってもよい）
  - アクセスキー作成（Use case: CLI）→ CSVをダウンロード
- [ ] `~/.aws/credentials` に `[personal]` プロファイルを追記:
  ```ini
  [personal]
  aws_access_key_id = AKIA...
  aws_secret_access_key = ...
  ```
- [ ] `~/.aws/config` に リージョンを追記:
  ```ini
  [profile personal]
  region = eu-north-1
  ```
- [ ] 動作確認: `aws sts get-caller-identity --profile personal`

#### GitHub — 個人アカウントをSSHで接続（会社設定と分離）
- [ ] 個人用SSHキーを生成:
  ```bash
  ssh-keygen -t ed25519 -C "personal@gmail.com" -f ~/.ssh/id_ed25519_personal
  ```
- [ ] `~/.ssh/config` に追記（会社設定は触らない）:
  ```
  Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal
  ```
- [ ] GitHub個人アカウント → Settings → SSH keys → 公開鍵を追加
  ```bash
  cat ~/.ssh/id_ed25519_personal.pub  # これをGitHubに貼る
  ```
- [ ] 動作確認: `ssh -T git@github-personal`（`Hi username!` と返ればOK）
- [ ] GitHubに `Namazu` リポジトリ作成（publicでもprivateでも可）
- [ ] ローカルリポジトリを作成・接続:
  ```bash
  cd ~/mugimeshi/portfolio/Namazu
  git init
  git remote add origin git@github-personal:your-username/Namazu.git
  git add .
  git commit -m "Initial commit"
  git push -u origin main
  ```
- [ ] `~/.gitconfig` に追記（mugimeshi/ 以下は個人アカウントのIDを使う）:
  ```ini
  [includeIf "gitdir:~/mugimeshi/"]
    path = ~/.gitconfig-personal
  ```
  `~/.gitconfig-personal` を新規作成:
  ```ini
  [user]
    name = Your Name
    email = personal@gmail.com
  ```

#### direnv — ディレクトリ別環境変数（グローバル汚染なし）
- [ ] インストール: `brew install direnv`
- [ ] シェルに追記（`~/.zshrc` の末尾）:
  ```bash
  eval "$(direnv hook zsh)"
  ```
- [ ] `Namazu/.envrc` を作成:
  ```bash
  export AWS_PROFILE=personal
  ```
- [ ] 許可: `direnv allow`
- [ ] 動作確認: `cd Namazu` → `echo $AWS_PROFILE` が `personal` になる

**完了条件**: `aws sts get-caller-identity` が個人アカウントのIDを返す・`ssh -T git@github-personal` が成功する・GitHubにpush済み

---

### 4.1 Terraform
- [ ] `infra/main.tf`: provider, backend (S3 state)
- [ ] `infra/ecr.tf`: ECRリポジトリ
- [ ] `infra/lambda.tf`: Lambda関数（Dockerイメージ、Web Adapter）
- [ ] `infra/api_gateway.tf`: HTTP API
- [ ] `infra/eventbridge.tf`: 日次スケジュール（13:30 CET）
- [ ] `infra/iam.tf`: Lambda実行ロール
- [ ] `infra/variables.tf`, `infra/outputs.tf`
- [ ] `terraform plan` → `terraform apply` でデプロイ成功

**完了条件**: `curl https://{api-gateway-url}/api/v1/prices/today` が本番環境で動作する

### 4.2 Supabase 接続
- [ ] Supabase プロジェクト作成（free tier）
- [ ] スキーママイグレーション実行
- [ ] Lambda の環境変数に Supabase 接続文字列を設定
- [ ] ローカル（docker-compose PostgreSQL）と本番（Supabase）の切り替え確認

**完了条件**: デプロイ済みLambdaがSupabaseのDBからデータを読み書きできる

### 4.3 GitHub Actions
- [ ] `.github/workflows/ci.yml`: PR時にpytest + docker build
- [ ] `.github/workflows/deploy.yml`: main push時にECR push + terraform apply
- [ ] GitHub Secrets にAWS credentials, Supabase URLを設定
- [ ] PRを作成 → CIが通る → マージ → 自動デプロイ の一連の流れを確認

**完了条件**: PRマージ → 自動でLambdaが更新される

### 4.4 Vercel デプロイ
- [ ] Vercel にフロントエンドをデプロイ
- [ ] 環境変数にバックエンドAPIのURLを設定
- [ ] カスタムドメイン設定（任意）
- [ ] CORS設定の確認

**完了条件**: `https://Namazu.vercel.app` （仮）でダッシュボードが動作する

### 4.5 README & ドキュメント
- [ ] `README.md`（英語）: プロジェクト概要、デモURL、セットアップ手順
  - What: 1段落で説明
  - Why: 日本のFIT → スウェーデンのスポット市場（3文で）
  - How to run locally: `git clone → docker-compose up`
  - Architecture: 構成図（ARCHITECTURE.mdから抜粋）
  - Tech stack: 一覧
  - Screenshots: ダッシュボードのスクリーンショット
- [ ] Swagger UI（`/docs`）が公開URLでアクセス可能であること
- [ ] コードにdocstringとコメント（英語）

**完了条件**: READMEを読んだ面接官が、5分以内にプロジェクトの価値を理解できる

---

## Phase 5: Nice to have（時間があれば）

### 5.1 蓄電池最適化
- [ ] 簡易的な充放電スケジューリングアルゴリズム
- [ ] 蓄電池あり/なしの収益比較

### 5.2 履歴データ分析
- [ ] 過去3ヶ月の価格トレンドチャート
- [ ] 月別の平均価格・ボラティリティ表示

### 5.3 日本のFIT比較ビュー
- [ ] 日本の固定価格とスウェーデンのスポット価格を同じグラフに重ねる
- [ ] 面接でのビジュアル説明資料として使用

### 5.4 多言語対応
- [ ] 英語 / 日本語 / スウェーデン語

### 5.5 面接準備
- [ ] 英語での5分間プレゼン原稿作成
- [ ] 想定質問と回答の練習（DOMAIN_KNOWLEDGE.md セクション6）
- [ ] ライブデモのシナリオ作成（「ここをクリックすると…」）

---

## Claude Code セッションの進め方

### 各セッション開始時に渡すもの
```
以下のファイルを読んでください:
- PROJECT_BRIEF.md（プロジェクトの目的と文脈）
- ARCHITECTURE.md（技術構成）
- DOMAIN_KNOWLEDGE.md（ドメイン知識）
- TASKS.md（このファイル — 現在の進捗）

現在のタスク: [タスク番号] を実装してください。
```

### セッション終了時の確認
- [ ] タスクの完了条件を満たしているか
- [ ] テストがあるか（あれば通っているか）
- [ ] TASKS.md のチェックボックスを更新したか
- [ ] 次のセッションに引き継ぐべき情報はあるか
