# 🏢 Playwright SDET Enterprise Automation Framework

A scalable, maintainable, and interview-ready **end-to-end test automation framework** built with Playwright and TypeScript, designed using **enterprise SDET architecture principles**.

---

# 🚀 Overview

This framework demonstrates a **real-world QA automation architecture** used in modern SDET teams.

It follows a strict layered model:

```
Tests → Flows → Pages → Fixtures → Core Utilities
```

This ensures:

- High scalability
- Low maintenance cost
- Reduced flakiness
- Clean separation of concerns

---

# 🧱 Architecture Design

## 🔹 1. Test Layer (Intent Layer)

> Business-readable test scenarios

- No locators
- No UI logic
- No setup duplication

Example:

```ts
await flows.checkout.completeOrder(userData);
```

---

## 🔹 2. Flow Layer (Business Layer ⭐ CORE)

> Represents real user journeys

Examples:

- LoginFlow
- CartFlow
- CheckoutFlow

Responsibilities:

- Orchestrates page interactions
- Encapsulates business logic
- Reusable across test suites

---

## 🔹 3. Page Layer (UI Layer)

> Pure UI interaction layer

Responsibilities:

- Locators
- Click / Fill / Select actions
- No assertions (except page state checks)

---

## 🔹 4. Fixture Layer (Dependency Injection)

> Bootstraps test environment

Provides:

- Browser context
- Page instance
- Page objects

Ensures consistency across all tests

---

## 🔹 5. Core Layer

> Shared utilities and base abstractions

Includes:

- BasePage (actions, assertions, steps)
- Logging utilities
- Reporting hooks

---

# 📁 Project Structure

```
project-root/
│
├── tests/              # Test specs (business intent only)
├── pages/              # UI layer (locators + actions)
├── flows/              # Business workflows (SDET layer)
├── fixtures/           # Test setup & dependency injection
├── config/             # Environment configuration
├── data/               # Test data
├── core/               # Base classes & utilities
├── playwright.config.ts
└── README.md
```

---

# ⚙️ Key Features

## 🧪 Test Execution

- Parallel execution enabled
- Retry strategy for CI stability
- Tag-based filtering (@smoke, @regression)

## 📊 Reporting

- HTML reports
- Allure integration (enterprise-ready setup)
- Attachments on failure (screenshots, HTML snapshots)

## 🔐 Authentication

- Storage state-based login
- Global setup support
- Session reuse across tests

## 🧠 Stability Enhancements

- BasePage abstraction
- Built-in step logging
- Auto screenshots on failure
- URL validation utilities

---

# 🧩 Example Test (Clean SDET Style)

```ts
import { test } from '../fixtures/base.fixture';


test('TC017 - Complete checkout flow', async ({ flows }) => {
  await flows.cart.addItemToCart('Backpack');
  await flows.cart.openCart();

  await flows.checkout.completeOrder({
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '00100'
  });
});
```

---

# 🔄 Design Principles

## ✔ Separation of Concerns

Each layer has a single responsibility

## ✔ Reusability First

Flows are reusable across multiple test suites

## ✔ Maintainability

UI changes only affect Page Layer

## ✔ Scalability

New features require only Flow additions, not test rewrites

---

# 🧪 CI/CD Integration

Supports:

- GitHub Actions
- Parallel execution
- Artifact uploads
- Test report publishing

---

# 📦 Installation

```bash
npm install
npx playwright install
```

---

# ▶️ Running Tests

```bash
# Run all tests
npx playwright test

# Run smoke tests
npx playwright test --grep @smoke

# Run regression tests
npx playwright test --grep @regression
```

---

# 📊 Reporting

```bash
npx playwright show-report
```

---

# 🏁 Goal of This Framework

This project is designed to demonstrate:

- Real-world SDET architecture thinking
- Scalable automation design
- CI/CD readiness
- Interview-level framework design skills

---

# 🧠 Author Intent

This framework is intentionally structured to reflect:

> “How senior SDETs design automation frameworks in production teams”

Not:

- tutorial-level scripts
- basic Page Object Model only

---

# 🚀 Next Evolution Path

Planned upgrades:

- API + UI hybrid flows
- Contract testing integration
- Visual regression testing
- Flaky test detection system
- Distributed test execution (grid)

---

# ✅ Status

✔ Production-grade architecture ✔ Interview-ready ✔ Scalable to enterprise level

