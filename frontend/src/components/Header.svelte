<script>
    export let title = "Welcome";
    export let subtitle = "Login or sign up to continue";
</script>

<header>
    <div class="header-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
    </div>
</header>

<style>
    header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 5vh;
        padding: 0.5vh 1vh;
        text-align: center;
        background: linear-gradient(135deg, #6e8efb, #a777e3);
        color: white;
        box-shadow: 0 0.4vh 0.6vh rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header-content {
        max-width: 80vh;
        margin: 0 auto;
    }

    h1 {
        margin: 0;
        font-size: 2vh;
        font-weight: 700;
        letter-spacing: 0.1vh;
    }

    p {
        margin: 0;
        font-size: 1vh;
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 1.8vh;
        }
        
        p {
            font-size: 0.9vh;
        }
    }
</style>