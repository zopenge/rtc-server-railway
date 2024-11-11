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

    _initializeComponents() {
        // initialize filter panel
        const filterPanel = document.getElementById('filterPanel');
        if (filterPanel) {
            filterPanel.innerHTML = `
                <div class="filter-section">
                    <h3>${i18n.t('resume.filters.title')}</h3>
                    
                    <!-- Skills filter -->
                    <div class="filter-group">
                        <label>${i18n.t('resume.filters.skills')}</label>
                        <input type="text" 
                               class="filter-input" 
                               id="skillsFilter" 
                               placeholder="${i18n.t('resume.filters.skillsPlaceholder')}">
                    </div>
                    
                    <!-- Experience filter -->
                    <div class="filter-group">
                        <label>${i18n.t('resume.filters.experience')}</label>
                        <select class="filter-input" id="experienceFilter">
                            <option value="">${i18n.t('common.all')}</option>
                            <option value="0-2">0-2 ${i18n.t('resume.years')}</option>
                            <option value="3-5">3-5 ${i18n.t('resume.years')}</option>
                            <option value="5+">${i18n.t('resume.years')} 5+</option>
                        </select>
                    </div>
                    
                    <!-- Education filter -->
                    <div class="filter-group">
                        <label>${i18n.t('resume.filters.education')}</label>
                        <select class="filter-input" id="educationFilter">
                            <option value="">${i18n.t('common.all')}</option>
                            <option value="bachelor">${i18n.t('resume.education.bachelor')}</option>
                            <option value="master">${i18n.t('resume.education.master')}</option>
                            <option value="phd">${i18n.t('resume.education.phd')}</option>
                        </select>
                    </div>
                    
                    <!-- Status filter -->
                    <div class="filter-group">
                        <label>${i18n.t('resume.filters.status')}</label>
                        <select class="filter-input" id="statusFilter">
                            <option value="">${i18n.t('common.all')}</option>
                            <option value="pending">${i18n.t('resume.status.pending')}</option>
                            <option value="processing">${i18n.t('resume.status.processing')}</option>
                            <option value="completed">${i18n.t('resume.status.completed')}</option>
                        </select>
                    </div>
                </div>
            `;

            // bind filter events
            this._bindFilterEvents();
        }
    },

    _bindFilterEvents() {
        // Skills filter
        const skillsFilter = document.getElementById('skillsFilter');
        if (skillsFilter) {
            skillsFilter.addEventListener('input', Utils.debounce(() => {
                this._state.filters.skills = skillsFilter.value
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(skill => skill.length > 0);
                this._loadResumes();
            }, 300));
        }

        // Experience filter
        const experienceFilter = document.getElementById('experienceFilter');
        if (experienceFilter) {
            experienceFilter.addEventListener('change', () => {
                this._state.filters.experience = experienceFilter.value;
                this._loadResumes();
            });
        }

        // Education filter
        const educationFilter = document.getElementById('educationFilter');
        if (educationFilter) {
            educationFilter.addEventListener('change', () => {
                this._state.filters.education = educationFilter.value;
                this._loadResumes();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this._state.filters.status = statusFilter.value;
                this._loadResumes();
            });
        }
    },

    // cleanup method
    cleanup() {
        // Cleanup any resources or event listeners
    }
}; 