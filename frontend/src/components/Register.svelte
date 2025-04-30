<!-- src/components/Register.svelte -->
<script>
    import { auth } from '../stores/authStore';
    import { navigate } from 'svelte-routing';
    import FormInput from './FormInput.svelte';
    import UserIcon from '../assets/icons/UserIcon.svelte';
    import EmailIcon from '../assets/icons/EmailIcon.svelte';
    import LockIcon from '../assets/icons/LockIcon.svelte';
    
    let name = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let error = '';
    let loading = false;
    
    async function handleRegister() {
      error = '';
      loading = true;
      
      // Basic validation
      if (!name || !email || !password || !confirmPassword) {
        error = 'All fields are required';
        loading = false;
        return;
      }
      
      if (password !== confirmPassword) {
        error = 'Passwords do not match';
        loading = false;
        return;
      }
      
      try {
        await auth.register({ name, email, password });
        navigate('/');
      } catch (err) {
        error = err.message || 'Registration failed';
      } finally {
        loading = false;
      }
    }
</script>

<div class="register-container">
  <h2>Create Account</h2>
  
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}
  
  <form class="signup-form" on:submit|preventDefault={handleRegister}>
    <FormInput
      type="text"
      id="register-name"
      bind:value={name}
      placeholder="Full Name"
      required
      icon={UserIcon}
      autocomplete="name"
    />
    
    <FormInput
      type="email"
      id="register-email"
      bind:value={email}
      placeholder="Email Address"
      required
      icon={EmailIcon}
      autocomplete="email"
    />
    
    <FormInput
      type="password"
      id="register-password"
      bind:value={password}
      placeholder="Password"
      required
      icon={LockIcon}
      autocomplete="new-password"
    />
    
    <FormInput
      type="password"
      id="register-confirm-password"
      bind:value={confirmPassword}
      placeholder="Confirm Password"
      required
      icon={LockIcon}
      autocomplete="new-password"
    />
    
    <button type="submit" class="signup-button" disabled={loading}>
      {#if loading}
        <div class="spinner"></div>
      {/if}
      {loading ? 'Creating Account...' : 'Register'}
    </button>
  </form>
  
  <p class="login-link">
    Already have an account? <a href="/login">Login here</a>
  </p>
</div>

<style>
  @import "../styles/forms.css";
  @import "../styles/signup.css";
  
  .register-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
  }
  
  .login-link {
    text-align: center;
    margin-top: 1rem;
    color: #666;
  }
</style>