<script>

    import { Router, Route, Link, useLocation } from 'svelte-routing'
    import Login from '../routes/card/Login.svelte'
    import Register from '../routes/card/Register.svelte'

    const loc = useLocation(); 
   // @ts-ignore
     $: flipped = loc.pathname === '/register';

</script>

<Router>
    <nav>
        <Link to="/">login</Link>
        <Link to="/register">register</Link>
    </nav>

    <div class="scene">
        <div class="card {flipped ? 'is-flipped' : ''}">
            <div class="face front">
                <Login />
                <Route path="/register">
                    <button>register here</button>
                </Route>
                
            </div>

            <div class="face back">
                <Register />

            </div>
            <p>flipped: {flipped}</p>
        </div>
    </div>
</Router>
        
<style>
  .scene { perspective: 1000px; }
  .card  { transition: transform .6s; transform-style: preserve-3d; position: relative; }
  .card.is-flipped { transform: rotateY(180deg); }
  .face  { position: absolute; width: 100%; backface-visibility: hidden; }
  .back  { transform: rotateY(180deg); }
</style>
