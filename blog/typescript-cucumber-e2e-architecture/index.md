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
    We built a production-grade Cucumber E2E testing infrastructure for TypeScript and discovered patterns that actually work. 
    Most tutorials stop at basic examples, but production needs type safety, maintainable tests, and reliable execution. 
    Here's what we learned.
  </p>
</div>

## The Problem with E2E Testing

When we started building end-to-end tests, we hit the same problems everyone hits.

### Tests Break Constantly

You write a test. It works. You change the UI slightly. The test breaks. You spend more time fixing tests than writing features.

### No Type Safety

Your application is TypeScript. Your tests are JavaScript. Every refactoring breaks tests because there's no type checking. You find out at runtime.

### Stakeholders Can't Read Tests

Product managers want to understand what's being tested. But tests are full of code. They can't tell if tests match requirements.

### Flaky in CI/CD

Tests pass locally. They fail in CI/CD. You add sleep statements. Tests get slower. They still fail randomly.

## The Solution: A Better Architecture

We needed an architecture that solves these problems. Here's what we built.

### The Core Idea

The key is separating what you're testing from how you're testing it. Cucumber helps with this through Gherkin syntax.

Instead of this:

```javascript
test("should show error for weak password", () => {
  visit("/register");
  type("password", "12345");
  click("submit");
  expect(error).toContain("weak password");
});
```

You write this:

```gherkin
Scenario: User enters weak password
  Given I am on the registration page
  When I enter "12345" as the password
  Then I should see an error "Password too weak"
```

The first version is code. The second version is readable by anyone.

### Adding TypeScript

But Gherkin alone isn't enough. You need the implementation behind it to be type-safe. That's where TypeScript comes in.

The pattern is:

1. Write features in Gherkin (readable by everyone)
2. Implement steps in TypeScript (type-safe for developers)
3. Compile everything before running tests
4. Execute in CI/CD with confidence

## The Custom World Pattern

Here's where most tutorials stop. They show basic examples but don't show how to build a real system.

### What is the World?

In Cucumber, the "World" is your test context. It's what's available to all your test steps.

Think of it like this: every test needs access to certain things. A browser to interact with. A database to verify data. Configuration for URLs and settings.

Without types, you're guessing what's available. With TypeScript, you know exactly what you can use.

### A Simple Example

```typescript
export interface TestWorld {
  browser: WebDriver;
  database: DatabaseConnection;
  config: {
    appUrl: string;
    apiUrl: string;
  };
}
```

Now in your steps, you have type-safe access:

```typescript
Given("I am on the home page", async function () {
  // TypeScript knows 'this.browser' exists
  await this.browser.get(this.config.appUrl);
});
```

### Why This Matters

When you refactor, TypeScript catches errors. When you add new features, autocomplete works. When new developers join, they see what's available.

## The Setup Pattern

Every test needs a clean environment. Here's how we handle it.

### Before Each Test

Before each test scenario runs, we:

1. Set up the database with fresh test data
2. Create a new browser instance
3. Load configuration

### After Each Test

After each test scenario, we:

1. Close the browser
2. Clean up the database
3. Save screenshots if tests failed

This ensures tests don't interfere with each other. No flaky tests from leftover state.

### The Code Pattern

```typescript
Before(async function () {
  // Set up fresh environment
  this.database = await connectToDatabase();
  await seedTestData(this.database);
  this.browser = await createBrowser();
});

After(async function () {
  // Clean up
  if (this.browser) {
    await this.browser.quit();
  }
});
```

## Writing Maintainable Steps

The key to maintainable tests is writing good step definitions.

### Bad Pattern: Too Specific

```typescript
When(
  "user clicks button with id submit-form-button-primary",
  async function () {
    await this.browser.findElement(By.id("submit-form-button-primary")).click();
  },
);
```

This breaks when IDs change.

### Good Pattern: Meaningful

```typescript
When("the user submits the form", async function () {
  const submitButton = await this.browser.findElement(
    By.css("[type='submit']"),
  );
  await submitButton.click();
});
```

This describes what the user does, not how it's implemented.

### Even Better: Reusable

```typescript
When("the user clicks {string}", async function (buttonText: string) {
  // Use stable selectors like data-testid instead of text
  const button = await this.browser.findElement(
    By.css(`[data-testid="${buttonText}"]`),
  );
  await button.click();
});
```

Use stable selectors like `data-testid` attributes. Text-based selectors break when copy changes or with internationalization.

