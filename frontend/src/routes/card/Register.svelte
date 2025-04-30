<script>
  import { navigate, Route, Link } from 'svelte-routing';
  import authApi from '../../services/authApi.js'

  let name = '';
  let email = '';
  let password = '';
  let errorMessage = '';

  async function register() {
    event.preventDefault();

    const credentials = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim()
    }

    try {
      const response = await authApi.register(credentials);

      if(response.success) {
        navigate('/home');
      } else {
        errorMessage = response.message;
      }

    } catch (error) {
      console.error('Register failed:', error);
      errorMessage = 'Register failed. Please check your credentials and try again.';
    }
  }
</script>

<div>

  <h2> ___ </h2>


  <form onsubmit={register}>
      <input id="name" bind:value={name} name="name" placeholder="name"  required/>
      <input id="email" bind:value={email} name="email" placeholder="email" required/>
      <input id="password" bind:value={password} name="password" type="password" placeholder="password" required/>
      
          
      {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
      {/if}

      <button onclick={register}>register</button>
  </form>

  <nav>
    <p>already have an account?</p>
    <Link to="/login">login</Link>
  </nav>

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
