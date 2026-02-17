# AGENTS.md

This file provides guidance to coding agents working with this repository.

## Development Server Usage

For full-stack development (recommended):
- Use `npm run dev:watch` + `npm run server` in separate terminals
- Access at `http://localhost:8787`
- This runs the Cloudflare Worker with auto-rebuilding UI

For UI-only development:
- Use `npm run dev:ui`
- Access at `http://localhost:5173`
- No backend functionality; API calls will fail

Quick start:
- Use `npm run dev` for one-time build + Worker start

## Modern Cloudflare Workers Architecture (2025)

### Native Static Assets Approach

What changed:
- Migrated from KV-based static file serving to Cloudflare Workers native static assets.

File structure:
- `package.json`: production-ready server dependencies + `wrangler`
- `package.dev.json`: UI dependencies for development
- `package-lock.json`: must stay in sync with `package.json`
- `build/client/`: pre-built UI assets served by Cloudflare
- `wrangler.toml`: uses `[assets]` configuration instead of KV

How it works:
1. Cloudflare Deploy Button:
- Clones repo with `package.json` (minimal dependencies)
- Runs `npm ci` (server dependencies + `wrangler`)
- Runs `npm run deploy` -> `wrangler deploy`
- Wrangler uploads and serves static assets from `build/client/`

2. Local development:
- `npm run server` -> Wrangler serves assets automatically
- `npm run dev:watch` -> installs UI dependencies via `_dev-setup` when needed
- `_dev-setup` swaps to `package.dev.json`, installs, then restores `package.json`

### Critical Rules

1. Never modify `package.json` without updating `package-lock.json`:
```bash
npm install
git add package.json package-lock.json
```

2. Keep `wrangler` in production dependencies:
- Deploy Button needs `wrangler deploy`
- Keep it in main `package.json`, not devDependencies

3. Keep UI dependencies in `package.dev.json`:
- React, Vite, TypeScript, etc. belong there
- Do not add UI dependencies to main `package.json`

4. Commit pre-built assets in `build/client/`:
- Update when UI changes with `npm run build:client`
- Wrangler uploads this directory during deploy

5. `_dev-setup` is critical:
- Installs UI dependencies only when `node_modules/@vitejs` is missing
- Temporarily swaps package files safely

6. Workers static assets configuration:
- `wrangler.toml` uses `[assets]`, not `[site]` or KV
- `not_found_handling = "single-page-application"` for React Router
- No KV namespace is needed for static files

### Warning Signs of Breakage

- `"wrangler: not found"` -> `wrangler` missing from `package.json`
- `"npm ci"` sync errors -> `package-lock.json` out of sync
- Missing UI dependencies -> dependencies moved into main `package.json` by mistake
- Deploy Button timeout -> package became too large
- Static assets missing -> `build/client/` missing or empty

### Safe Workflow for Changes

Adding a server dependency:
1. Add to `package.json` dependencies.
2. Run `npm install`.
3. Commit both `package.json` and `package-lock.json`.

Adding a UI dependency:
1. Add to `package.dev.json`.
2. Test with `npm run dev:watch`.
3. Commit `package.dev.json` only.

Updating UI:
1. Make changes in `ui/`.
2. Run `npm run build:client`.
3. Deploy with `npm run deploy`.
4. Commit both `ui/` changes and `build/client/` updates.

## Critical Development Workflow

Always rebuild before deploying:
```bash
npm run build:client && npm run deploy
```

Or use:
```bash
npm run dev
```

Why this matters:
- Static assets are served from `build/client/`
- Changes in `ui/` are not deployed until rebuilt
- Wrangler uploads only what exists in `build/client/`

## Benefits of This Approach

- Zero cost for static asset requests (no KV read charges)
- Automatic edge caching, compression, and CDN delivery
- Simpler codebase with less custom asset-serving logic
- Better performance from direct edge asset delivery
- Single deployment command (`wrangler deploy`)
- SPA route fallback support for React Router

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
