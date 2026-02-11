# Playwright + Cucumber TodoMVC E2E Demo

[![E2E Pipeline example](https://github.com/rubenlopez77/E2E-Playwright-DEMO/actions/workflows/playwright.yml/badge.svg)](https://github.com/rubenlopez77/E2E-Playwright-DEMO/actions/workflows/playwright.yml)


It demonstrates a robust, scalable, and maintainable architecture designed for high-performance parallel execution.

## ⚠️ Notes / Disclaimer

>This repository is intentionally **more structured than a minimal “exercise-only” implementation**.
>The goal is not to add unnecessary complexity, but to demonstrate a **solid architectural baseline** that 
>can scale beyond a single scenario:
>- Maintainable Page Objects with reusable components
>- Consistent interaction patterns (stable locators + meaningful post-action checks)
>- Clear boundaries for future extensions (instrumentation, reporting, and CI)
>In a real product, this approach reduces long-term cost and flakiness, and makes the test suite easier to evolve with the application.

---

## 🚀 Key Features

The codebase is SOLID-aligned: responsibilities are separated (World/Hooks vs Pages vs Components), domain-facing APIs keep step definitions declarative, and the structure is designed to be extended (e.g., telemetry/JSON reporting) with minimal impact on existing tests.

### 1. Robust Page Object Model (POM)
- **Layered Design**: 
  - **Features/Steps (Intent)**: Declaration of business requirements (What).
  - **Page Objects (Design)**: Acts as the **Orchestrator**. It knows "how" to satisfy the intent by combining multiple components. It does not touch the DOM directly.
  - **Components (Execution)**: Acts as the **Driver**. It owns the `Locator` and performs the low-level Playwright interactions (click, fill, assertion).
- **Composition & Inheritance Strategy (Mixed Model)**:
  - **BasePage**: Used for orchestrators like `HomePage` that manage navigation and app-ready states.
  - **BaseComponent as Page**: Functional pages like `TodoPage` extend `BaseComponent`, treating the entire page as a component to reuse low-level interactions.
  - **Composition**: Pages are composed of atomic components (`inputBox`, `todoList`). `TodoPage` does NOT extend `HomePage`.

> **💡 Architectural Decision: Why a Mixed Model?**
> We deliberately avoid a single `BasePage` for everything.
> - **Infrastructure vs Domain**: `HomePage` acts as a Gateway/Router (Infrastructure), so it needs navigation capabilities (`BasePage`).
> - **Scope Control**: `TodoPage` is a collection of domain interactions (Domain), so it inherits from `BaseComponent`. This prevents "God Objects" where every page has access to unrelated global methods (like cookies or URL manipulation), keeping the API surface clean for the Step Definitions.
- **Encapsulation**: Components are `private readonly` within Pages. Steps interact *only* via domain-level methods (e.g., `addTask`, `verifyTaskCount`).
- **Typed Locators**: 100% usage of Playwright's `Locator` API (no legacy selectors or `ElementHandle`).
- **State Validation**: Strict assertions for state preservation (e.g., after reload).

### 2. High-Performance Parallel Execution
- **Thread-safe Singleton Browser**: The browser instance is launched **once** per node (Singleton) but lazy-initialized in a thread-safe manner to prevent race conditions during parallel starts.
- **Context Isolation**: Each scenario runs in a **fresh Browser Context**, ensuring 100% isolation of cookies, localStorage, and session state.
- **Zero Race Conditions**: `static browserPromise` pattern ensures stability even when multiple workers start simultaneously.

### 3. Stability & Reliability
- **No Explicit Waits**: Zero usage of `waitForTimeout` or sleeps. Relies entirely on Playwright's auto-waiting and web-first assertions.
- **Dynamic Configuration**: `BASE_URL` and environment settings are centralized in `CustomWorld` with sensible defaults, allowing tests to run "out-of-the-box".
- **Self-Healing**: Artifacts (screenshots) are automatically captured and attached to the report upon failure.

### 4. Code Quality Standards
- **Standardized Imports**: Strict usage of `@playwright/test` for all types and imports.
- **Clean Naming**: Neutral naming conventions (CustomWorld) suitable for enterprise-grade repositories.
- **Page Object Caching**: Page objects are cached per scenario to reduce instantiation overhead.



---

## Quality Standards Compliance (ISTQB)

While this is a coding exercise, the structure follows ISTQB-oriented good practices:

Scenarios represent an executable test basis with clear, verifiable acceptance criteria. Each validation uses explicit test oracles (not “looks good”), improving determinism and reducing false positives. The framework is prepared for consistent evidence collection (screenshots/artifacts) and structured reporting for traceability.

- ✅ **Test Basis**: Gherkin scenarios serve as the single source of truth for requirements.
- ✅ **Clear Oracle**: No "guessing". Every test has deterministic assertions (Web-first assertions).
- ✅ **Traceability**: 1:1 mapping between Business Intent (Feature) and Execution (Step).
- ✅ **Evidence**: Automatic screenshot capture on failure for audit trails.
- ✅ **Repeatability**: Deterministic execution via thread-safe Singleton Browser.
- ✅ **Isolation**: Zero shared state. Each test runs in a fresh BrowserContext.
- ✅ **Prioritization**: Support for `@smoke`, `@regression`, and `@critical` tags.
- ✅ **Exit Criteria**: Pipeline fails automatically if quality gates (tests) are not met.

---

## 🛠️ Project Structure

```text
src/
├── components/      # Reusable UI components (Locator + Actions)
├── pages/           # Page Objects (Domain Flows)
├── steps/           # Cucumber Step Definitions
├── support/         # World, Hooks, and Types
│   ├── world.ts     # CustomWorld (Browser Lifecycle & State)
│   ├── hooks.ts     # Global Hooks (Before/After/AfterAll)
│   └── types.ts     # Type Augmentation
└── ux/              # Locator Definitions (Separation of Concerns)
features/            # Gherkin Feature Files

```


## Why a Components Layer (in addition to Page Objects)

Alongside Page Objects, the project includes a **Components layer** (e.g., TodoList, TodoItem, shared UI widgets).  
This is a deliberate design choice to keep the suite **modular and resilient**:

- **Single Responsibility:** pages represent flows at page level; components represent reusable UI building blocks.
- **Reduced duplication:** common interactions (e.g., item deletion, list assertions) live in `BaseComponent` or specific components.
- **Smaller blast radius:** UI changes affect a component or a page, not every test.
- **Cleaner steps:** step definitions remain declarative and readable, delegating “how” to pages/components.

---

## How to Run

### Prerequisites
- Node.js v18+
- NPM

### Installation
```bash
npm ci
npx playwright install --with-deps
```

### Run Tests
```bash
# Run all tests
npm test

# Run with specific tags
npm test -- --tags "@smoke"

# Run in parallel (e.g., 2 workers)
npm test -- --parallel 2
```

### Environment Variables
The framework runs with sensible defaults, but you can override them:

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://demo.playwright.dev/todomvc/` | Target Application URL |
| `HEADLESS` | `false` | Run browser in headless mode (`true` for CI) |
| `BROWSERS` | `chromium` | Target browser (`chromium`, `firefox`, `webkit`) |
| `TRACE` | `true` | Capture full execution traces (snapshots, console logs, network) |

---

## 📊 Reports & Artifacts

- **Console**: Standard Cucumber formatter.
- **HTML Report**: Generated at `cucumber-report.html`.
---

### 🔄 CI/CD (GitHub Actions)

The repository includes a simple GitHub Actions workflow (`.github/workflows/playwright.yml`) that:
1. Installs dependencies and browsers.
2. Runs the test suite.
3. Uploads reports and screenshots as artifacts (always, even on failure).

### 🕵️ Playwright Tracing
I have added the capability to capture full execution traces (snapshots, console logs, network) to facilitate deep debugging of complex failures. 
To enable this feature, you must set the environment variable `TRACE=true`, as it is disabled by default to optimize performance.


👨‍💻 ## Author
Rubén López ruben@rulope.com
[🔗 LinkedIn](https://www.linkedin.com/in/ruben-lopez-qa/)