chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    for(let i = 0; i < document.getElementsByTagName('div').length; i++){
        if(document.getElementsByTagName("div")[i].getAttribute('aria-label')
            && document.getElementsByTagName("div")[i].getAttribute('aria-label') == "Facebook"){
            if(document.getElementsByTagName("div")[i].getAttribute('role')
            && document.getElementsByTagName("div")[i].getAttribute('role') == "banner"){
                document.getElementsByTagName("div")[i].style.background = message
            }else if(document.getElementsByTagName("div")[i].getAttribute('role')
                && document.getElementsByTagName("div")[i].getAttribute('role') == "search"){
                document.getElementsByTagName("div")[i].style.borderColor = message
            }
        }
    }
})