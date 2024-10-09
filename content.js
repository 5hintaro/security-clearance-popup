// Flag to display the alert only once
let alertShown = false;

// Variable to store the current job ID
let currentJobId = null;

// Function to detect Security Clearance
function checkForSecurityClearance() {
    try {
        console.log('Checking for security clearance keywords...');
        const bodyText = document.body ? document.body.innerText : '';
        // Specify the target
        const scRegex = /\b(SC\s*Clearance|SC\s*Cleared|Security\s*Clearance|DC\s*Clearance|DC\s*Cleared|)\b/i;
        if (scRegex.test(bodyText)) {
            console.log('Security clearance keyword found.');
            if (!alertShown) {
                // Display the alert
                alert('This job includes a security clearance requirement!');
                alertShown = true; // Display the alert only once
            }
        } else {
            console.log('Security clearance keywords not found.');
            // Do not reset the flag if "SC Clearance" etc. are not found
            // This prevents the alert from being shown again due to dynamic changes in the page
        }
    } catch (error) {
        console.error('Error in checkForSecurityClearance:', error);
    }
}

// Function to identify Indeed job detail pages
function isIndeedJobDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('vjk');
}

// Function to handle page changes
function handlePageChange() {
    const url = window.location.href;
    if (isIndeedJobDetailPage()) {
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('vjk');

        if (jobId !== currentJobId) {
            console.log('New job detail page detected.');
            currentJobId = jobId;
            alertShown = false; // Reset the flag when navigating to a new job page
            checkForSecurityClearance();
        } else {
            console.log('Same job detail page on Indeed. No action taken.');
        }
    } else if (url.includes('/jobs/search/')) {
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('currentJobId');
        
        if (jobId !== currentJobId) {
            console.log('New job detail page detected.');
            currentJobId = jobId;
            alertShown = false; // Reset the flag when navigating to a new job page
            checkForSecurityClearance();
        } else {
            console.log('Same job detail page on LinkedIn. No action taken.');
        }
    } else {
        console.log('Not a job detail page. No action taken.');
    }
}

// Function to initialize MutationObserver
function initializeObserver() {
    // Hook into the History API changes to monitor SPA page transitions
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        handlePageChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        handlePageChange();
    };

    // Monitor popstate events (browser back/forward buttons)
    window.addEventListener('popstate', handlePageChange);

    // Monitor DOM changes
    const observer = new MutationObserver((mutations, obs) => {
        handlePageChange();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Execute functions after the page has finished loading
window.addEventListener('load', () => {
    handlePageChange();
    initializeObserver();
});
