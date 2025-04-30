<script lang="ts">
    // Props for the component
    export let type = "text";
    export let id = "";
    export let value = "";
    export let placeholder = "";
    export let required = false;
    export let icon = null;
    export let iconColor = "#6b7280";
    export let autocomplete: "on" | "off" | "name" | "email" | "username" | "current-password" | "new-password" | "one-time-code" | "organization-title" | "organization" | "street-address" | "postal-code" | "country-name" | "country" | "language" | "bday" | "sex" | "tel" | "url" = "off";
</script>

<div class="form-group">
    <div class="input-icon">
        <svelte:component this={icon} color={iconColor} />
        <input 
            {type}
            {id}
            bind:value
            {placeholder}
            {required}
            {autocomplete}
        />
    </div>
</div>

<style>
    /* Import shared styles */
    @import "../styles/shared.css";
    @import "../styles/form-input.css";
    
    /* Component-specific styles can be added here if needed */
    .form-group {
        margin-bottom: 16px;
        width: 80%;
        align-items: center;
    }
    
    .input-icon {
        position: relative;
    }
    
    .input-icon :global(svg) {
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translateY(-50%);
    }
    
    input {
        width: 100%;
        padding: 12px 12px 12px 40px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background-color: #f9fafb;
        font-size: 16px;
        color: #1f2937;
        transition: all 0.2s;
    }
    
    input:focus {
        border-color: #a777e3;
        box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.2);
        outline: none;
        background-color: #fff;
    }
    
    input::placeholder {
        color: #9ca3af;
    }
</style>