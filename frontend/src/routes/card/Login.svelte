<script>
  import { Router, Route, navigate, Link } from 'svelte-routing';
  import authApi from '../../services/authApi.js'

  let name = '';
  let email = '';
  let password = '';
  let errorMessage = '';

  async function handleLogin(event) {
    event.preventDefault();

    const credentials = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim()
    }

    try {
      const response = await authApi.login(credentials);
      console.log(response);
      if (response.success) {
        navigate('/home');
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      errorMessage = 'Login failed. Please check your credentials and try again.';
    }
  }
</script>

<div>

  <h2> ___ </h2>

  <form onsubmit={handleLogin}>
    <input id="name" bind:value={name} name="name" placeholder="name" required/>
    <input id="email" bind:value={email} name="email" placeholder="email" required/>
    <input id="password" bind:value={password} name="password" type="password" placeholder="password" required/>
    
    {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
    {/if}

    <button type="submit">login</button>
  </form>

  <Router>
    <nav>
      <p>don't have an account?</p>
      <Link to="/register">register</Link>
    </nav>
  </Router>

</div>

<style>
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
    
    input {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
    
    button {
        margin-top: 1rem;
    }
</style>
