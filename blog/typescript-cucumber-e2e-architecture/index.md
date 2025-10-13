---
title: "TypeScript Cucumber E2E Testing: Beyond the Basics"
tags:
  - typescript
  - cucumber
  - e2e-testing
  - selenium
  - testing
  - automation
  - quality-engineering
topic: testing
description: "We built a production-grade Cucumber E2E testing infrastructure for TypeScript and discovered patterns that actually work. Here's what matters for reliable testing."
created: "2025-10-13T10:00:00Z"
featuredImage: typescript-cucumber-e2e-post.jpg
author: Senad Redzic
---

<div class="bg-gray-light rounded-lg px-6 py-2 mb-12">
  <h2 class="text-2xl font-bold text-primary -mt-8 mb-6">TL;DR</h2>
  
  <p class="text-lg mb-6">
    Most Cucumber tutorials stop at basic examples. We built a production TypeScript E2E architecture that actually scales. 
    Type-safe Custom World, Webpack bundling for faster CI, stable locators, and proper async patterns. 
    Here's what works after running 100+ scenarios in production.
  </p>
</div>

## Why Architecture Matters

You can write Cucumber tests in an afternoon. You can't maintain them without architecture.

The difference between tests that rot and tests that scale is architecture. Type safety prevents refactoring disasters. Shared context eliminates global state. Proper waits stop flaky failures.

This isn't about following best practices. It's about patterns that survive production.

## The Problem Most Teams Hit

**Tests break on every UI change.** Brittle selectors coupled to implementation details.

**No type safety between tests and application.** Your app is TypeScript. Your tests are JavaScript. Every refactoring breaks tests at runtime.

**Stakeholders can't read tests.** Product managers see code, not requirements.

**Flaky in CI/CD.** Tests pass locally, fail in pipelines. You add sleeps. They get slower. Still flaky.

## Our Tech Stack

We use Webpack to bundle test code. Not because Cucumber requires it—it doesn't. Modern Cucumber runs TypeScript directly via `ts-node`.

We bundle because:

- **Faster CI startup**: Pre-bundled tests start in seconds, not minutes
- **Dependency management**: One bundle, no node_modules in CI
- **Consistency**: Same build pipeline as our application

⚙️ **Note**: If you don't need these benefits, skip Webpack. Use `cucumber-js --import ts-node/register` and you're done.

Our stack:

- **Cucumber** for Gherkin → step mapping
- **TypeScript** for type safety
- **Selenium WebDriver** for browser automation (Playwright is better for new projects)
- **Webpack** for bundling (optional, but we like it)

## The Custom World Pattern

Cucumber's default World is `any`. No types, no autocomplete, no safety.

A Custom World gives you:

- Type-safe access to browser, database, config
- Shared context between steps
- Compile-time errors instead of runtime failures

### Implementation

```typescript
// types/CustomWorld.ts
import { IWorld } from "@cucumber/cucumber";
import { WebDriver } from "selenium-webdriver";
import { Db } from "mongodb";

export interface CustomWorld extends IWorld {
  browser: WebDriver;
  database: Db;
  config: {
    appUrl: string;
    apiUrl: string;
  };
  // Scenario-specific state
  currentUser?: {
    email: string;
    id: string;
  };
}
```

### Using It

```typescript
// steps/auth.steps.ts
import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../types/CustomWorld";

Given("I am logged in", async function (this: CustomWorld) {
  // TypeScript knows 'this.browser' exists
  await this.browser.get(`${this.config.appUrl}/login`);

  // Store state for later steps
  this.currentUser = {
    email: "test@example.com",
    id: "user-123",
  };
});
```

💡 **Tip**: The `this: CustomWorld` type annotation gives you autocomplete and compile-time safety. Without it, you're back to `any`.

## Setup and Teardown

Fresh state for every scenario. No shared state, no flaky tests.

