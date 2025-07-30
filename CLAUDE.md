# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Server Usage

**For full-stack development (recommended):**
- Use `npm run dev:watch` + `npm run server` in separate terminals
- Access at http://localhost:8787
- This runs the Cloudflare Worker with auto-rebuilding UI

**For UI-only development:**
- Use `npm run dev:ui` 
- Access at http://localhost:5173
- No backend functionality, API calls will fail

**Quick start:**
- Use `npm run dev` for one-time build + Worker start

## Modern Cloudflare Workers Architecture - UPDATED 2025

### New Native Static Assets Approach

**What Changed:**
Migrated from complex KV-based static file serving to Cloudflare Workers native static assets support (2025 best practice).

**The Modern Solution:**

### File Structure:
- **`package.json`** → Production-ready (server deps + wrangler only)
- **`package.dev.json`** → All UI dependencies for development  
- **`package-lock.json`** → MUST stay in sync with `package.json`
- **`build/client/`** → Pre-built UI assets (automatically served by Cloudflare)
- **`wrangler.toml`** → Uses `[assets]` configuration instead of KV

### How It Works:

1. **Cloudflare Deploy Button:**
   - Clones repo with `package.json` (minimal deps)
   - Runs `npm ci` (installs only server deps + wrangler)
   - Runs `npm run deploy` → `wrangler deploy`
   - Wrangler automatically uploads and serves static assets from `build/client/`
   - ✅ Zero-cost static requests, automatic edge caching

2. **Local Development:**
   - `npm run server` → Wrangler serves assets automatically
   - `npm run dev:watch` → Auto-installs UI deps when needed via `_dev-setup`
   - `_dev-setup` script temporarily swaps to `package.dev.json`, installs, then restores
   - ✅ Simplified development, no manual asset management

### CRITICAL RULES - DO NOT BREAK:

1. **Never modify `package.json` without updating `package-lock.json`:**
   ```bash
   # Always run after changing package.json:
   npm install
   git add package.json package-lock.json
   ```

2. **Keep wrangler in production dependencies:**
   - Deploy Button needs `wrangler deploy` command
   - Must be in main `package.json`, not devDependencies

3. **Keep UI dependencies in `package.dev.json` only:**
   - React, Vite, TypeScript, etc. go here
   - Never add to main `package.json` 

4. **Commit pre-built assets in `build/client/`:**
   - These are automatically served by Workers static assets
   - Update when UI changes: `npm run build:client`
   - No manual upload needed - Wrangler handles everything

5. **The `_dev-setup` script is critical:**
   - Only installs UI deps when `node_modules/@vitejs` missing
   - Temporarily swaps package files safely
   - Don't modify without understanding the flow

6. **Workers static assets configuration:**
   - `wrangler.toml` uses `[assets]` not `[site]` or KV
   - `not_found_handling = "single-page-application"` for React Router
   - No KV namespace needed for static files

### Warning Signs of Breakage:

- ❌ "wrangler: not found" → wrangler missing from `package.json`
- ❌ "npm ci sync error" → `package-lock.json` out of sync
- ❌ "Missing dependencies" → UI deps accidentally in main `package.json`
- ❌ Deploy Button timeout → package too large
- ❌ "Static assets not found" → `build/client/` directory missing or empty

### Safe Workflow for Changes:

```bash
# Adding server dependency:
1. Add to package.json dependencies
2. Run: npm install
3. Commit both package.json and package-lock.json

# Adding UI dependency:
1. Add to package.dev.json
2. Test with: npm run dev:watch
3. Commit package.dev.json only

# Updating UI:
1. Make changes in ui/
2. Run: npm run build:client  
3. Deploy: npm run deploy (Wrangler uploads assets automatically)
4. Commit both ui/ changes and build/client/ updates

## CRITICAL DEVELOPMENT WORKFLOW

**⚠️ ALWAYS REBUILD BEFORE DEPLOYING:**
```bash
# Correct workflow for UI changes:
npm run build:client && npm run deploy

