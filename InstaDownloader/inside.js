let clickedElement = null;

document.addEventListener("mousedown", function (event) {
    if(event.button == 2){
        clickedElement = event.target;
    }
}, true)


chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if(clickedElement.previousSibling.firstChild.parentElement){
        let finalElement = clickedElement.previousSibling.firstChild.parentElement
        let url = finalElement.getElementsByTagName('img')[0].getAttribute('src')
        sendResponse(url)
    }
})