```typescript
// support/hooks.ts
import { Before, After } from "@cucumber/cucumber";
import { Builder, Browser } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { CustomWorld } from "../types/CustomWorld";

Before(async function (this: CustomWorld) {
  // 1. Initialize config
  this.config = {
    appUrl: process.env.APP_URL || "http://localhost:3000",
    apiUrl: process.env.API_URL || "http://localhost:8080",
  };

  // 2. Connect to test database
  this.database = await connectToTestDatabase();
  await seedTestData(this.database);

  // 3. Create browser
  const options = new chrome.Options();
  options.addArguments("--headless=new");
  options.addArguments("--window-size=1920,1080");
  options.addArguments("--disable-gpu");
  // Only add --no-sandbox if your containerized CI requires it

  this.browser = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
});

After(async function (this: CustomWorld, { result }) {
  // Save screenshot on failure
  if (result?.status === "FAILED") {
    const screenshot = await this.browser.takeScreenshot();
    await this.attach(screenshot, "image/png");
  }

  // Clean up
  if (this.browser) {
    await this.browser.quit();
  }
});
```

**Why this order matters**: Config first (everything needs it), database second (seeding needs connection), browser last (slowest to create).

## Writing Stable Steps

Bad steps break on every UI change. Good steps describe user behavior.

### ❌ Bad: Coupled to Implementation

```typescript
When(
  "user clicks button with id submit-form-button-primary",
  async function () {
    await this.browser.findElement(By.id("submit-form-button-primary")).click();
  },
);
```

This breaks when:

- ID changes
- Button becomes a link
- UI framework changes

### ✅ Good: User Behavior

```typescript
When("the user submits the form", async function (this: CustomWorld) {
  const submitButton = await this.browser.findElement(
    By.css("[data-testid='submit-button']"),
  );
  await submitButton.click();
});
```

💡 **Tip**: Use `data-testid` attributes. They're stable, semantic, and survive UI refactoring.

### ✅ Better: Reusable with Parameters

```typescript
When(
  "the user clicks {string}",
  async function (this: CustomWorld, testId: string) {
    const element = await this.browser.findElement(
      By.css(`[data-testid='${testId}']`),
    );
    await element.click();
  },
);
```

Now one step works for many scenarios:

```gherkin
When the user clicks "submit-button"
When the user clicks "cancel-button"
When the user clicks "save-draft-button"
```

## The Wait Pattern

Never use `sleep`. Always wait for conditions.

### ❌ Bad: Arbitrary Wait

```typescript
await sleep(2000); // Hope 2 seconds is enough
```

### ✅ Good: Explicit Wait

```typescript
import { until } from "selenium-webdriver";

// Wait for element to exist
await this.browser.wait(
  until.elementLocated(By.css("[data-testid='dashboard']")),
  5000,
);

// Wait for element to be visible
const element = await this.browser.findElement(By.css("[data-testid='modal']"));
await this.browser.wait(until.elementIsVisible(element), 5000);
```

**Why this works**: Waits stop as soon as the condition is met. Tests are faster and more reliable. Clear timeout errors when things fail.

## Playwright Alternative

Selenium works, but Playwright is better for new projects:

```typescript
// support/hooks.ts
import { Before } from "@cucumber/cucumber";
import { chromium, Page, Browser } from "@playwright/test";
import { CustomWorld } from "../types/CustomWorld";

// Extend CustomWorld for Playwright
interface PlaywrightWorld extends CustomWorld {
  browser: Browser;
  page: Page;
}

Before(async function (this: PlaywrightWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.page = await this.browser.newPage();
});

// Steps are cleaner
When(
  "the user clicks {string}",
  async function (this: PlaywrightWorld, buttonText: string) {
    await this.page.getByRole("button", { name: buttonText }).click();
  },
);
```

**Why Playwright**: Better selectors, automatic waiting, faster execution, better debugging.

## Database Integration

E2E tests verify through the UI, not the database.

### Seeding Test Data

```typescript
async function seedTestData(db: Db) {
  // Clear existing data
  await db.collection("users").deleteMany({});
  await db.collection("products").deleteMany({});

  // Seed known data
  await db.collection("users").insertOne({
    email: "test@example.com",
    name: "Test User",
    role: "admin",
  });

  await db.collection("products").insertMany([
    { name: "Product A", price: 100, stock: 50 },
    { name: "Product B", price: 200, stock: 30 },
  ]);
}
```

