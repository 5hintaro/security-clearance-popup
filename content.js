// Flag to display the alert only once
let alertShown = false;
let previousUrl = window.location.href;

// Function to detect Security Clearance
function checkForSecurityClearance() {
    try {
        console.log('Checking for security clearance keywords...');
        const bodyText = document.body ? document.body.innerText : '';
        // Specify the target
        const scRegex = /\b(SC\s*Clearance|SC\s*Cleared|Security\s*Clearance|DC\s*Clearance|DC\s*Cleared)\b/i;
        const matches = bodyText.match(scRegex);

        if (matches) {
            console.log('Security clearance keyword found:', matches[0]);
            if (!alertShown) {
                // Display the alert only if it hasn't been shown before
                alert('This job includes a security clearance requirement!');
                alertShown = true; // Set the flag to true to avoid showing the alert again
            }
        } else {
            // If no match, log this instead of showing an alert
            console.log('No security clearance keywords found. No alert will be shown.');
        }
    } catch (error) {
        console.error('Error in checkForSecurityClearance:', error);
    }
}

// Function to handle page changes
function handlePageChange() {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);

    // Reset alert only if the URL has actually changed
    if (currentUrl !== previousUrl) {
        previousUrl = currentUrl; // Update the previous URL to the current one
        alertShown = false; // Reset the flag when navigating to a new page

        // Check for Indeed job detail parameters in the URL
        if (urlParams.get('vjk')) {
            // Use a delay to ensure that content is fully loaded before checking
            setTimeout(checkForSecurityClearance, 3000); // Delay for 3 seconds
        } else {
            console.log('Not a job detail page. No action taken.');
        }
    } else {
        console.log('Same page detected. No action taken.');
    }
}


// Function to initialize MutationObserver and history change detection
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

    // Monitor DOM changes with a limit to avoid excessive calls
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