## Running TypeScript with Cucumber

Modern Cucumber can run TypeScript directly without a build step.

### Using ts-node

Cucumber loads TypeScript via `ts-node` or ESM loaders:

```json
{
  "scripts": {
    "test": "cucumber-js --import ts-node/register"
  }
}
```

### Configuration

```javascript
// cucumber.config.js
export default {
  import: ["ts-node/register"],
  require: ["tests/support/**/*.ts", "tests/steps/**/*.ts"],
  format: ["progress", "html:reports/cucumber.html"],
};
```

### Why This Works

Cucumber loads TypeScript on the fly. No build step needed. Full type safety during development. Source maps work correctly.

If you need more control over compilation, you can still use a build step, but it's not required for most projects.

## Handling Browser Automation

Browser automation is where tests become flaky. Here's how to make them reliable.

### Choosing a Browser Automation Tool

While this post uses Selenium WebDriver, modern projects often prefer **Playwright** for better reliability and auto-waiting. Playwright integrates well with Cucumber:

```typescript
// With Playwright
import { chromium } from "@playwright/test";

Before(async function () {
  this.browser = await chromium.launch({ headless: true });
  this.page = await this.browser.newPage();
});

When("the user clicks {string}", async function (buttonText: string) {
  await this.page.getByRole("button", { name: buttonText }).click();
});
```

Playwright provides better selectors, automatic waiting, and more reliable tests. Consider it for new projects.

### The Wait Pattern

Never use sleep. Always wait for specific conditions.

```typescript
// Bad: arbitrary wait
await sleep(2000);

// Good: wait for specific element
await this.browser.wait(until.elementLocated(By.css(".dashboard")), 5000);
```

### Why This Works

Sleep waits the full time even if the page loads faster. Wait stops as soon as the condition is met. Tests are faster and more reliable.

### Headless Mode

In CI/CD, you don't have a display. Use headless mode:

```typescript
const options = new chrome.Options();
options.addArguments("--headless=new");
options.addArguments("--window-size=1920,1080");
options.addArguments("--disable-gpu");
// Only add --no-sandbox if your CI environment requires it
// It's a security risk and should be avoided when possible

const browser = await new Builder()
  .forBrowser(Browser.CHROME)
  .setChromeOptions(options)
  .build();
```

Use `--headless=new` for better compatibility with modern Chrome. Avoid `--no-sandbox` unless your containerized CI specifically requires it.

## Database Integration

Tests need to verify data. Here's how to do it right.

### Separate Test Database

Never use your development database for tests. Always use a separate test database.

```typescript
const config = {
  development: "app-dev-db",
  test: "app-test-db",
  production: "app-prod-db",
};

const dbName = config[environment];
```

### Seed Test Data

Before each test, populate the database with known data.

```typescript
async function seedTestData(db) {
  await db.collection("users").insertOne({
    email: "test@example.com",
    name: "Test User",
  });

  await db.collection("products").insertMany([
    { name: "Product A", price: 100 },
    { name: "Product B", price: 200 },
  ]);
}
```

Now tests have predictable data to work with.

### Keep UI Tests Black-Box

For end-to-end UI tests, verify through the UI, not the database. Database checks couple your tests to implementation details.

```typescript
// Good: verify through UI
Then("I should see my account", async function () {
  const accountName = await this.browser.findElement(
    By.css("[data-testid='account-name']"),
  );
  const text = await accountName.getText();
  expect(text).toBe("Test User");
});
```

Save database assertions for integration tests or API tests, not UI scenarios.

## Writing Good Feature Files

Feature files are where stakeholders and developers meet. Make them readable.

### Good Structure

```gherkin
Feature: User Registration

  Scenario: Successful registration
    Given I am on the registration page
    When I enter valid details
    And I submit the form
    Then I should see a success message
    And my account should be created
```

This reads like a requirement. Anyone can understand it.

### Bad Structure

```gherkin
Feature: User Registration

  Scenario: Test case 1
    Given database table users is empty
    When POST /api/register with email and password
    Then status code is 201
    And database has 1 record in users table
```

This is too technical. It tests implementation, not user behavior.

### Parameterized Steps

Use parameters to make steps reusable:

```gherkin
Scenario: Invalid email format
  Given I am on the registration page
  When I enter "invalid-email" as the email
  Then I should see an error "Invalid email format"

Scenario: Weak password
  Given I am on the registration page
  When I enter "123" as the password
  Then I should see an error "Password too weak"
```

