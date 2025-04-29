import fetch from "node-fetch";
import assert from "assert";

const API_URL = "http://localhost:3001/api";

async function testLogin() {
  console.log("Testing login endpoint...");

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "admin",
        email: "admin@admin.com",
        password: "GoodPassword!123",
      }),
    });

    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    // Assert response status is 200
    assert.strictEqual(response.status, 200, "Expected status code 200");

    // Assert response contains expected fields
    assert.ok(data.message, "Response should contain a message");
    assert.ok(data.user, "Response should contain a user object");
    assert.ok(data.user.id, "User should have an id");
    assert.ok(data.user.name, "User should have a name");
    assert.ok(data.user.email, "User should have an email");
    assert.ok(data.user.role, "User should have a role");

    // Assert password is not included in response
    assert.strictEqual(
      data.user.password,
      undefined,
      "Password should not be included in response"
    );

    console.log("Login test passed! ✅");
    return true;
  } catch (error) {
    console.error("Login test failed:", error);
    return false;
  }
}

// Run the test
testLogin();