### ❌ Bad: Direct Database Verification

```typescript
Then("the user should exist in the database", async function () {
  const user = await this.database
    .collection("users")
    .findOne({ email: "test@example.com" });

  expect(user).toBeDefined();
});
```

This couples your test to implementation. What if you switch databases? What if the schema changes?

### ✅ Good: UI Verification

```typescript
Then("I should see my account", async function (this: CustomWorld) {
  const accountName = await this.browser.findElement(
    By.css("[data-testid='account-name']"),
  );
  const text = await accountName.getText();
  expect(text).toBe("Test User");
});
```

**Rule**: E2E tests verify through the UI. Database assertions belong in integration tests.

## Writing Good Feature Files

Gherkin describes user behavior, not technical implementation.

### ✅ Good Structure

```gherkin
Feature: User Registration

  Scenario: Successful registration
    Given I am on the registration page
    When I enter valid details
    And I submit the form
    Then I should see a success message
    And my account should be created
```

Anyone can read this. Product managers, designers, developers.

### ❌ Bad Structure

```gherkin
Feature: User Registration

  Scenario: Test case 1
    Given database table users is empty
    When POST /api/register with email and password
    Then status code is 201
    And database has 1 record in users table
```

This tests implementation, not user behavior. It's an API test disguised as a feature.

### Parameterized Scenarios

```gherkin
Scenario Outline: Invalid registration inputs
  Given I am on the registration page
  When I enter "<input>" as the <field>
  Then I should see an error "<error>"

  Examples:
    | input         | field    | error                  |
    | invalid-email | email    | Invalid email format   |
    | 123           | password | Password too weak      |
    | ab            | username | Username too short     |
```

One scenario, multiple test cases.

## Webpack Configuration

We bundle tests with Webpack. Here's why and how.

### Why Bundle

1. **Faster CI startup**: Bundled tests start in 2 seconds vs 30 seconds for `node_modules`
2. **Dependency control**: One bundle, no version conflicts
3. **Consistency**: Same build pipeline as our application

### Configuration

```javascript
// webpack.test.config.js
const { glob } = require("glob");
const path = require("path");

const stepFiles = glob.sync("tests/steps/**/*.ts");

module.exports = {
  mode: "development",
  target: "node",
  entry: stepFiles.reduce((entries, file) => {
    const name = path.basename(file, ".ts");
    entries[name] = file;
    return entries;
  }, {}),
  output: {
    path: path.resolve(__dirname, "dist/tests"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
```

### Cucumber Configuration

```javascript
// cucumber.config.js
export default {
  require: ["dist/tests/**/*.js"], // Load bundled code
  format: [
    "progress", // Console output
    "json:reports/cucumber.json", // For dashboards
    "html:reports/cucumber.html", // Human-readable
    "junit:reports/cucumber.xml", // CI systems
  ],
  parallel: 2, // Run scenarios in parallel
};
```

### Build Script

```json
{
  "scripts": {
    "test:build": "webpack --config webpack.test.config.js",
    "test:run": "cucumber-js",
    "test": "npm run test:build && npm run test:run"
  }
}
```

⚙️ **Note**: If you don't need bundling, skip Webpack entirely. Use `cucumber-js --import ts-node/register` and point `--require` to your TypeScript files.

## CI/CD Integration

Tests need to run reliably in pipelines.

### Start the Application

```javascript
// scripts/run-e2e-tests.js
const { exec } = require("child_process");
const fetch = require("node-fetch");

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await fetch(url);
      return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error(`Server not ready after ${timeout}ms`);
}

async function main() {
  // Start server
  const server = exec("node dist/server/index.js");

  // Wait for health check
  await waitForServer("http://localhost:8080/health");

  // Run tests
  const tests = exec("npm run test");

  tests.on("exit", (code) => {
    server.kill();
    process.exit(code);
  });
}

main();
```

### Generate Reports

