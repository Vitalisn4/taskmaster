// Main Application Module

// DOM Elements
const taskBoard = document.querySelector('.task-board');
const taskColumns = document.querySelectorAll('.task-column');
const taskLists = document.querySelectorAll('.task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const getStartedBtn = document.getElementById('get-started-btn');
const taskModal = document.getElementById('task-modal');
const closeModalBtn = document.getElementById('close-modal');
const deleteTaskBtn = document.getElementById('delete-task-btn');
const taskSearch = document.getElementById('task-search');
const priorityFilter = document.getElementById('priority-filter');
const dateFilter = document.getElementById('date-filter');
const undoContainer = document.getElementById('undo-container');
const undoBtn = document.getElementById('undo-btn');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const themeToggle = document.getElementById('theme-toggle');
const themeOptions = document.querySelectorAll('.theme-option');
const clearDataBtn = document.getElementById('clear-data-btn');
const exportDataBtn = document.getElementById('export-data-btn');
const importDataInput = document.getElementById('import-data');
const confirmModal = document.getElementById('confirm-modal');
const closeConfirmModal = document.getElementById('close-confirm-modal');
const cancelAction = document.getElementById('cancel-action');
const confirmAction = document.getElementById('confirm-action');
const notificationToggle = document.getElementById('notification-toggle');
const notificationTime = document.getElementById('notification-time');
const notificationToast = document.getElementById('notification-toast');
const closeNotificationBtn = document.getElementById('close-notification-btn');
const viewTaskBtn = document.getElementById('view-task-btn');
const snoozeNotificationBtn = document.getElementById('snooze-notification-btn');
const snoozeModal = document.getElementById('snooze-modal');
const closeSnoozeModal = document.getElementById('close-snooze-modal');
const snoozeAction = document.getElementById('snooze-action');
const snoozeTaskTitle = document.getElementById('snooze-task-title');
const notificationTaskTitle = document.getElementById('notification-task-title');

// State
let tasks = [];
let currentPage = 'home';
let currentTheme = 'light';
let draggedTask = null;
let lastAction = null;
let currentTaskId = null;
let confirmCallback = null;
let notificationEnabled = true;
let notificationDays = 3;
let currentSnoozeTaskId = null;

// Initialize App
function initApp() {
    loadTasks();
    updateTaskCounts();
    updateProgressStats();
    loadSettings();
    checkDeadlines();
    
    // Set today as the minimum date for new tasks
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task-due-date').min = today;
    
    // Check if dark mode is preferred
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme')) {
        setTheme('dark');
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Listen for custom events from form.js
    document.addEventListener('task:create', handleTaskCreate);
    document.addEventListener('task:update', handleTaskUpdate);
}

// Handle task create event
function handleTaskCreate(event) {
    const { taskData } = event.detail;
    
    // Create new task
    const newTask = {
        id: Utils.generateId(),
        ...taskData,
        createdAt: new Date().toISOString()
    };
    
    // Save the last action for undo
    lastAction = {
        type: 'add',
        taskId: newTask.id
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    showUndoContainer();
}

// Handle task update event
function handleTaskUpdate(event) {
    const { taskId, taskData } = event.detail;
    
    // Update existing task
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        // Save the last action for undo
        lastAction = {
            type: 'edit',
            taskId: taskId,
            oldTask: { ...tasks[taskIndex] }
        };
        
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...taskData
        };
        
        saveTasks();
        renderTasks();
        showUndoContainer();
    }
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCounts();
    updateProgressStats();
}

// Load settings from localStorage
function loadSettings() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
    
    const savedNotificationEnabled = localStorage.getItem('notificationEnabled');
    if (savedNotificationEnabled !== null) {
        notificationEnabled = savedNotificationEnabled === 'true';
        notificationToggle.checked = notificationEnabled;
    }
    
    const savedNotificationDays = localStorage.getItem('notificationDays');
    if (savedNotificationDays) {
        notificationDays = parseInt(savedNotificationDays);
        notificationTime.value = notificationDays;
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('notificationEnabled', notificationEnabled);
    localStorage.setItem('notificationDays', notificationDays);
}