Same steps, different data.

## CI/CD Integration

Tests need to run in your pipeline. Here's how to make that reliable.

### Start the Application

Before running tests, start your application:

```javascript
// Start server in background
const server = exec("node server.js");

// Wait for it to be ready
await waitForServer("http://localhost:8080/health");

// Run tests
await runTests();

// Stop server
server.kill();
```

### Generate Reports

Cucumber provides built-in formatters for different needs:

```javascript
// cucumber.config.js
export default {
  format: [
    "progress", // Console output
    "json:reports/cucumber.json", // For dashboards/tools
    "html:reports/cucumber.html", // Human-readable
    "junit:reports/cucumber.xml", // CI systems (Jenkins, GitLab)
  ],
};
```

Use `progress` or `pretty` for development. Use `json` for CI pipelines. Use `junit` for test result integration.

### Handle Failures

When tests fail, save evidence:

```typescript
After(async function ({ pickle, result }) {
  if (result?.status === "FAILED") {
    const screenshot = await this.browser.takeScreenshot();
    await this.attach(screenshot, "image/png");
  }
});
```

Modern Cucumber uses `pickle` and `result` parameters. Screenshots help debug CI failures.

## Common Mistakes

Here are the mistakes we made so you don't have to.

### Mistake 1: Too Much Detail in Features

```gherkin
# Bad
When I click the button with CSS selector ".submit-btn"
And I wait 2 seconds
Then the div with class "success" should contain text "Done"

# Good
When I submit the form
Then I should see a success message
```

Features should describe user behavior, not implementation.

### Mistake 2: Sharing State Between Tests

```typescript
// Bad: global variable
let testUser;

Before(async function () {
  testUser = await createUser();
});
```

This causes flaky tests. Use the World instead:

```typescript
Before(async function () {
  this.testUser = await createUser();
});
```

### Mistake 3: No Type Safety

```javascript
// Bad: plain JavaScript
Given("user exists", async function () {
  this.user = await findUser(); // What properties does this.user have?
});
```

Use TypeScript:

```typescript
// Good: typed
Given("user exists", async function () {
  this.user = await findUser(); // TypeScript knows the user type
});
```

## What Actually Works

After using this in production, here's what matters.

### Type Safety is Worth It

The upfront work of setting up TypeScript pays off. Refactoring becomes safe. New developers understand the code faster.

### Fresh State Prevents Flakiness

Resetting the database before each test eliminates 90% of flaky tests. Tests are independent and reliable.

### Readable Features Improve Communication

When product managers can read tests, they catch requirement mismatches early. When developers write readable features, tests become documentation.

### Wait, Don't Sleep

Explicit waits make tests faster and more reliable. They wait only as long as needed and fail with clear errors.

## Where to Start

If you're adding this to your project:

1. **Start with one feature** - Don't rewrite all tests at once
2. **Set up TypeScript compilation** - Get the build pipeline working
3. **Create a simple World interface** - Add types to your test context
4. **Write readable features** - Focus on user behavior, not implementation
5. **Add database seeding** - Give tests predictable state
6. **Use explicit waits** - Replace all sleep statements

## The Real Value

The real value isn't in any single pattern. It's in the combination.

Type safety catches errors at compile time. Readable features improve communication. Fresh database state prevents flakiness. Explicit waits make tests reliable.

Together, these patterns create tests that developers trust and maintain. Tests that catch real bugs. Tests that run reliably in CI/CD.

That's what production E2E testing needs.

---

## Sources and Further Reading

### Technical Resources

- [Cucumber Documentation](https://cucumber.io/docs) - Official Cucumber docs
- [Cucumber TypeScript Examples](https://github.com/cucumber/cucumber-js/tree/main/examples) - Official TypeScript setup examples
- [Cucumber Anti-Patterns](https://cucumber.io/docs/guides/anti-patterns/) - What to avoid
- [Playwright Documentation](https://playwright.dev/docs/intro) - Modern browser automation
- [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) - Traditional browser automation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - TypeScript fundamentals

### Disclaimer

_This post is based on production experience building E2E testing infrastructure with TypeScript and Cucumber. The patterns shown are battle-tested but your requirements may differ. Modern Cucumber supports TypeScript natively via ts-node - no build step required. Consider Playwright for new projects for better reliability and developer experience._