```javascript
// cucumber.config.js
export default {
  format: [
    "progress", // Development
    "json:reports/cucumber.json", // For tools
    "html:reports/cucumber.html", // For humans
    "junit:reports/cucumber.xml", // For Jenkins/GitLab
  ],
};
```

**Why multiple formats**: `progress` for development, `json` for dashboards, `junit` for CI integration.

### Handle Failures

```typescript
After(async function (this: CustomWorld, { result }) {
  if (result?.status === "FAILED") {
    // Screenshot
    const screenshot = await this.browser.takeScreenshot();
    await this.attach(screenshot, "image/png");

    // Page HTML for debugging
    const html = await this.browser.getPageSource();
    await this.attach(html, "text/html");

    // Console logs (if using Playwright)
    // const logs = await this.page.evaluate(() => console.log);
    // await this.attach(JSON.stringify(logs), "application/json");
  }
});
```

💡 **Tip**: Attach screenshots, HTML, and logs. Future you will thank past you when debugging CI failures.

## Common Mistakes

### Mistake 1: Too Much Detail in Features

```gherkin
# ❌ Bad
When I click the button with CSS selector ".submit-btn"
And I wait 2 seconds
Then the div with class "success" should contain text "Done"

# ✅ Good
When I submit the form
Then I should see a success message
```

Features describe behavior, not implementation.

### Mistake 2: Shared State Between Tests

```typescript
// ❌ Bad: Global variable
let testUser;

Before(async function () {
  testUser = await createUser();
});
```

Flaky tests guaranteed. Use the World:

```typescript
// ✅ Good: World state
Before(async function (this: CustomWorld) {
  this.currentUser = await createUser();
});
```

### Mistake 3: No Type Safety

```javascript
// ❌ Bad: Plain JavaScript
Given("user exists", async function () {
  this.user = await findUser(); // What properties does user have?
});
```

```typescript
// ✅ Good: TypeScript
Given("user exists", async function (this: CustomWorld) {
  this.currentUser = await findUser(); // TypeScript knows the type
});
```

## What Actually Works

After 100+ scenarios in production:

**Type safety is worth it.** Refactoring is safe. New developers understand the code. Autocomplete catches typos.

**Fresh state prevents flakiness.** Resetting database before each test eliminated 90% of flaky tests.

**Readable features improve communication.** Product managers catch requirement mismatches early. Tests become living documentation.

**Explicit waits, not sleeps.** Tests are faster and more reliable. Clear timeout errors when things fail.

**Webpack bundling speeds up CI.** 2-second startup vs 30-second `node_modules` install.

## Getting Started

Start small:

1. **Create a Custom World interface** - Add types to your test context
2. **Write one feature** - Don't rewrite everything at once
3. **Add Before/After hooks** - Fresh state for each scenario
4. **Use data-testid attributes** - Stable selectors that survive refactoring
5. **Replace sleeps with waits** - Explicit conditions, not arbitrary timeouts
6. **Add screenshot on failure** - Debug CI failures faster

## The Real Value

Type safety catches errors at compile time. Readable features improve communication. Fresh state prevents flakiness. Explicit waits make tests reliable.

Together, these patterns create tests that developers trust and maintain. Tests that catch real bugs. Tests that run reliably in CI/CD.

That's what production E2E testing needs.

---

## Sources and Further Reading

### Technical Resources

- [Cucumber Documentation](https://cucumber.io/docs) - Official Cucumber docs
- [Cucumber TypeScript Examples](https://github.com/cucumber/cucumber-js/tree/main/examples) - Official TypeScript setup
- [Cucumber Anti-Patterns](https://cucumber.io/docs/guides/anti-patterns/) - What to avoid
- [Playwright Documentation](https://playwright.dev/docs/intro) - Modern browser automation
- [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) - Traditional browser automation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - TypeScript fundamentals

### Disclaimer

_This post is based on production experience building E2E testing infrastructure with TypeScript and Cucumber. The patterns shown are battle-tested in our projects. Modern Cucumber supports TypeScript natively via ts-node—we use Webpack for bundling and faster CI startup, but it's optional. Consider Playwright for new projects for better reliability and developer experience._