// Set up event listeners
function setupEventListeners() {
    // Task Board Events
    taskLists.forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('drop', handleDrop);
    });
    
    // Task Modal Events
    addTaskBtn.addEventListener('click', openAddTaskModal);
    getStartedBtn.addEventListener('click', () => {
        navigateTo('tasks');
        openAddTaskModal();
    });
    closeModalBtn.addEventListener('click', closeTaskModal);
    deleteTaskBtn.addEventListener('click', handleDeleteTask);
    
    // Task Progress Slider
    const taskProgress = document.getElementById('task-progress');
    const progressValue = document.getElementById('progress-value');
    taskProgress.addEventListener('input', () => {
        progressValue.textContent = `${taskProgress.value}%`;
    });
    
    // Search and Filter Events
    taskSearch.addEventListener('input', Utils.debounce(filterTasks, 300));
    priorityFilter.addEventListener('change', filterTasks);
    dateFilter.addEventListener('change', filterTasks);
    
    // Undo Action
    undoBtn.addEventListener('click', undoLastAction);
    
    // Navigation Events
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
            toggleMobileMenu();
        });
    });
    
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Theme Toggle
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Theme Options
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            setTheme(option.dataset.theme);
        });
    });
    
    // Data Management
    clearDataBtn.addEventListener('click', () => {
        showConfirmModal(
            'Clear All Tasks',
            'Are you sure you want to delete all tasks? This action cannot be undone.',
            clearAllTasks
        );
    });
    
    exportDataBtn.addEventListener('click', exportTasks);
    importDataInput.addEventListener('change', importTasks);
    
    // Confirmation Modal
    closeConfirmModal.addEventListener('click', closeConfirmationModal);
    cancelAction.addEventListener('click', closeConfirmationModal);
    confirmAction.addEventListener('click', executeConfirmAction);
    
    // Notification Settings
    notificationToggle.addEventListener('change', () => {
        notificationEnabled = notificationToggle.checked;
        saveSettings();
    });
    
    notificationTime.addEventListener('change', () => {
        notificationDays = parseInt(notificationTime.value);
        saveSettings();
    });
    
    // Notification Toast
    closeNotificationBtn.addEventListener('click', () => {
        notificationToast.classList.add('hidden');
    });
    
    viewTaskBtn.addEventListener('click', () => {
        notificationToast.classList.add('hidden');
        if (currentTaskId) {
            navigateTo('tasks');
            const task = tasks.find(t => t.id === currentTaskId);
            if (task) {
                openEditTaskModal(task);
            }
        }
    });
    
    snoozeNotificationBtn.addEventListener('click', () => {
        notificationToast.classList.add('hidden');
        if (currentTaskId) {
            currentSnoozeTaskId = currentTaskId;
            const task = tasks.find(t => t.id === currentTaskId);
            if (task) {
                snoozeTaskTitle.textContent = task.title;
                snoozeModal.classList.add('active');
            }
        }
    });
    
    // Snooze Modal
    closeSnoozeModal.addEventListener('click', () => {
        snoozeModal.classList.remove('active');
    });
    
    snoozeAction.addEventListener('click', () => {
        const snoozeTime = document.getElementById('snooze-time').value;
        if (currentSnoozeTaskId) {
            if (snoozeTime === 'never') {
                localStorage.setItem(`snooze_${currentSnoozeTaskId}`, 'never');
            } else {
                const hours = parseInt(snoozeTime);
                const snoozeUntil = new Date();
                snoozeUntil.setHours(snoozeUntil.getHours() + hours);
                localStorage.setItem(`snooze_${currentSnoozeTaskId}`, snoozeUntil.toISOString());
            }
        }
        snoozeModal.classList.remove('active');
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeTaskModal();
        }
        if (e.target === confirmModal) {
            closeConfirmationModal();
        }
        if (e.target === snoozeModal) {
            snoozeModal.classList.remove('active');
        }
    });
    
    // Check for deadlines periodically
    setInterval(checkDeadlines, 3600000); // Check every hour
}

