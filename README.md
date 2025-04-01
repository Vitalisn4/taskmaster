# TaskMaster - Task Management Application

![TaskMaster Logo](images/taskmaster-logo.png)

## 📋 Overview

TaskMaster is a fully interactive, visually stunning, and user-friendly drag-and-drop task management application built using only HTML, CSS, and vanilla JavaScript. It allows users to create, organize, track, and manage tasks with progress tracking and deadline notifications.

**Live Demo:** [https://vitalisn4.github.io/taskmaster/](https://vitalisn4.github.io/taskmaster/)

## ✨ Features

### Core Features
- **Drag-and-Drop Functionality**: Move tasks between "To Do," "In Progress," and "Completed" columns
- **Task Progress Tracking**: Monitor task completion with visual progress indicators
- **Deadline Notifications**: Get alerts for approaching and overdue tasks
- **Task Priority Levels**: Color-coded priorities (High, Medium, Low)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Toggle**: Switch between light and dark themes
- **Data Persistence**: All tasks are saved to localStorage
- **Task Filtering**: Filter tasks by priority, due date, or search terms
- **Undo Functionality**: Revert the last action performed
- **Multiple Themes**: Choose between Light, Dark, Purple, and Teal themes

### Additional Features
- **Task Analytics**: Visual representation of task distribution and completion rates
- **Export/Import**: Backup and restore your tasks as JSON files
- **Contact Form**: Send messages directly to the developer
- **Notification Snoozing**: Temporarily dismiss deadline notifications
- **Smooth Animations**: Elegant transitions and hover effects

## 🛠️ Technologies Used

This project strictly uses only:
- **HTML5**: Semantic markup for structure
- **CSS3**: Custom styling with variables, animations, and responsive design
- **Vanilla JavaScript**: No frameworks or libraries
- **LocalStorage API**: For data persistence
- **CSS Custom Properties**: For theming and dynamic styling

## 📁 Project Structure

\`\`\`
taskmaster/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── images/
│   ├── taskmaster-logo.png
│   └── favicon.ico
├── scripts/
│   ├── main.js         # Main application logic
│   ├── form.js         # Form handling functionality
│   ├── utils.js        # Utility functions
│   └── email.js        # Email service functionality
├── styles/
│   ├── main.css        # Main styles
│   └── animations.css  # Animations and transitions
├── index.html          # Main HTML structure
├── manifest.json       # PWA manifest
└── README.md           # Project documentation
\`\`\`

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/Vitalisn4/taskmaster.git
   \`\`\`

2. Navigate to the project directory:
   \`\`\`bash
   cd taskmaster
   \`\`\`

3. Open `index.html` in your browser or use a local development server.

### Deployment

The project is set up with GitHub Actions for automatic deployment to GitHub Pages. When you push to the main branch, the workflow will automatically deploy your changes.

To deploy manually:

1. Push your changes to the main branch:
   \`\`\`bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   \`\`\`

2. The GitHub Action will automatically deploy your changes to GitHub Pages.

## 🎨 Customization

### Themes
TaskMaster comes with four built-in themes:
- Light (default)
- Dark
- Purple
- Teal

You can customize these themes by modifying the CSS variables in `styles/main.css`.

### Adding New Features
To add new features:
1. Create new JavaScript modules in the `scripts/` directory
2. Add new CSS styles in the `styles/` directory
3. Update the HTML structure in `index.html` as needed

## 📝 Usage Guide

### Creating a Task
1. Click the "Add Task" button
2. Fill in the task details (title, description, due date, priority)
3. Click "Save Task"

### Managing Tasks
- **Move a Task**: Drag and drop tasks between columns
- **Edit a Task**: Click on a task card or the edit icon
- **Delete a Task**: Click the delete icon on a task card
- **Filter Tasks**: Use the search box or filter dropdowns
- **Track Progress**: View the Progress page for task analytics

### Using the Navigation
- **Home**: Overview of the application with feature cards
- **My Tasks**: Main task board with drag-and-drop functionality
- **Progress**: View task analytics and completion rates
- **Settings**: Customize themes, notification settings, and manage data
- **Contact**: Send a message to the developer

### Feature Cards
On the home page, you can click on any of the feature cards to navigate to the relevant section:
- **Drag & Drop**: Takes you to the Tasks page
- **Track Progress**: Takes you to the Progress page
- **Deadline Alerts**: Takes you to the Settings page (Notification section)

### Settings
- **Change Theme**: Go to Settings > Appearance
- **Notification Settings**: Go to Settings > Notifications
- **Data Management**: Export or import tasks, or clear all tasks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Ngam Vitalis - [ngamvitalisyuh@gmail.com](mailto:ngamvitalisyuh@gmail.com) - [+237671360235](tel:+237671360235)

Connect with me:
- GitHub: [https://github.com/Vitalisn4](https://github.com/Vitalisn4)
- LinkedIn: [https://www.linkedin.com/in/ngam-vitalis](https://www.linkedin.com/in/ngam-vitalis)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Icons created with pure CSS
- Animations inspired by various open-source projects
- Color schemes based on modern design principles

