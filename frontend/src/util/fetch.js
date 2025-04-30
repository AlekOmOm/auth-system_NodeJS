export async function fetchGet(url) {
  try {
    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        `API returned non-JSON response: ${text.substring(0, 50)}...`
      );
    }
  } catch (error) {
    console.error("fetchGet error:", error);
    throw error; // Re-throw so it can be handled by the caller
  }
}

export async function fetchPost(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      throw new Error(
        `API returned non-JSON response: ${text.substring(0, 50)}...`
      );
    }
  } catch (error) {
    console.error("fetchPost error:", error);
    throw error; // Re-throw so it can be handled by the caller
  }
}
