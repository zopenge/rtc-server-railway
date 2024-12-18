// English translations
const enTranslations = {
    nav: {
        login: "Log in",
        register: "Sign up"
    },
    login: {
        title: "User Login",
        email: "Email",
        password: "Password",
        submit: "Log in",
        registerPrompt: "Don't have an account?",
        registerLink: "Register now"
    },
    register: {
        title: "User Registration",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        submit: "Sign up",
        loginPrompt: "Already have an account?",
        loginLink: "Login now"
    },
    validation: {
        required: "This field is required",
        emailInvalid: "Please enter a valid email address",
        passwordLength: "Password must be at least 6 characters long",
        passwordMismatch: "Passwords do not match"
    },
    errors: {
        loginFailed: "Login failed, please check your email and password",
        registerFailed: "Registration failed, please try again later",
        networkError: "Network error, please check your connection"
    },
    upload: {
        dropzone: "Drop files here or click to select",
        compressing: "Compressing files...",
        uploading: "Uploading...",
        success: "Upload successful!",
        failed: "Upload failed: {error}"
    },
    welcome: {
        title: "Welcome to Our Platform",
        subtitle: "Discover our powerful features and tools",
        features: {
            1: {
                title: "File Management",
                text: "Upload, store, and manage your files securely in one place"
            },
            2: {
                title: "Real-time Collaboration",
                text: "Work together with your team members in real-time"
            },
            3: {
                title: "Cross-platform Support",
                text: "Access your content from any device, anywhere"
            }
        }
    },
    workspace: {
        sidebar: {
            title: "Navigation",
            files: "My Files",
            shared: "Shared with me",
            recent: "Recent"
        },
        actions: {
            upload: "Upload Files",
            collaborate: "Start Collaboration"
        }
    },
    auth: {
        loginTab: "Login",
        registerTab: "Register",
        username: "Username",
        password: "Password",
        loginButton: "Sign In",
        registerButton: "Sign Up",
        confirmPassword: "Confirm Password"
    }
};

// Register English translations with i18n system
i18n.register('en', enTranslations); 