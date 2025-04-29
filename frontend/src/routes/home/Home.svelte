<script>
  import { onMount } from "svelte";
  import { Router, Link } from "svelte-routing";
  import authApi from "../../services/authApi";

  import osho from "../../assets/osho-4o.png";

  let users = $state([]);

  async function populate() {
    users = (await authApi.testApi()).users;
  }

</script>

<h1>Home</h1>

<div class="osho-pic">
  <img src={osho} alt="osho" style="width: 15vh; height: 15vh;"/>
</div>

<div class="users-container">
   <div class="users-header">
      <h3>Users:</h3>
      <button onclick={populate}>populate</button>
   </div>
   

   <div class="users-list">
      
      {#each users as user}
         <li>{user.name}</li>
      {/each}
   </div>
</div>

<style>
  button {
   font-size: 0.5rem;
   padding: 0.5rem;
   border-radius: 1rem;
   border: 1px solid #ccc;
   background-color: #ccc;
   color: #000;
  }

  .osho-pic {
      padding: 2rem;
  }

  .users-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .users-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
</style>
