# Kenva Labs

Product and technology leadership, embedded in the client's team. Based in Barcelona.

Site: [kenvalabs.com](https://kenvalabs.com)  
Contact: david@kenvalabs.com

## Stack

Static HTML, CSS and JavaScript. No build step, no dependencies, no framework.

## Local development

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

Deploy to any static host: Vercel, Netlify, or GitHub Pages. No build command needed.

## DNS

If `kenva.ai` is configured as a domain, set up a 301 redirect from `kenva.ai`
to `kenvalabs.com` at the DNS or hosting provider level. This is not implemented
in the repository.

## Pending

- Replace the `href="#"` booking link in the Contact section with a real URL (e.g. Calendly).
- ~~Add an `og:image`~~ Done. Regenerate `og.png` and `linkedin-cover.png` with `python3 scripts/gen_og.py` (the claim is the `CLAIM` constant).
