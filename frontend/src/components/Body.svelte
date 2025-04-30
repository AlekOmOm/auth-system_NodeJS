<!-- src/components/Body.svelte -->
<script>
    import { Route } from 'svelte-routing';
    import Home from './Home.svelte';
    import Card from './Card.svelte';
    import Dashboard from './Dashboard.svelte';
    import ProtectedRoute from '../routes/ProtectedRoute.svelte';
</script>

<main>
    <Route path="/" component={Home} />
    <Route path="/login" component={Card} />
    <Route path="/register" component={Card} />
    <Route path="/dashboard" component={ProtectedRoute}>
        <Dashboard />
    </Route>
</main>

<style>
    main {
        flex: 1;
        padding: 2rem;
    }
</style> 