(function () {
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

        // Update MetaMask button text
        const metamaskButtonText = document.getElementById('metamaskButtonText');
        if (metamaskButtonText) {
            metamaskButtonText.textContent = i18n.t('auth.connectWithMetaMask');
        }
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

    async function createLoginHash(password, timestamp, nonce) {
        const encoder = new TextEncoder();
        const combined = encoder.encode(`${password}${timestamp}${nonce}`);
        const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Handle form submissions
    function initializeFormHandlers() {
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // Encrypt password with timestamp and nonce
                const { encryptedData, timestamp, nonce } = await RSAUtil.encryptPassword(password);
                
                const response = await fetch('/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password: encryptedData,
                        timestamp,
                        nonce
                    })
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = '/';
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                console.error('Login error:', error);
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
                // Encrypt password with timestamp and nonce
                const { encryptedData, timestamp, nonce } = await RSAUtil.encryptPassword(password);
                
                const response = await fetch('/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password: encryptedData,
                        timestamp,
                        nonce
                    })
                });

                const data = await response.json();
                if (data.success) {
                    document.querySelector('[data-form="login"]').click();
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                console.error('Registration error:', error);
                const errorDiv = document.getElementById('registerError');
                errorDiv.textContent = error.message || 'Registration failed';
                errorDiv.style.display = 'block';
            }
        });
    }

    async function handleMetaMaskLogin() {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            showError('metamaskError', i18n.t('auth.metamaskNotInstalled'));
            return;
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            const address = accounts[0];

            // Get the nonce from server
            const nonceResponse = await fetch('/api/auth/metamask/nonce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address })
            });
            const { nonce } = await nonceResponse.json();

            // Request signature from user
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [
                    `Sign this message to verify your identity. Nonce: ${nonce}`,
                    address
                ]
            });

            // Verify signature with backend
            const verifyResponse = await fetch('/api/auth/metamask/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                    signature,
                    nonce
                })
            });

            const result = await verifyResponse.json();
            if (result.success) {
                window.location.href = '/';
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            showError('metamaskError', error.message);
        }
    }

    function showError(elementId, message) {
        const errorDiv = document.getElementById(elementId);
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    // Register page lifecycle
    PageLifecycle.register('login', {
        mount: () => {
            window.addEventListener('textsUpdated', updateTexts);
            initializeTabs();
            initializeFormHandlers();
            updateTexts();

            // Add MetaMask login handler
            document.getElementById('metamaskLogin')?.addEventListener('click', handleMetaMaskLogin);
        },
        unmount: () => {
            window.removeEventListener('textsUpdated', updateTexts);
            document.getElementById('metamaskLogin')?.removeEventListener('click', handleMetaMaskLogin);
        }
    });
})(); 