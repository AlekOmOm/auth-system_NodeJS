<!-- src/components/Dashboard.svelte -->
<script>
    import { auth } from '../stores/authStore';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let user = null;

    onMount(async () => {
        try {
            const authState = await auth.checkAuth();
            if (!authState || !authState.user) {
                navigate('/', { replace: true });
                return;
            }
            user = authState.user;
        } catch (error) {
            console.error("Error checking auth:", error);
            navigate('/', { replace: true });
        }
    });

    async function handleLogout() {
        try {
            await auth.logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }
</script>

<div class="dashboard-container">
    <div class="dashboard-content">
        <h1>Welcome to Your Dashboard</h1>
        
        {#if user}
            <div class="user-info">
                <h2>Hello, {user.name}!</h2>
                <p>Email: {user.email}</p>
            </div>
        {/if}

        <button class="logout-button" on:click={handleLogout}>
            Logout
        </button>
    </div>
</div>

<style>
    .dashboard-container {
        min-height: 100vh;
        padding: 2rem;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .dashboard-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
        color: #2d3748;
        margin-bottom: 2rem;
        text-align: center;
    }

    .user-info {
        background: #f7fafc;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
    }

    h2 {
        color: #4a5568;
        margin-bottom: 1rem;
    }

    p {
        color: #718096;
    }

    .logout-button {
        background: #e53e3e;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s;
    }

    .logout-button:hover {
        background: #c53030;
    }
</style>
