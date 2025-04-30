<script>
  import { login } from '../api/auth';
  
  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  let success = false;
  
  async function handleSubmit() {
    loading = true;
    error = '';
    success = false;
    
    try {
      const result = await login({ email, password });
      success = true;
      console.log('Login successful:', result);
      // You can redirect or update UI here
    } catch (err) {
      error = err.message || 'Login failed';
      console.error('Login error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="login-form">
  <h2>Login</h2>
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  {#if success}
    <div class="success">Login successful!</div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email" 
        bind:value={email} 
        required 
        placeholder="Enter your email"
      />
    </div>
    
    <div class="form-group">
      <label for="password">Password</label>
      <input 
        type="password" 
        id="password" 
        bind:value={password} 
        required 
        placeholder="Enter your password"
      />
    </div>
    
    <button type="submit" disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </form>
</div>

<style>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  button {
    width: 100%;
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error {
    color: #d32f2f;
    background-color: #ffebee;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
  }
  
  .success {
    color: #388e3c;
    background-color: #e8f5e9;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
  }
</style> 