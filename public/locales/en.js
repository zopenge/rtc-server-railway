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
    }
};

// Register English translations with i18n system
i18n.register('en', enTranslations); 