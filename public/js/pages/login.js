(function() {
    // Function to update all text content
    function updateTexts() {
        document.getElementById('loginTabText').textContent = i18n.t('auth.loginTab');
        document.getElementById('registerTabText').textContent = i18n.t('auth.registerTab');
        document.getElementById('usernameLabel').textContent = i18n.t('auth.username');
        document.getElementById('passwordLabel').textContent = i18n.t('auth.password');
        document.getElementById('loginButton').textContent = i18n.t('auth.loginButton');
        
        // update register form texts
        document.querySelector('label[for="registerUsername"]').textContent = i18n.t('auth.username');
        document.querySelector('label[for="registerPassword"]').textContent = i18n.t('auth.password');
        document.querySelector('label[for="confirmPassword"]').textContent = i18n.t('auth.confirmPassword');
        document.querySelector('#registerForm button').textContent = i18n.t('auth.registerButton');
    }

    // Initialize tab functionality
    function initializeTabs() {
        const loginBtn = document.querySelector('[data-form="login"]');
        const signupBtn = document.querySelector('[data-form="register"]');

        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelector('.tab.active').classList.remove('active');
                tab.classList.add('active');

                document.querySelector('.form.active').classList.remove('active');
                document.getElementById(`${tab.dataset.form}Form`).classList.add('active');

                document.querySelectorAll('.error').forEach(error => {
                    error.style.display = 'none';
                });
            });
        });

        // Handle URL hash for correct tab
        const hash = window.location.hash;
        if (hash === '#register') {
            signupBtn.click();
        } else {
            loginBtn.click();
        }
    }

    // Handle form submissions
    function initializeFormHandlers() {
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = '/';
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                const errorDiv = document.getElementById('loginError');
                errorDiv.textContent = error.message || 'Login failed';
                errorDiv.style.display = 'block';
            }
        });

        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                const errorDiv = document.getElementById('registerError');
                errorDiv.textContent = 'Passwords do not match';
                errorDiv.style.display = 'block';
                return;
            }

            try {
                const response = await fetch('/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                if (data.success) {
                    document.querySelector('[data-form="login"]').click();
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                const errorDiv = document.getElementById('registerError');
                errorDiv.textContent = error.message || 'Registration failed';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Register page lifecycle
    PageLifecycle.register('login', {
        mount: () => {
            window.addEventListener('textsUpdated', updateTexts);
            initializeTabs();
            initializeFormHandlers();
            updateTexts();
        },
        unmount: () => {
            window.removeEventListener('textsUpdated', updateTexts);
        }
    });
})(); 