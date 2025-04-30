<script>
   // Import components
   import Login from './Login.svelte';
   import Register from './Register.svelte';
   import { useLocation } from 'svelte-routing';
 
   const location = useLocation();
   // State to track which side of the card to show
   let isFlipped = false;
   
   $: isFlipped = $location?.pathname === '/register';
   
   // Function to flip the card
   function flipCard() {
       isFlipped = !isFlipped;
   }
</script>

   <div class="card-container">
      <div class="flip-card {isFlipped ? 'flipped' : ''}">

         <!-- Front side (Login) -->
         <div class="flip-card-front">
            <div class="card-header">
                  <h2>Login</h2>
                  <p>Access your account</p>
            </div>
            <Login />
            <div class="card-footer">
                  <p>Don't have an account?</p>
                  <button class="flip-button" on:click={flipCard}>
                     Create Account
                     <span class="arrow">→</span>
                  </button>
            </div>
         </div>
         
         <!-- Back side (Register) -->
         <div class="flip-card-back">
            <div class="card-header">
                  <h2>Register</h2>
                  <p>Create a new account</p>
            </div>
            <Register />
            <div class="card-footer">
                  <p>Already have an account?</p>
                  <button class="flip-button" on:click={flipCard}>
                     Login
                     <span class="arrow">←</span>
                  </button>
            </div>
         </div>
      </div>
   </div>

<style>
   @import "../styles/forms.css";
   @import "../styles/card.css";
</style>

