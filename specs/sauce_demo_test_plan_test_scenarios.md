# SauceDemo Test Plan & Test Scenarios (SDET Level)

## 1. Introduction
This document defines the test strategy, scope, and detailed test scenarios for automating and validating the SauceDemo web application using Playwright.

The goal is to ensure functional correctness, UI stability, and end-to-end user flow reliability.

---

## 2. Application Under Test (AUT)
**Name:** SauceDemo

**Core Modules:**
- Login
- Product Inventory
- Cart
- Checkout
- Order Confirmation
- Logout

---

## 3. Test Objectives
- Validate user authentication flows
- Ensure product listing and cart functionality works correctly
- Validate checkout workflow end-to-end
- Verify error handling and negative scenarios
- Ensure UI elements behave consistently
- Support regression automation using Playwright

---

## 4. Scope

### In Scope
- Functional testing
- UI validation
- End-to-end workflows
- Negative test cases
- Basic performance checks (load validation of pages)

### Out of Scope
- Backend API testing (unless explicitly integrated)
- Security penetration testing
- Cross-browser deep compatibility matrix (initial phase only Chrome focus)

---

## 5. Test Strategy

### Automation Tooling
- Playwright (JavaScript/TypeScript)
- Page Object Model (POM)
- GitHub for version control
- GitHub Actions for CI (future enhancement)

### Test Levels
- Smoke Tests
- Functional Tests
- Regression Tests

---

## 6. Test Environment
- Browser: Chromium (primary)
- OS: macOS / Windows / Linux
- Base URL: https://www.saucedemo.com/

---

## 7. Entry Criteria
- Application is accessible
- Test environment is stable
- Test data available (standard users)

---

## 8. Exit Criteria
- All critical test cases passed
- No open critical defects
- Regression suite executed successfully

---

## 9. Test Scenarios

# 9.1 Login Functionality

### Positive Scenarios
- TC01: Verify user can login with valid standard user credentials
- TC02: Verify user can login with performance_glitch_user
- TC03: Verify user can login with problem_user

### Negative Scenarios
- TC04: Verify login fails with invalid username
- TC05: Verify login fails with invalid password
- TC06: Verify login fails with empty username and password
- TC07: Verify locked_out_user cannot login

---

# 9.2 Product Inventory Page

### Positive Scenarios
- TC08: Verify products are displayed after login
- TC09: Verify product names, prices, and images are visible
- TC10: Verify sorting by price (low to high)
- TC11: Verify sorting by price (high to low)
- TC12: Verify sorting by name (A-Z)

---

# 9.3 Cart Functionality

### Positive Scenarios
- TC13: Verify user can add single product to cart
- TC14: Verify user can add multiple products
- TC15: Verify cart badge updates correctly
- TC16: Verify cart page displays correct products

### Negative Scenarios
- TC17: Verify removing product updates cart correctly
- TC18: Verify cart persists after navigation

---

# 9.4 Checkout Flow

### Positive Scenarios
- TC19: Verify user can proceed to checkout
- TC20: Verify user can enter valid checkout details
- TC21: Verify order summary is correct
- TC22: Verify user can complete checkout successfully
- TC23: Verify order confirmation page is displayed

### Negative Scenarios
- TC24: Verify checkout fails with empty first name
- TC25: Verify checkout fails with empty last name
- TC26: Verify checkout fails with empty postal code

---

# 9.5 Order Completion

- TC27: Verify order success message is displayed
- TC28: Verify "Back Home" button redirects to inventory page

---

# 9.6 Logout Functionality

- TC29: Verify user can logout successfully
- TC30: Verify user is redirected to login page after logout

---

# 9.7 UI & Usability Checks

- TC31: Verify page loads without UI distortion
- TC32: Verify buttons are clickable and responsive
- TC33: Verify error messages are visible and clear
- TC34: Verify form validation messages display correctly

---

# 9.8 Security / Session Handling

- TC35: Verify unauthorized access redirects to login page
- TC36: Verify session expires after logout

---

# 10. Risks
- UI changes may break selectors
- Test flakiness due to async loading
- Environment instability

---

# 11. Assumptions
- Standard SauceDemo users are available
- No backend outages

---

# 12. Future Enhancements
- API testing integration
- Cross-browser expansion (Firefox, WebKit)
- Parallel execution in CI/CD
- Visual regression testing

---

# End of Document