// Render tasks in their respective columns
function renderTasks() {
    // Clear all task lists
    taskLists.forEach(list => {
        list.innerHTML = '';
    });
    
    // Get task lists by column
    const todoList = document.getElementById('todo-tasks');
    const progressList = document.getElementById('progress-tasks');
    const completedList = document.getElementById('completed-tasks');
    
    // Filter and sort tasks
    const searchTerm = taskSearch.value.toLowerCase();
    const priorityValue = priorityFilter.value;
    const dateValue = dateFilter.value;
    
    const filteredTasks = tasks.filter(task => {
        // Search filter
        const matchesSearch = 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm);
        
        // Priority filter
        const matchesPriority = priorityValue === 'all' || task.priority === priorityValue;
        
        // Date filter
        let matchesDate = true;
        if (dateValue !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            
            if (dateValue === 'today') {
                matchesDate = Utils.isToday(task.dueDate);
            } else if (dateValue === 'week') {
                matchesDate = Utils.isWithinDays(task.dueDate, 7);
            } else if (dateValue === 'overdue') {
                matchesDate = Utils.isPast(task.dueDate) && task.status !== 'completed';
            }
        }
        
        return matchesSearch && matchesPriority && matchesDate;
    });
    
    // Sort tasks by due date
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    // Render tasks in their respective columns
    filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task);
        
        if (task.status === 'todo') {
            todoList.appendChild(taskCard);
        } else if (task.status === 'inProgress') {
            progressList.appendChild(taskCard);
        } else if (task.status === 'completed') {
            completedList.appendChild(taskCard);
        }
    });
    
    // Update task counts
    updateTaskCounts();
}

