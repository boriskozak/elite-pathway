# Elite Pathway

A single-page interactive website: a youth athlete development blueprint, from first whistle to a Division I scholarship and beyond. Covers the 5 pillars of development (game IQ, agility & speed, strength & power, mental performance, nutrition & recovery), age-based training tabs, a grade-by-grade D1 recruiting playbook with a persistent interactive checklist, a good-vs-elite scout comparison, and a motivational quotes carousel.

## Run it

No build step. This is a static site with no dependencies:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. Any static file server (or opening `index.html` directly) works too.

## Files

| File | Purpose |
|---|---|
| `index.html` | All page structure and content |
| `styles.css` | Full design system (dark theme, responsive, mobile nav) |
| `app.js` | Particle canvas hero, scroll reveals, animated counters, training tabs, recruiting checklist (persisted in `localStorage`), quotes carousel, smooth scrolling |

## Interactions

- Recruiting checklist items toggle on click and persist in `localStorage` (key: `elitePathwayChecks`), with a small confetti burst on check.
- Training tabs switch age-group content (Ages 6-8 through 15-18).
- Quotes carousel auto-advances every 5 seconds; dots are clickable.

## License

MIT, see [LICENSE](LICENSE).
