# DNS Backup — rundumshaus-littawe.de

> **Дата:** 2026-04-16
> **Источник:** IONOS DNS Panel
> **Цель:** Rollback при проблемах с GitHub Pages

## Текущие записи (ДО изменений)

| Typ | Hostname | Wert | Service |
|-----|----------|------|---------|
| CNAME | _domainconnect | _domainconnect.ionos.com | Domain Connect |
| TXT | @ | "google-site-verification=tNlPtkkrFw-_A-JdaA52RotJ3B8T70v4mJASt1LvADs" | Domain Verification |
| MX | @ | mx00.ionos.de | Mail |
| MX | @ | mx01.ionos.de | Mail |
| TXT | @ | "v=spf1 include:_spf-eu.ionos.com ~all" | Mail |
| CNAME | _dmarc | dmarc.ionos.de | Mail |
| CNAME | s1-ionos._domainkey | s1.dkim.ionos.com | Mail |
| CNAME | s2-ionos._domainkey | s2.dkim.ionos.com | Mail |
| CNAME | autodiscover | adsredir.ionos.info | Mail |
| A | @ | 217.160.0.248 | WordPress |
| AAAA | @ | 2001:8d8:100f:f000:0:0:0:200 | WordPress |
| TXT | _dep_ws_mutex | "a614ced0caf7f0bed0eecefbf55c5e6ba998331be92815b4016c9a608297d4b2_177575..." | WordPress |
| A | www | 217.160.0.248 | WordPress |
| AAAA | www | 2001:8d8:100f:f000:0:0:0:200 | WordPress |

## Что удалять для GitHub Pages

Удалить ТОЛЬКО записи с Service = **WordPress**:
- A `@` → 217.160.0.248
- AAAA `@` → 2001:8d8:100f:f000:0:0:0:200
- A `www` → 217.160.0.248
- AAAA `www` → 2001:8d8:100f:f000:0:0:0:200

**НЕ ТРОГАТЬ:** Mail (MX, SPF, DKIM, DMARC), Domain Connect, Domain Verification, _dep_ws_mutex
