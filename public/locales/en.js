(function() {
    const gameConfig = {
        duelCards: {
            name: 'Duel of Cards',
            description: 'Strategic card battle game',
            iconId: 'game-cards'
        }
    };

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
                collaborate: "Start Collaboration",
                refresh: "Refresh",
                settings: "Settings"
            },
            nav: {
                tasks: "Tasks",
                history: "History",
                games: "Games"
            },
            tasks: {
                available: "Available Tasks",
                processing: "Processing",
                completed: "Completed",
                priority: "Priority",
                deadline: "Deadline"
            },
            games: {
                title: "Game Center"
            }
        },
        auth: {
            loginTab: "Login",
            registerTab: "Register",
            username: "Username",
            password: "Password",
            loginButton: "Sign In",
            registerButton: "Sign Up",
            confirmPassword: "Confirm Password",
            connectWithMetaMask: "Connect with MetaMask",
            metaMaskNotInstalled: "MetaMask is not installed. Please install it to continue.",
            metaMaskError: "An error occurred with MetaMask. Please try again."
        },
        resume: {
            title: "Resume Management",
            upload: "Upload Resume",
            batchProcess: "Batch Process",
            filters: {
                title: "Filters",
                skills: "Skills",
                skillsPlaceholder: "Enter skills, separated by commas",
                experience: "Experience",
                education: "Education",
                status: "Status"
            },
            years: "years",
            education: {
                bachelor: "Bachelor",
                master: "Master",
                phd: "PhD"
            },
            status: {
                pending: "Pending",
                processing: "Processing",
                completed: "Completed"
            },
            skills: "Skills",
            addSkill: "Add Skill",
            removeSkill: "Remove",
            experience: {
                junior: "Junior (1-3 years)",
                mid: "Mid-level (3-5 years)",
                senior: "Senior (5+ years)"
            },
            actions: {
                view: "View",
                edit: "Edit",
                delete: "Delete",
                process: "Process",
                download: "Download"
            },
            messages: {
                processSuccess: "Resume processed successfully",
                processFailed: "Failed to process resume",
                uploadSuccess: "Resume uploaded successfully",
                uploadFailed: "Failed to upload resume",
                deleteConfirm: "Are you sure you want to delete this resume?",
                deleteSuccess: "Resume deleted successfully",
                deleteFailed: "Failed to delete resume"
            }
        },
        common: {
            all: "All"
        }
    };

    // Register with i18n system
    i18n.register('en', enTranslations);
    i18n.registerGames(gameConfig);
})();