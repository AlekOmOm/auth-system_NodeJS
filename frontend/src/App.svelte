<script>
    // Import components
    import Header from './components/Header.svelte';
    import Footer from './components/Footer.svelte';
    import Body from './components/Body.svelte';

    // Import global styles
    import './styles/app.css';
    import './styles/shared.css';

    import { onMount } from 'svelte';
    import { auth } from './stores/authStore';
  
    export let url = "";

    onMount(async () => {
        try {
            await auth.checkAuth();
        } catch (error) {
            console.error("Error checking auth:", error);
        }
    });
</script>

<Header />
<Body />
<Footer />

<style>
    @import "./styles/app.css";
    @import "./styles/shared.css";

    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .app-container {
        padding-top: 10vh;
        min-height: 80vh;
    }
</style>
