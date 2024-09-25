document.getElementById('fetchProfiles').addEventListener('click', async () => {
    const urls = document.getElementById('linkedinUrls').value.split('\n').filter(url => url.trim());
    if (urls.length < 3) {
        document.getElementById('status').innerText = 'Please enter at least 3 LinkedIn URLs.';
        return;
    }

    for (const url of urls) {
        const trimmedUrl = url.trim();

        console.log("Opening profile:", trimmedUrl);
        chrome.runtime.sendMessage({ action: 'openProfile', url: trimmedUrl });

        await new Promise(resolve => setTimeout(resolve, 5000)); 

        const currentTab = await getCurrentTab();

        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: extractLinkedInData
        }, async (result) => {
            if (result && result[0].result) {
                const profileData = result[0].result;
                await postProfileData(profileData);
            }
        });
    }

    document.getElementById('status').innerText = 'All profiles opened.';

});

function extractLinkedInData() {
    const name = document.querySelector('.pv-top-card--list li')?.innerText || '';
    const location = document.querySelector('.pv-top-card--list-bullet li')?.innerText || '';
    const connectionCount = document.querySelector('.pv-top-card--list.pv-top-card--list-bullet span')?.innerText || '0';

    return {
        name,
        location,
        connection_count: parseInt(connectionCount.replace(/\D/g, '')) || 0
    };
}

async function postProfileData(profileData) {
    try {
        const response = await fetch('http://localhost:3000/profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        console.log(response);
        
        if (!response.ok) {
            console.error('Failed to post profile data');
        }
    } catch (error) {
        console.error('Error posting profile data:', error);
    }
}

async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
