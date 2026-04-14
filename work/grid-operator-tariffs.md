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

Energiskatt (36.0 öre/kWh exkl moms, 2026) is national and NOT included in any of the above.
