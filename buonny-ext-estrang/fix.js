$(document).ready(function(){
    console.log('jquery load');    

    chrome.storage.sync.get('user', function (obj) {
        if(obj.user !=null && obj.user != undefined){                        
            loadFields(obj.user);
        } else {
            $('.btnDetailP').remove();    
            $("#divFormPopUp2").remove();

            $('.nao-mapeado').removeClass('nao-mapeado');
            $('.mockado').removeClass('mockado');
            $('.estrangulamento-homologado').removeClass('estrangulamento-homologado');
            $('.dev-done').removeClass('dev-done');                
            $('.estrangulamento-em-producao').removeClass('estrangulamento-em-producao');        
        }    
    });
})

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message != null){
        localStorage.setItem("user", JSON.stringify(message))        
    }
});