# PX-010: Icon Unification Design

**Date:** 2026-04-15
**Status:** Approved by CEO
**Responsible:** #2 Lena Schwarz (UX/UI Engineer)

## Decision Log

| Question | Answer |
|----------|--------|
| Include form ✅/❌? | YES — zero emoji on entire site |
| File architecture? | 3 files by domain (ServiceIcons untouched) |
| Dual-tone in colored buttons? | NO — white monotone in gold/green buttons |

## Architecture

| File | Icons | Count |
|------|-------|-------|
| `ServiceIcons.tsx` | NOT TOUCHED | 5+1 |
| `WarumWirIcons.tsx` | Clock, Sparkle, PriceTag, Calendar, Handshake | 5 |
| `ContactIcons.tsx` | Phone, Chat, Envelope, MapPin, CheckCircle, XCircle | 6 |

## SVG Style (unified)

```
viewBox="0 0 24 24"
fill="none"
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth="1.5"
Two <g> groups: text-charcoal (base) + text-copper (accent)
```

## Color Context

| Location | Background | Icon Color |
|----------|-----------|------------|
| WarumWir cards | bg-charcoal-light/30 (dark) | cream + copper override |
| Contact gold button | bg-gold | text-white monotone |
| Contact green button | bg-[#25D366] | text-white monotone |
| Contact links | bg-cream-dark/50 (light) | dual-tone charcoal + copper |
| Footer contacts | bg-charcoal (dark) | text-cream/80 monotone |
| Form success | white | dual-tone charcoal + copper |
| Form error | white | dual-tone charcoal + copper |

## Emoji-to-Icon Mapping

### WarumWirIcons.tsx

| Emoji | Component | Charcoal | Copper Accent |
|-------|-----------|----------|---------------|
| 🕐 | ClockIcon | Dial (circle) | Hands |
| ✨ | SparkleIcon | Main star | Small sparks |
| 💰 | PriceTagIcon | Shield/tag | Euro sign |
| 📅 | CalendarIcon | Frame | Date mark |
| 🤝 | HandshakeIcon | Hands | Connection line |

### ContactIcons.tsx

| Emoji | Component | Charcoal | Copper Accent |
|-------|-----------|----------|---------------|
| 📞 | PhoneIcon | Handset | Signal waves |
| 💬 | ChatIcon | Bubble | Dots inside |
| ✉️ | EnvelopeIcon | Envelope body | Flap |
| 📍 | MapPinIcon | Pin body | Center dot |
| ✅ | CheckCircleIcon | Circle | Checkmark |
| ❌ | XCircleIcon | Circle | X mark |

## Files Changed

- CREATE: `src/components/WarumWirIcons.tsx`
- CREATE: `src/components/ContactIcons.tsx`
- MODIFY: `src/components/sections/WarumWir.tsx`
- MODIFY: `src/components/sections/ContactForm.tsx`
- MODIFY: `src/components/layout/Footer.tsx`
- NO CHANGE: `src/components/ServiceIcons.tsx`
