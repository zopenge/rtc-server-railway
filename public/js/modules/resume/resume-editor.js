window.ResumeEditorModule = {
    _state: {
        currentResume: null,
        isProcessing: false,
        changes: new Set()
    },

    render({ resumeId }) {
        const container = document.getElementById('contentGrid');
        container.innerHTML = `
            <div class="editor-container">
                <div class="toolbar" id="resumeToolbar">
                    <button class="tool-button" id="backToList">
                        ${i18n.t('common.back')}
                    </button>
                    <button class="tool-button" id="processResume">
                        ${i18n.t('resume.process')}
                    </button>
                    <button class="tool-button" id="saveResume">
                        ${i18n.t('common.save')}
                    </button>
                </div>
                <div class="main-content">
                    <div class="preview-area" id="resumePreview"></div>
                    <div class="property-panel" id="resumeProperties"></div>
                </div>
            </div>
        `;

        this._initComponents();
        this._bindEvents();
        this._loadResume(resumeId);
    },

    async _loadResume(resumeId) {
        try {
            const response = await fetch(`/api/resumes/${resumeId}`);
            this._state.currentResume = await response.json();
            this._updateUI();
        } catch (error) {
            console.error('Failed to load resume:', error);
        }
    },

    _updateUI() {
        // Update preview panel
        const previewPanel = document.getElementById('resumePreview');
        previewPanel.innerHTML = this._renderPreview();

        // Update properties panel
        const propertiesPanel = document.getElementById('resumeProperties');
        propertiesPanel.innerHTML = this._renderProperties();
    },

    _renderPreview() {
        const resume = this._state.currentResume;
        return `
            <div class="resume-preview">
                <h2>${resume.name}</h2>
                <div class="resume-content">
                    ${resume.content}
                </div>
            </div>
        `;
    },

    _renderProperties() {
        const resume = this._state.currentResume;
        return `
            <div class="property-fields">
                <div class="property-field">
                    <label>${i18n.t('resume.status')}</label>
                    <select id="resumeStatus">
                        <option value="pending" ${resume.status === 'pending' ? 'selected' : ''}>
                            ${i18n.t('resume.status.pending')}
                        </option>
                        <option value="processed" ${resume.status === 'processed' ? 'selected' : ''}>
                            ${i18n.t('resume.status.processed')}
                        </option>
                    </select>
                </div>
                <div class="property-field">
                    <label>${i18n.t('resume.skills')}</label>
                    <div class="skills-editor" id="skillsEditor">
                        ${this._renderSkillsEditor()}
                    </div>
                </div>
            </div>
        `;
    },

    _bindEvents() {
        // Back button
        document.getElementById('backToList').addEventListener('click', () => {
            Workspace.switchView('resumeList');
        });

        // Process button
        document.getElementById('processResume').addEventListener('click', () => {
            this._processResume();
        });

        // Save button
        document.getElementById('saveResume').addEventListener('click', () => {
            this._saveResume();
        });
    },

    async _processResume() {
        if (this._state.isProcessing) return;
        
        try {
            this._state.isProcessing = true;
            const response = await fetch(`/api/resumes/${this._state.currentResume.id}/process`, {
                method: 'POST'
            });
            const result = await response.json();
            this._state.currentResume = result;
            this._updateUI();
        } catch (error) {
            console.error('Failed to process resume:', error);
        } finally {
            this._state.isProcessing = false;
        }
    },

    async _saveResume() {
        try {
            await fetch(`/api/resumes/${this._state.currentResume.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this._state.currentResume)
            });
            this._state.changes.clear();
        } catch (error) {
            console.error('Failed to save resume:', error);
        }
    },

    cleanup() {
        this._state.currentResume = null;
        this._state.changes.clear();
    }
}; 