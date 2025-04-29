// src/main.js
import "./app.css"; // Optional: Import global styles
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
