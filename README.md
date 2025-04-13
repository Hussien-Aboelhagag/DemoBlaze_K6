# DemoBlaze Performance Testing with k6

This project contains performance tests for the **DemoBlaze** website (`https://www.demoblaze.com/`) using **k6**, a modern load-testing tool. The tests are designed to evaluate the website's performance under various scenarios, ensuring it can handle user traffic effectively in an Agile environment.

## Project Structure
- **Purpose**: Test the performance of DemoBlaze's signup, login, and cart functionalities.
- **Scenarios**:
  1. **E2E Test**: Simulates an end-to-end user journey (signup → login → add to cart → navigate to cart) with a single user to validate functionality.
  2. **Spike Test**: Simulates sudden spikes in traffic (up to 50 virtual users) with periods of lower traffic, following a predefined pattern (two spikes over ~2 minutes).
- **Location**: `H:/Automation Testing/Performance/K6/DemoBlaze/`

## Scenarios Overview

### 1. E2E Test
- **File**: `e2e_test.js`
- **Purpose**: Validates the core user journey in DemoBlaze:
  - Signup with a unique username.
  - Log in with the created credentials.
  - Add a product to the cart.
  - Navigate to the cart page.
- **Execution**: Runs with 1 virtual user (VU), 1 iteration.
- **Goal**: Ensure the system works as expected for a single user before scaling.

### 2. Spike Test
- **File**: `spike_test.js`
- **Purpose**: Simulates sudden traffic spikes to stress the system:
  - Signup and login run once (1 VU, 1 iteration).
  - Cart actions (add to cart, navigate to cart) follow a spike pattern:
    - Ramp-up to 10 VUs (0:00-0:11).
    - Spike to 50 VUs (0:11-0:23), hold (0:23-0:34).
    - Drop to 15 VUs (0:34-0:46), hold (0:46-0:58).
    - Spike to 50 VUs (0:58-1:09), hold (1:09-1:21).
    - Drop to 10 VUs (1:21-1:32), hold (1:32-1:44).
    - Drop to 0 VUs (1:44-1:56).
- **Execution**: Total duration ~2 minutes, with spikes up to 50 VUs.
- **Goal**: Test system stability under sudden traffic surges.
