# Integration Testing with Real Database

This project now supports integration tests that run against a real SQLite database, but using separate test tables to keep the main database clean.

## Setup

The integration test setup does the following:

1. Creates test tables in the SQLite database
2. Configures the test environment to use these test tables
3. Runs tests against the real database implementation
4. Cleans up test data after tests complete

## Running Integration Tests

To run the integration tests:

```bash
node runIntegrationTests.js
```

This script will:
1. Set up the test tables
2. Run all tests in the `_tests_` directory
3. Report results

## How It Works

The integration test setup works by:

1. Creating separate test tables (`test_users`, `test_sessions`) in the same database
2. Overriding repository methods to use these test tables during tests
3. Running tests against the real database implementation

This approach has several advantages:
- Tests run against the real database code, not mocks
- Main database tables remain untouched
- Tests can be run without affecting production data

## Modified Files

The following files were modified or created to support integration tests:

- `src/db/queries.js` - Added test table definitions and queries
- `src/db/repository.js` - Combined repository with test methods
- `src/db/setupTestDB.js` - Script to set up test tables
- `_tests_/testConfig.js` - Configuration to use test tables in tests
- `runIntegrationTests.js` - Script to run the integration tests

## Code Fixes

The integration test setup also fixed several issues in the codebase:

1. Created a consistent error handling system with standardized responses
2. Fixed the authentication middleware to properly return on auth failures
3. Standardized response formats across all endpoints
4. Ensured sensitive data like passwords is properly filtered from responses 