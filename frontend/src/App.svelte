<script>
    import { Router, Route, Link} from 'svelte-routing'
    // components
    import Card from './components/Card.svelte'
    import Header from './components/Header.svelte'
    import Footer from './components/Footer.svelte'

    // routes
    import Home from './routes/home/Home.svelte'
    import Register from './routes/card/Register.svelte'
    import Login from './routes/card/Login.svelte'

    export let url = "";

    import authApi from './services/authApi'
</script>

<div class="page">
  <Header />
  <div class="content">
    <Router {url}>
        <button on:click={authApi.testApi}>Test API</button>
      <div>
        <Route path="/" >
          <Home />
        </Route>
        
        <Route path="/"><Card /></Route>
        <Route path="/home"><Home /></Route>
        <Route path="/register"><Register /></Route>
        <Route path="/login"><Login /></Route>
      </div>
    </Router>
  </div>
  <Footer />
</div>

<style>
  .page {
    display: grid;
    grid-template-rows: auto 1fr auto; /* header | main | footer */
    height: 100%;
  }

  .content {
    display: flex;             /* or grid; your choice */
    flex-direction: column;
    justify-content: center;
    align-items:   center;
  }
</style>




