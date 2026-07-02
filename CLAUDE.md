# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing website for **Hamil Al-Quran** (حامل القرآن), a Quran memorization/revision app. Pure static site: hand-written HTML, one shared stylesheet, vanilla JS. No framework, no package.json, no build step, no tests, no linter. The site content is French-only; code comments and the internal docs (`EMAILJS_SETUP.md`, `PRODUCTION_DEPLOYMENT.md`) are also in French.

## Commands

- **Local preview:** serve the directory statically, e.g. `python -m http.server 8000`, then open `http://localhost:8000`.
- **Deploy:** push to `master` on GitHub (`Yahia-ELECHI/hamil-al-quran-website`) — Cloudflare Pages auto-detects the push and redeploys https://hamil-al-quran.com. There is no build/lint/test command. Local `master` tracks `origin/master`; pull before working, since commits also land from other machines/sessions.

## Architecture (navy+gold redesign, 2026)

Five pages share **`css/theme.css`** (the navy+gold theme: CSS variables in `:root`, fixed animated background `.bg`/`.orb`/`.pattern`, nav, cards, panels, footer, responsive rules) and **`js/site.js`** (nav scroll state, burger menu, `.reveal` IntersectionObserver animation, hero phone carousel — each block guarded so it works on every page):

| Page | Specifics |
|------|-----------|
| `index.html` (landing) | hero with CSS iPhone mockup + auto carousel (`#track`), features, École band, tools, gallery, download badges, inline FAQ |
| `about.html`, `faq.html` | content-only; FAQ uses native `<details class="qa">` accordions |
| `contact.html` | EmailJS form — also loads EmailJS CDN, `js/emailjs-config.js`, `js/contact-form.js` |
| `privacy.html` | RGPD policy in `.legal > .panel` sections — legal wording is deliberate, don't rephrase it |

Fonts (Montserrat + Amiri + **Scheherazade New** for Arabic `--font-ar`) and Font Awesome come from CDNs in each `<head>`; there are no local dependencies.

Fragile spots learned the hard way:

- **Arabic display text**: `.hero h1` uses `background-clip:text` — Scheherazade New's harakat/ascenders/descenders overflow the em-box, so the generous `line-height`/`padding` on it are load-bearing (without them the gradient clips the glyphs).
- **Phone mockup notch** (`.phone::before`): flush against the screen edge (`top` = frame padding, background = frame top color `#1a1840`) to read as a real iPhone.
- **Grid overflow guards**: `.hero-grid>*` and `.band>*` have `min-width:0`; `.mini-phone` width is `clamp()`ed so the École band fits mobile.
- `.reveal` never hides content by default — `.in` only plays an entrance animation (deliberate no-JS safety).

### Contact form / EmailJS

`js/contact-form.js` expects this exact DOM on `contact.html`: `form.contact-form#contactForm`, fields named/id'd `name`/`email`/`subject`/`message`, error spans `#<field>-error`, counter `#message-count`. It reads `document.documentElement.lang` for message language. `js/emailjs-config.js` resolves `EMAILJS_SERVICE_ID`/`EMAILJS_TEMPLATE_ID`/`EMAILJS_PUBLIC_KEY` from Cloudflare Pages env vars, falling back to hardcoded dev values.

### Tutorials carousel (`index.html#tutoriels`)

One tab per YouTube playlist of the Hamil-Al-Quran channel (`@ye0ra7kjzd7f`); cards are hardcoded `<button class="tuto-card" data-video=… data-list=…>` with `i.ytimg.com` thumbnails. Behavior lives in `js/site.js`: coverflow scale/fade, 5s auto-advance (paused on interaction, mirrors the app's `tutorial_video_carousel.dart`), and a modal playing a **self-hosted copy** at `assets/tutos/<videoId>.mp4` in a native `<video>` element (removed on close to stop playback).

Playback is deliberately NOT a YouTube embed: the channel's videos have embedding disabled (embeds show "Vidéo non indisponible" — same reason the app extracts raw streams in `youtube_player_page.dart`), so the site mirrors the app's native-player approach. To add a tutorial: add one card button (video ID + playlist ID) and drop the mp4 (h264+aac — NOT av1; force with `-f "bv*[vcodec^=avc1]+ba[ext=m4a]" -S res:720`) into `assets/tutos/` via `python -m yt_dlp … -o "%(id)s.%(ext)s" -- <videoId>`. Playlist contents can be listed without an API key via `https://www.youtube.com/feeds/videos.xml?playlist_id=<ID>` (15 most recent). Keep files under Cloudflare Pages' 25 MiB per-file limit (each ~1-2 MB today).

### Download links

Store badges in `index.html#download` are plain `<a href>` links. The Windows link embeds the release version (`releases/download/v2.0.4/HamilAlQuran_Setup_2.0.4.exe`) — shipping a new installer means uploading the `.exe` to a GitHub Release and updating that one href. `*.exe` is gitignored; the installer in the repo root is distributed via Releases, never committed.

## Legacy files (kept, mostly unused)

`css/styles.css`, `js/main.js`, `js/i18n.js`, `js/animations.js` are the pre-redesign stack. The main site no longer loads them, but **`quran-competition-privacy.html`** (standalone privacy page for a separate app) still links `css/styles.css` — don't delete it. The old trilingual i18n system (`data-i18n` + `js/i18n.js`) is dead; the redesigned site hardcodes French.

## Repo pitfalls

- **`.history/`** contains editor-generated local-history snapshots (untracked). Searches will match stale copies of real files there — ignore those results and never edit under `.history/`.
- The `*.env` files and `deploy-r2.ps1` / `cloudflare_access_test.py` / `create_github_repo.py` present in the working tree contain real credentials and are deliberately gitignored — never stage, commit, or copy their contents into tracked files.
- `refresh.js`, `reload.js`, and `scroll.js` in the root are leftovers not referenced by any page.
- **Headless Chrome screenshots on this machine are distorted by Windows display scaling (125%)**: `--window-size=390` yields a ~484px CSS layout cropped to a 390px image (`--force-device-scale-factor=1` does not help), which fakes "mobile overflow" bugs. To screenshot a true mobile viewport, render the page inside a fixed-width `<iframe>` in a wrapper page and screenshot that (beware: `100vh` inside the iframe = iframe height). Also pass a fresh `--user-data-dir` or headless silently exits when desktop Chrome is running.
