class AIService {
    constructor(config) {
        this.config = config;
        this.isInitialized = false;
    }

    // Initialize AI service
    async initialize() {
        try {
            if (!this.config.enabled) {
                throw new Error('AI service is not configured');
            }

            // Just validate config
            if (!this.config.apiKey) {
                throw new Error('AI API key is not configured');
            }

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('AI initialization error:', error);
            throw error;
        }
    }

    /**
     * Chat with AI service
     * @param {string} message - The message to send to AI
     * @param {Object} options - Chat options
     * @param {number} [options.temperature=0.7] - Controls randomness in responses (0-1)
     * @param {number} [options.top_p=1] - Controls diversity via nucleus sampling (0-1)
     * @param {number} [options.max_tokens=2048] - Maximum tokens in response
     * @param {number} [options.presence_penalty=0] - Penalty for new topics (-2.0 to 2.0)
     * @param {number} [options.frequency_penalty=0] - Penalty for frequency (-2.0 to 2.0)
     * @param {string} [options.model="moonshot-v1-8k"] - Model to use
     * @param {boolean} [options.stream=false] - Enable streaming responses
     * @param {Array<Object>} [options.stop] - Array of stop sequences
     * @returns {Promise<string>} The AI response text
     */
    async chat(message, options = {}) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: message
                    }],
                    ...options
                })
            });

            if (!response.ok) {
                throw new Error(`AI request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('AI chat error:', error);
            throw error;
        }
    }

    // Health check
    async healthCheck() {
        try {
            if (!this.config.enabled) {
                return {
                    isHealthy: false,
                    message: 'AI service is not configured'
                };
            }

            if (!this.isInitialized) {
                return {
                    isHealthy: false,
                    message: 'AI service is not initialized'
                };
            }

            return {
                isHealthy: true,
                message: 'AI service is configured and initialized'
            };
        } catch (error) {
            return {
                isHealthy: false,
                message: `AI service error: ${error.message}`
            };
        }
    }

    // Cleanup
    async shutdown() {
        this.isInitialized = false;
    }
}

module.exports = AIService; 