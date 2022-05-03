chrome.webNavigation.onErrorOccurred.addListener(function(details) 
{
    if (details.frameId != 0) //ignore subframes. 0 is main frame
    { return; }

    chrome.tabs.update(details.tabId, {url: "https://www.google.com"});
});