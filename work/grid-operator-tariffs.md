# Grid Operator Tariffs — SE3 (2026)

Collected: 2026-04-14
All prices: **exkl moms** unless noted

## Göteborg Energi Nät

- **Product**: GNM63 (Småhus och företag, Max 63A)
- **Valid**: 2026-01-01 to 2026-12-31
- **Source**: [REST API](https://api.goteborgenergi.cloud/gridtariff/v0/tariffs)

| Dwelling | Fast avgift (SEK/yr) | Överföring (öre/kWh) | Effektavgift (SEK/kW) |
|----------|---------------------|----------------------|----------------------|
| Apartment | 1,968 | 18.4 | — |
| House | 1,968 | 18.4 | 39.2 |

Note: One tariff for all dwelling types. Effektavgift based on peak kW.

## Ellevio (Stockholm)

- **Valid**: 2026-01-01 onwards
- **Tariff area**: Entire Ellevio grid area (no Stockholm Stad/Södra subdivision)
- **Source (apartment)**: [ellevio.se/abonnemang/elnatspriser/lagenhet](https://www.ellevio.se/abonnemang/elnatspriser/lagenhet/)
- **Source (house)**: [ellevio.se/abonnemang/elnatspriser/hus](https://www.ellevio.se/abonnemang/elnatspriser/hus/)
- **PDF (apartment)**: [lagenhet_260101.pdf](https://www.ellevio.se/globalassets/content/priserabonnemang-pdf/2026/lagenhet/lagenhet_260101.pdf)
- **PDF (house)**: [effekt-16-63a_260101.pdf](https://www.ellevio.se/globalassets/content/priserabonnemang-pdf/2026/effekt/effekt-16-63a_260101.pdf)

### Apartment (Lägenhetsabonnemang)

| Building size | Fast avgift (SEK/mån) | Fast avgift (SEK/yr) | Överföring (öre/kWh) |
|--------------|----------------------|---------------------|----------------------|
| 3–29 units | 96 | 1,152 | 20.8 |
| 30–59 units | 88 | 1,056 | 20.8 |
| 60–99 units | 80 | 960 | 20.8 |
| 100+ units | 72 | 864 | 20.8 |

No effektavgift. DB uses 3–29 row (worst case, most common small building).

### House (Effektabonnemang)

| Säkring | Fast avgift (SEK/mån) | Fast avgift (SEK/yr) | Överföring (öre/kWh) | Effektavgift (SEK/kW) |
|---------|----------------------|---------------------|----------------------|----------------------|
| 16–25A | 316 | 3,792 | 5.6 | 65.0 |
| 35A | 792 | 9,504 | 5.6 | 65.0 |
| 50A | 1,212 | 14,544 | 5.6 | 65.0 |
| 63A | 1,740 | 20,880 | 5.6 | 65.0 |

DB uses 16–25A row. Effektavgift = avg of 3 highest hourly peaks/month; 22:00–06:00 counts at 50%.

## Vattenfall Eldistribution

- **Product**: Säkringsabonnemang (house), Grupptariff (apartment)
- **Valid**: 2026-01-01 onwards
- **Source**: [vattenfalleldistribution.se/abonnemang-och-avgifter](https://www.vattenfalleldistribution.se/abonnemang-och-avgifter/avtal-och-avgifter/elnatsavgifter/)
- **House detail**: [sakringsabonnemang-16-63a](https://www.vattenfalleldistribution.se/abonnemang-och-avgifter/avtal-och-avgifter/elnatsavgifter/sakringsabonnemang-16-63a/)
- **Apartment detail**: [grupptariff](https://www.vattenfalleldistribution.se/abonnemang-och-avgifter/avtal-och-avgifter/elnatsavgifter/grupptariff/)

### Apartment (Grupptariff, inkl moms → exkl moms)

| | Inkl moms | Exkl moms (÷1.25) |
|---|---|---|
| Fast avgift | 2,450 SEK/yr | **1,960 SEK/yr** |
| Överföring (enkeltariff) | 44.5 öre/kWh | **35.6 öre/kWh** |

No effektavgift. Grupptariff requires ≥3 installations on same service cable, <8,000 kWh/yr each.

### House (Säkringsabonnemang, inkl moms → exkl moms)

| Säkring | Fast (inkl) | Fast (exkl, SEK/yr) | Överföring (exkl, öre/kWh) |
|---------|------------|--------------------|-----------------------------|
| 16A | 5,775 kr/yr | **4,620** | **35.6** |
| 20A | 8,085 kr/yr | 6,468 | 35.6 |
| 25A | 10,125 kr/yr | 8,100 | 35.6 |
| 35A | 13,890 kr/yr | 11,112 | 35.6 |
| 50A | 19,945 kr/yr | 15,956 | 35.6 |
| 63A | 26,875 kr/yr | 21,500 | 35.6 |

No effektavgift for säkringsabonnemang. DB uses 16A row.
Tidstariff variant available (76.5/30.5 öre high/low inkl moms) but not modeled.

## Mälarenergi Elnät (Västerås)

- **Product**: Säkringsabonnemang
- **Valid**: 2026-01-01 onwards (note: from 2026-07-01 reverting to model without effektavgift for ≤63A)
- **Source**: [malarenergi.se/el/elnat/priser-elnat](https://www.malarenergi.se/el/elnat/priser-elnat/)
- **PDF**: [prislista-260101.pdf](https://www.malarenergi.se/globalassets/dokument/elnat/priser/prislista-for-malarenergi-elnat---privat--och-foretagskunder-fran-260101.pdf)

All prices already exkl moms on source page.

| Dwelling/Säkring | Fast avgift (SEK/mån) | Fast avgift (SEK/yr) | Överföring (öre/kWh) | Effektavgift (SEK/kW) |
|-----------------|----------------------|---------------------|----------------------|----------------------|
| Apartment | 115 | 1,380 | 17.2 | — |
| 16A | 281 | 3,372 | 17.2 | 47.4 |
| 20A | 318 | 3,816 | 17.2 | 47.4 |
| 25A | 346 | 4,152 | 17.2 | 47.4 |
| 35A | 438 | 5,256 | 17.2 | 47.4 |
| 50A | 539 | 6,468 | 17.2 | 47.4 |
| 63A | 624 | 7,488 | 17.2 | 47.4 |

Fixed fees include elsäkerhetsavgift (11.10 kr/yr), nätövervakningsavgift (4.35 kr/yr), elberedskapsavgift (90.00 kr/yr).

---

## SE1 — Skellefteå Kraft Elnät

- **Valid**: 2026-01-01 onwards
- **Source**: [skekraft.se/privat/elnat/elnatspriser](https://www.skekraft.se/privat/elnat/elnatspriser/)
- All prices inkl moms on source.

| Dwelling/Säkring | Fast (inkl, kr/yr) | Fast (exkl, kr/yr) | Överföring (exkl, öre/kWh) |
|-----------------|-------------------|--------------------|-----------------------------|
| Apartment 16L | 2,225 | 1,780 | 8.8 |
| 16A | 5,660 | 4,528 | 8.8 |
| 20A | 8,180 | 6,544 | 8.8 |
| 25A | 9,920 | 7,936 | 8.8 |

No effektavgift for säkringsabonnemang. Myndighetsavgifter 131.80 kr/yr inkl moms included.

### SE1 gaps
- **Luleå Energi**: New effekttariff from Sep 2026. 2026 prices in unreadable PDF. To be added.
- **Umeå Energi**: SPA website, prices not in HTML. "One of Sweden's lowest elnätsavgifter." To be added.

---

## SE2 — Jämtkraft Elnät (Östersund)

- **Valid**: 2026-01-01 onwards
- **Source**: [jamtkraft.se/privat/elnat/elnatsavgifter](https://www.jamtkraft.se/privat/elnat/elnatsavgifter/)
- All prices inkl moms on source.

| Dwelling/Säkring | Fast (inkl, kr/yr) | Fast (exkl, kr/yr) | Överföring (exkl, öre/kWh) |
|-----------------|-------------------|--------------------|-----------------------------|
| Apartment 16A | 2,490 | 1,992 | 6.0 |
| 16A | 5,700 | 4,560 | 6.0 |
| 20A | 9,340 | 7,472 | 6.0 |
| 25A | 11,880 | 9,504 | 6.0 |

No effektavgift. Effekttariff planned from Oct 2026.

## SE2 — Gävle Energi Elnät

- **Valid**: 2026-01-01 onwards
- **Source**: [gavleenergi.se/elnat/elnatspriser](https://www.gavleenergi.se/elnat/elnatspriser/)
- All prices inkl moms on source.

| Dwelling/Säkring | Fast (inkl, kr/yr) | Fast (exkl, kr/yr) | Överföring (exkl, öre/kWh) |
|-----------------|-------------------|--------------------|-----------------------------|
| Apartment 16A | 1,995 | 1,596 | 12.0 |
| 16A | 4,340 | 3,472 | 12.0 |
| 20A | 6,435 | 5,148 | 12.0 |
| 25A | 8,640 | 6,912 | 12.0 |

No effektavgift. Effektavgift from Sep 2026.

### SE2 gaps
- **E.ON Energidistribution**: Major operator in SE2. Website returns 403. PDFs also blocked. To be added.

---

## SE4 — Öresundskraft (Helsingborg)

- **Valid**: 2026-01-01 onwards
- **Source**: [oresundskraft.se/privat/elnat/elnatsavgifter](https://www.oresundskraft.se/privat/elnat/elnatsavgifter/)
- All prices inkl moms on source.

| Dwelling | Fast (inkl, kr/yr) | Fast (exkl, kr/yr) | Överföring formula (inkl) | Överföring est. (exkl) |
|----------|-------------------|--------------------|--------------------------|-----------------------|
| Apartment | 2,415 | 1,932 | 17 + 5.57% × MMU | ~15.8* |
| 16A | 5,160 | 4,128 | 17 + 5.57% × MMU | ~15.8* |

*Transfer fee is spot-linked. Estimated at typical SE4 spot ~50 öre/kWh: 17 + 2.8 = 19.8 inkl → 15.8 exkl.
No effektavgift (government stopped requirement).

## SE4 — Kraftringen Elnät (Lund)

- **Valid**: 2026-01-01 onwards
- **Source**: [kraftringen.se/privat/elnat/elnatsavgifter/komplett-elnatsprislista](https://www.kraftringen.se/privat/elnat/elnatsavgifter/komplett-elnatsprislista/)
- All prices inkl moms on source.

| Dwelling | Fast (inkl, kr/mån) | Fast (exkl, kr/yr) | Överföring formula (inkl) | Överföring est. (exkl) |
|----------|-------------------|--------------------|--------------------------|----------------------|
| Apartment | 345 | 3,312 | 20 + 0.05 × spot | ~18.0* |
| 16A | 685 | 6,576 | 20 + 0.05 × spot | ~18.0* |

*Transfer fee is spot-linked. Estimated at typical SE4 spot ~50 öre: 20 + 2.5 = 22.5 inkl → 18.0 exkl.
No effektavgift.

### SE4 gaps
- **E.ON Energidistribution**: Dominant in SE4 (Malmö + wide area). Website returns 403. To be added.

---

## DB Seed Summary (what we inserted)

| slug | dwelling | fast_fee_sek_year | transfer_fee_ore | effect_fee_sek_kw |
|------|----------|-------------------|------------------|-------------------|
| goteborg-energi | apartment | 1,968 | 18.4 | — |
| goteborg-energi | house | 1,968 | 18.4 | 39.2 |
| ellevio | apartment | 1,152 | 20.8 | — |
| ellevio | house | 3,792 | 5.6 | 65.0 |
| vattenfall | apartment | 1,960 | 35.6 | — |
| vattenfall | house | 4,620 | 35.6 | — |
| malarenergi | apartment | 1,380 | 17.2 | — |
| malarenergi | house | 3,372 | 17.2 | 47.4 |
| skelleftea-kraft | apartment | 1,780 | 8.8 | — |
| skelleftea-kraft | house | 4,528 | 8.8 | — |
| jamtkraft | apartment | 1,992 | 6.0 | — |
| jamtkraft | house | 4,560 | 6.0 | — |
| gavle-energi | apartment | 1,596 | 12.0 | — |
| gavle-energi | house | 3,472 | 12.0 | — |
| oresundskraft | apartment | 1,932 | 15.8* | — |
| oresundskraft | house | 4,128 | 15.8* | — |
| kraftringen | apartment | 3,312 | 18.0* | — |
| kraftringen | house | 6,576 | 18.0* | — |

*Spot-linked transfer fee, estimated at typical ~50 öre/kWh spot price.

Energiskatt (36.0 öre/kWh exkl moms, 2026) is national and NOT included in any of the above.

## Gaps (to be added)

| Operator | Area | Reason |
|----------|------|--------|
| E.ON Energidistribution | SE2 + SE4 | Website/PDF returns 403 |
| Luleå Energi | SE1 | New effekttariff from Sep 2026, PDF unreadable |
| Umeå Energi | SE1 | SPA website, prices not in static HTML |
