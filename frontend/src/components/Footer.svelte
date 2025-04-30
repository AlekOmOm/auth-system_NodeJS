<script>
    // Footer component
    const currentYear = new Date().getFullYear();
</script>

<footer>
    <div class="footer-content">
        <div class="footer-section">
            <h3>About Us</h3>
            <p>A simple login and signup application built with Svelte.</p>
        </div>
        
        <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
        
        <div class="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@example.com</p>
            <p>Phone: +1 (123) 456-7890</p>
        </div>
    </div>
    
    <div class="footer-bottom">
        <p>&copy; {currentYear} Svelte Login App. All rights reserved.</p>
    </div>
</footer>

<style>
    footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 15vh; /* Increased height to accommodate all content */
        background-color: #333;
        color: #fff;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1vh 2vh;
    }
    
    .footer-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 100%;
        margin-bottom: 1vh;
    }
    
    .footer-section {
        flex: 1;
        min-width: 25vh;
        margin: 0.5vh;
    }
    
    h3 {
        color: #f8f9fa;
        margin-bottom: 0.5vh;
        font-size: 1.2vh;
    }
    
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    
    li {
        margin-bottom: 0.3vh;
    }
    
    a {
        color: #ddd;
        text-decoration: none;
        font-size: 0.9vh;
    }
    
    a:hover {
        color: #fff;
        text-decoration: underline;
    }
    
    .footer-bottom {
        text-align: center;
        padding-top: 0.5vh;
        border-top: 0.1vh solid #444;
    }
    
    p {
        margin: 0;
        font-size: 0.9vh;
    }
</style>