# Or use the combined dev script:
npm run dev  # builds + deploys automatically
```

**Why this matters:**
- Static assets are served from `build/client/` directory
- Changes in `ui/` don't affect deployment until rebuilt
- Forgetting to rebuild = old assets deployed = broken functionality
- Wrangler only uploads what's in `build/client/`, not source files
```

## Benefits of Modern Approach:

- **Zero cost** for static asset requests (no KV read charges)
- **Automatic optimization** - edge caching, compression, CDN delivery
- **Simplified codebase** - removed 150+ lines of complex asset logic
- **Better performance** - assets served directly from Cloudflare edge
- **Single deployment** - `wrangler deploy` handles everything atomically
- **SPA support** - automatic fallback routing for React Router

This modernized system follows Cloudflare's 2025 best practices while maintaining Deploy Button compatibility!

# Using Gemini CLI for Large Codebase Analysis

When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
context window. Use `gemini -p` to leverage Google Gemini's large context capacity.

## File and Directory Inclusion Syntax

Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
gemini command:

### Examples:

**Single file analysis:**
```bash
gemini -p "@src/main.py Explain this file's purpose and structure"

Multiple files:
gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"

Entire directory:
gemini -p "@src/ Summarize the architecture of this codebase"

Multiple directories:
gemini -p "@src/ @tests/ Analyze test coverage for the source code"

Current directory and subdirectories:
gemini -p "@./ Give me an overview of this entire project"

#
Or use --all_files flag:
gemini --all_files -p "Analyze the project structure and dependencies"

Implementation Verification Examples

Check if a feature is implemented:
gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"

Verify authentication implementation:
gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"

Check for specific patterns:
gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"

Verify error handling:
gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"

Check for rate limiting:
gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"

Verify caching strategy:
gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"

Check for specific security measures:
gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"

Verify test coverage for features:
gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"

When to Use Gemini CLI

Use gemini -p when:
- Analyzing entire codebases or large directories
- Comparing multiple large files
- Need to understand project-wide patterns or architecture
- Current context window is insufficient for the task
- Working with files totaling more than 100KB
- Verifying if specific features, patterns, or security measures are implemented
- Checking for the presence of certain coding patterns across the entire codebase

Important Notes

- Paths in @ syntax are relative to your current working directory when invoking gemini
- The CLI will include file contents directly in the context
- No need for --yolo flag for read-only analysis
- Gemini's context window can handle entire codebases that would overflow Claude's context
- When checking implementations, be specific about what you're looking for to get accurate results # Using Gemini CLI for Large Codebase Analysis


When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
context window. Use `gemini -p` to leverage Google Gemini's large context capacity.


## File and Directory Inclusion Syntax


Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
gemini command:


### Examples:


**Single file analysis:**
```bash
gemini -p "@src/main.py Explain this file's purpose and structure"


Multiple files:
gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"


Entire directory:
gemini -p "@src/ Summarize the architecture of this codebase"


Multiple directories:
gemini -p "@src/ @tests/ Analyze test coverage for the source code"


Current directory and subdirectories:
gemini -p "@./ Give me an overview of this entire project"
# Or use --all_files flag:
gemini --all_files -p "Analyze the project structure and dependencies"


Implementation Verification Examples


Check if a feature is implemented:
gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"


Verify authentication implementation:
gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"


Check for specific patterns:
gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"


Verify error handling:
gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"


Check for rate limiting:
gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"


Verify caching strategy:
gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"


Check for specific security measures:
gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"


Verify test coverage for features:
gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"


When to Use Gemini CLI


Use gemini -p when:
- Analyzing entire codebases or large directories
- Comparing multiple large files
- Need to understand project-wide patterns or architecture
- Current context window is insufficient for the task
- Working with files totaling more than 100KB
- Verifying if specific features, patterns, or security measures are implemented
- Checking for the presence of certain coding patterns across the entire codebase


Important Notes


- Paths in @ syntax are relative to your current working directory when invoking gemini
- The CLI will include file contents directly in the context
- No need for --yolo flag for read-only analysis
- Gemini's context window can handle entire codebases that would overflow Claude's context
- When checking implementations, be specific about what you're looking for to get accurate results
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.