<!-- src/components/Login.svelte -->
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
    let loading = false;
    let error = '';
    let rememberMe = false;
    
    async function handleLogin() {
      error = '';
      loading = true;
      
      // Basic validation
      if (!name || !email || !password) {
        error = 'All fields are required';
        loading = false;
        return;
      }
      
      try {
        await auth.login({ name, email, password });
        navigate('/');
      } catch (err) {
        error = err.message || 'Login failed';
      } finally {
        loading = false;
      }
    }
</script>

<div class="login-container">
  <h2>Welcome Back</h2>
  
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}
  
  <form class="login-form" on:submit|preventDefault={handleLogin}>
    <FormInput
      type="text"
      id="login-name"
      bind:value={name}
      placeholder="Full Name"
      required
      icon={UserIcon}
      autocomplete="name"
    />
    
    <FormInput
      type="email"
      id="login-email"
      bind:value={email}
      placeholder="Email Address"
      required
      icon={EmailIcon}
      autocomplete="email"
    />
    
    <FormInput
      type="password"
      id="login-password"
      bind:value={password}
      placeholder="Password"
      required
      icon={LockIcon}
      autocomplete="current-password"
    />
    
    <button type="submit" class="login-button" disabled={loading}>
      {#if loading}
        <div class="spinner"></div>
      {/if}
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </form>
</div>

<style>
  @import "../styles/forms.css";
  @import "../styles/login.css";
</style>
