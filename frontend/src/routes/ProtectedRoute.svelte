<!-- src/routes/ProtectedRoute.svelte -->
<script>
   import { navigate } from 'svelte-routing';
   import { onMount } from 'svelte';
   import { auth, isAuthenticated } from '../stores/authStore';
   
   export let component;
   
   onMount(async () => {
     try {
       await auth.checkAuth();
       
       if (!$isAuthenticated) {
         navigate('/', { replace: true });
       }
     } catch (error) {
       console.error("Error checking auth:", error);
       navigate('/', { replace: true });
     }
   });
 </script>
 
 {#if $isAuthenticated}
   <svelte:component this={component} />
 {:else}
   <p>Loading...</p>
 {/if}