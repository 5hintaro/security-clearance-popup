// Function to check the current tab's content
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabs[0].id },
            function: checkForSCInPopup
        },
        (results) => {
            if (results && results[0].result) {
                const message = 'This job includes "SC Clearance"!'
                document.getElementById('message').textContent = message;
            }
        }
    );
});

// Function to execute within the popup context
function checkForSCInPopup() {
    const bodyText = document.body.innerText;
    return /\bSC\s*Clearance\b/i.test(bodyText);
}
