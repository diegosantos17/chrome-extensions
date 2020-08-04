$(document).ready(function(){
    console.log('jquery load');    
})

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message != null){
        localStorage.setItem("user", JSON.stringify(message))        
    }
});