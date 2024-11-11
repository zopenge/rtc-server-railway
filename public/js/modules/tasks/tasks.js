// Tasks module implementation
window.TasksModule = {
    // private state
    _state: {
        tasks: [],
        filter: 'available'
    },

    // render method required by workspace
    render() {
        const container = document.getElementById('contentGrid');
        container.innerHTML = `
            <div class="tasks-container">
                <div class="tasks-header">
                    <h2>${i18n.t('workspace.tasks.title')}</h2>
                    <div class="tasks-filter">
                        <button data-filter="available" class="active">
                            ${i18n.t('workspace.tasks.available')}
                        </button>
                        <button data-filter="processing">
                            ${i18n.t('workspace.tasks.processing')}
                        </button>
                        <button data-filter="completed">
                            ${i18n.t('workspace.tasks.completed')}
                        </button>
                    </div>
                </div>
                <div class="tasks-list" id="tasksList"></div>
            </div>
        `;

        this._bindEvents();
        this._loadTasks();
    },

    // private methods
    async _loadTasks() {
        try {
            const response = await fetch(`/api/tasks?filter=${this._state.filter}`);
            const data = await response.json();
            this._state.tasks = data.tasks;
            this._renderTasks();
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    },

    _renderTasks() {
        const tasksList = document.getElementById('tasksList');
        if (!tasksList) return;

        tasksList.innerHTML = this._state.tasks.map(task => `
            <div class="task-item" data-id="${task.id}">
                <div class="task-info">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                </div>
                <div class="task-meta">
                    <span class="priority">${i18n.t('workspace.tasks.priority')}: ${task.priority}</span>
                    <span class="deadline">${i18n.t('workspace.tasks.deadline')}: ${task.deadline}</span>
                </div>
            </div>
        `).join('');
    },

    _bindEvents() {
        document.querySelectorAll('.tasks-filter button').forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                if (filter) {
                    this._state.filter = filter;
                    this._loadTasks();
                    
                    // Update active filter
                    document.querySelectorAll('.tasks-filter button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    e.target.classList.add('active');
                }
            });
        });
    },

    // cleanup method
    cleanup() {
        this._state.tasks = [];
    }
}; 