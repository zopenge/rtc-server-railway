window.ResumeListModule = {
    // private state
    _state: {
        resumes: [],
        filters: {
            skills: [],
            experience: null,
            education: null,
            status: null
        },
        page: 1,
        pageSize: 20
    },

    // render method required by workspace
    render(params = {}) {
        const container = document.getElementById('contentGrid');
        container.innerHTML = `
            <div class="resume-container">
                <div class="toolbar">
                    <button class="tool-button" id="uploadResume">
                        ${i18n.t('resume.upload')}
                    </button>
                    <button class="tool-button" id="batchProcess">
                        ${i18n.t('resume.batchProcess')}
                    </button>
                </div>
                <div class="main-content">
                    <div class="resume-list" id="resumeList"></div>
                    <div class="filter-panel" id="filterPanel"></div>
                </div>
            </div>
        `;

        this._initializeComponents();
        this._bindEvents();
        this._loadResumes();
    },

    // private methods
    async _loadResumes() {
        try {
            const queryParams = new URLSearchParams({
                page: this._state.page,
                pageSize: this._state.pageSize,
                ...this._state.filters
            });

            const response = await fetch(`/api/resumes?${queryParams}`);
            const data = await response.json();
            
            this._state.resumes = data.resumes;
            this._renderResumeList();
        } catch (error) {
            console.error('Failed to load resumes:', error);
        }
    },

    _renderResumeList() {
        const listContainer = document.getElementById('resumeList');
        const resumeItems = this._state.resumes.map(resume => `
            <div class="resume-item" data-id="${resume.id}">
                <div class="resume-header">
                    <h3>${resume.name}</h3>
                    <span class="status ${resume.status}">${resume.status}</span>
                </div>
                <div class="resume-info">
                    <p>${resume.education}</p>
                    <p>${resume.experience} years</p>
                </div>
                <div class="resume-skills">
                    ${resume.skills.map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = resumeItems;
    },

    _bindEvents() {
        // Resume item click
        document.getElementById('resumeList').addEventListener('click', (e) => {
            const resumeItem = e.target.closest('.resume-item');
            if (resumeItem) {
                const resumeId = resumeItem.dataset.id;
                Workspace.switchView('resumeEditor', { resumeId });
            }
        });

        // Upload button
        document.getElementById('uploadResume').addEventListener('click', () => {
            this._handleUpload();
        });

        // Batch process button
        document.getElementById('batchProcess').addEventListener('click', () => {
            this._handleBatchProcess();
        });
    },

    async _handleUpload() {
        // Implement resume upload logic
    },

    async _handleBatchProcess() {
        // Implement batch processing logic
    },

    // cleanup method
    cleanup() {
        // Cleanup any resources or event listeners
    }
}; 