// Create a task card element
function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.priority}-priority hover-lift`;
    taskCard.dataset.id = task.id;
    taskCard.draggable = true;
    
    // Check if task is overdue
    const isOverdue = Utils.isPast(task.dueDate) && task.status !== 'completed';
    if (isOverdue) {
        taskCard.classList.add('overdue');
    }
    
    // Format the due date
    const formattedDate = Utils.formatDate(task.dueDate);
    
    // Create task card content
    taskCard.innerHTML = `
        <div class="task-header">
            <div class="task-title">${task.title}</div>
            <div class="task-priority ${task.priority}">${Utils.capitalizeFirstLetter(task.priority)}</div>
        </div>
        <div class="task-description">${task.description || 'No description'}</div>
        <div class="task-meta">
            <div class="task-due-date">
                <div class="calendar-icon"></div>
                ${formattedDate}
            </div>
        </div>
        <div class="task-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${task.progress}%"></div>
            </div>
            <div class="progress-text">${task.progress}% Complete</div>
        </div>
        <div class="task-actions-menu">
            <button class="task-action-btn edit-task" aria-label="Edit task">
                <div class="edit-icon"></div>
            </button>
            <button class="task-action-btn delete-task" aria-label="Delete task">
                <div class="delete-icon"></div>
            </button>
        </div>
    `;
    
    // Add event listeners
    taskCard.addEventListener('dragstart', () => {
        draggedTask = task;
        taskCard.classList.add('dragging');
    });
    
    taskCard.addEventListener('dragend', () => {
        taskCard.classList.remove('dragging');
    });
    
    taskCard.addEventListener('click', (e) => {
        // Ignore clicks on action buttons
        if (!e.target.closest('.task-action-btn')) {
            openEditTaskModal(task);
        }
    });
    
    // Edit button
    const editBtn = taskCard.querySelector('.edit-task');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditTaskModal(task);
    });
    
    // Delete button
    const deleteBtn = taskCard.querySelector('.delete-task');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentTaskId = task.id;
        showConfirmModal(
            'Delete Task',
            `Are you sure you want to delete "${task.title}"?`,
            () => {
                deleteTask(task.id);
            }
        );
    });
    
    return taskCard;
}

// Handle drag over event
function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

// Handle drop event
function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (!draggedTask) return;
    
    const column = this.closest('.task-column');
    const columnId = column.dataset.column;
    
    if (draggedTask.status !== columnId) {
        // Save the last action for undo
        lastAction = {
            type: 'move',
            taskId: draggedTask.id,
            fromStatus: draggedTask.status,
            toStatus: columnId
        };
        
        // Update task status
        const taskIndex = tasks.findIndex(t => t.id === draggedTask.id);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = columnId;
            
            // If moved to completed, set progress to 100%
            if (columnId === 'completed') {
                tasks[taskIndex].progress = 100;
            }
            
            saveTasks();
            renderTasks();
            showUndoContainer();
        }
    }
    
    draggedTask = null;
}

// Open add task modal
function openAddTaskModal() {
    // Reset form
    document.getElementById('task-form').reset();
    document.getElementById('modal-title').textContent = 'Add New Task';
    document.getElementById('task-id').value = '';
    document.getElementById('task-status').value = 'todo';
    document.getElementById('progress-group').style.display = 'none';
    deleteTaskBtn.classList.add('hidden');
    
    // Set default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('task-due-date').value = tomorrow.toISOString().split('T')[0];
    
    // Show modal
    taskModal.classList.add('active');
}

// Open edit task modal
function openEditTaskModal(task) {
    // Fill form with task data
    document.getElementById('modal-title').textContent = 'Edit Task';
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description || '';
    document.getElementById('task-due-date').value = task.dueDate;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-progress').value = task.progress;
    document.getElementById('progress-value').textContent = `${task.progress}%`;
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-status').value = task.status;
    document.getElementById('progress-group').style.display = 'block';
    deleteTaskBtn.classList.remove('hidden');
    
    // Show modal
    taskModal.classList.add('active');
}

// Close task modal
function closeTaskModal() {
    taskModal.classList.remove('active');
}

// Handle delete task
function handleDeleteTask() {
    const taskId = document.getElementById('task-id').value;
    if (taskId) {
        showConfirmModal(
            'Delete Task',
            'Are you sure you want to delete this task?',
            () => {
                deleteTask(taskId);
                closeTaskModal();
            }
        );
    }
}

// Delete task
function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        // Save the last action for undo
        lastAction = {
            type: 'delete',
            taskId: taskId,
            task: { ...tasks[taskIndex] }
        };
        
        tasks.splice(taskIndex, 1);
        saveTasks();
        renderTasks();
        showUndoContainer();
    }
}

// Filter tasks
function filterTasks() {
    renderTasks();
}

// Show undo container
function showUndoContainer() {
    undoContainer.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        undoContainer.classList.add('hidden');
    }, 5000);
}

// Undo last action
function undoLastAction() {
    if (!lastAction) return;
    
    if (lastAction.type === 'move') {
        const taskIndex = tasks.findIndex(t => t.id === lastAction.taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = lastAction.fromStatus;
            saveTasks();
            renderTasks();
        }
    } else if (lastAction.type === 'add') {
        const taskIndex = tasks.findIndex(t => t.id === lastAction.taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderTasks();
        }
    } else if (lastAction.type === 'delete') {
        tasks.push(lastAction.task);
        saveTasks();
        renderTasks();
    } else if (lastAction.type === 'edit') {
        const taskIndex = tasks.findIndex(t => t.id === lastAction.taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = lastAction.oldTask;
            saveTasks();
            renderTasks();
        }
    }
    
    lastAction = null;
    undoContainer.classList.add('hidden');
}

// Navigate to page
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`${page}-page`).classList.add('active');
    
    // Update navigation
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    currentPage = page;
    
    // Close mobile menu
    mobileMenu.classList.remove('active');
    
    // Update progress stats if on progress page
    if (page === 'progress') {
        updateProgressStats();
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    
    // Toggle menu icon
    const spans = mobileMenuToggle.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Toggle dark mode
function toggleDarkMode() {
    if (currentTheme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

// Set theme
function setTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('dark-theme', 'purple-theme', 'teal-theme');
    
    // Add selected theme class
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (theme === 'purple') {
        document.body.classList.add('purple-theme');
    } else if (theme === 'teal') {
        document.body.classList.add('teal-theme');
    }
    
    // Update active theme option
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === theme) {
            option.classList.add('active');
        }
    });
    
    currentTheme = theme;
    saveSettings();
}

// Update task counts
function updateTaskCounts() {
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const progressCount = tasks.filter(t => t.status === 'inProgress').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    
    document.getElementById('todo-count').textContent = todoCount;
    document.getElementById('progress-count').textContent = progressCount;
    document.getElementById('completed-count').textContent = completedCount;
}

// Update progress stats
function updateProgressStats() {
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const progressCount = tasks.filter(t => t.status === 'inProgress').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    
    // Update stats on progress page
    document.getElementById('todo-tasks-count').textContent = todoCount;
    document.getElementById('in-progress-tasks-count').textContent = progressCount;
    document.getElementById('completed-tasks-count').textContent = completedCount;
    
    // Calculate completion rate
    const totalTasks = todoCount + progressCount + completedCount;
    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
    
    // Update chart bars
    const todoPercentage = totalTasks > 0 ? Math.round((todoCount / totalTasks) * 100) : 0;
    const progressPercentage = totalTasks > 0 ? Math.round((progressCount / totalTasks) * 100) : 0;
    const completedPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    
    document.getElementById('todo-bar').style.width = `${todoPercentage}%`;
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    document.getElementById('completed-bar').style.width = `${completedPercentage}%`;
    
    document.getElementById('todo-bar-value').textContent = `${todoPercentage}%`;
    document.getElementById('progress-bar-value').textContent = `${progressPercentage}%`;
    document.getElementById('completed-bar-value').textContent = `${completedPercentage}%`;
}

// Clear all tasks
function clearAllTasks() {
    tasks = [];
    saveTasks();
    renderTasks();
}

// Export tasks
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    Utils.downloadAsFile(dataStr, `taskmaster_export_${new Date().toISOString().slice(0, 10)}.json`);
}

// Import tasks
function importTasks(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTasks = JSON.parse(e.target.result);
            if (Array.isArray(importedTasks)) {
                showConfirmModal(
                    'Import Tasks',
                    `Are you sure you want to import ${importedTasks.length} tasks? This will replace your current tasks.`,
                    () => {
                        tasks = importedTasks;
                        saveTasks();
                        renderTasks();
                        alert('Tasks imported successfully!');
                    }
                );
            } else {
                alert('Invalid task data format.');
            }
        } catch (error) {
            alert('Error importing tasks: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Show confirmation modal
function showConfirmModal(title, message, callback) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    confirmCallback = callback;
    confirmModal.classList.add('active');
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmModal.classList.remove('active');
    confirmCallback = null;
}

// Execute confirm action
function executeConfirmAction() {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmationModal();
}

// Check for approaching deadlines
function checkDeadlines() {
    if (!notificationEnabled) return;
    
    const today = new Date();
    const notificationDate = new Date();
    notificationDate.setDate(today.getDate() + notificationDays);
    
    tasks.forEach(task => {
        if (task.status !== 'completed') {
            const dueDate = new Date(task.dueDate);
            
            // Check if task is due within notification days
            if (dueDate <= notificationDate && dueDate >= today) {
                // Check if task is snoozed
                const snoozeUntil = localStorage.getItem(`snooze_${task.id}`);
                if (snoozeUntil === 'never') {
                    return; // Skip this task
                }
                
                if (snoozeUntil) {
                    const snoozeDate = new Date(snoozeUntil);
                    if (today < snoozeDate) {
                        return; // Still snoozed
                    }
                }
                
                // Show notification
                showNotification(task);
            }
        }
    });
}

// Show notification
function showNotification(task) {
    currentTaskId = task.id;
    notificationTaskTitle.textContent = task.title;
    
    const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    let dueText = '';
    
    if (daysUntilDue === 0) {
        dueText = 'due today';
    } else if (daysUntilDue === 1) {
        dueText = 'due tomorrow';
    } else {
        dueText = `due in ${daysUntilDue} days`;
    }
    
    document.getElementById('notification-text').textContent = `Task is ${dueText}!`;
    notificationToast.classList.remove('hidden');
    
    // Hide after 10 seconds
    setTimeout(() => {
        if (!notificationToast.classList.contains('hidden')) {
            notificationToast.classList.add('hidden');
        }
    }, 10000);
    
    // Also try to send email notification if it's a critical task
    if (task.priority === 'high' && daysUntilDue <= 1) {
        EmailService.sendTaskNotificationEmail(task)
            .catch(error => console.error('Failed to send email notification:', error));
    }
}

