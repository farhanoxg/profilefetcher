chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openProfile') {
        if (request.url.startsWith('https://www.linkedin.com/')) {
            chrome.tabs.create({ url: request.url, active: false });
        } else {
            console.error('Invalid LinkedIn URL:', request.url);
        }
    }
});
