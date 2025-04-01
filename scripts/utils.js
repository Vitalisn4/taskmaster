// Utility Functions

const Utils = (() => {
    // Generate a unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Format date to locale string
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    // Calculate days between two dates
    function daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        
        // Set to midnight to ignore time
        firstDate.setHours(0, 0, 0, 0);
        secondDate.setHours(0, 0, 0, 0);
        
        return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    }
    
    // Check if a date is today
    function isToday(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    // Check if a date is within the next n days
    function isWithinDays(dateString, days) {
        const date = new Date(dateString);
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        
        return date >= today && date <= futureDate;
    }
    
    // Check if a date is in the past
    function isPast(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        
        // Set to midnight to ignore time
        date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        return date < today;
    }
    
    // Debounce function to limit how often a function can be called
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function to limit how often a function can be called
    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Capitalize first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Truncate text with ellipsis
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
    
    // Get browser preferred color scheme
    function getPreferredColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    // Download data as a file
    function downloadAsFile(data, filename, type = 'application/json') {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Public API
    return {
        generateId,
        formatDate,
        daysBetween,
        isToday,
        isWithinDays,
        isPast,
        debounce,
        throttle,
        capitalizeFirstLetter,
        truncateText,
        getPreferredColorScheme,
        downloadAsFile
    };
})();
