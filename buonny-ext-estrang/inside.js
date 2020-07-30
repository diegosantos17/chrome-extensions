var base = document.createElement('tooltip'); //Defining all objects
var tip, text;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Atualizado status estrangulamento...');
    var divTopo = document.getElementsByClassName("enviroment-color");
    showLoader();
        
    if(divTopo != undefined && divTopo.length > 0){                        
        divTopo[0].style.borderColor = 'orange'
        divTopo[0].style.borderWidth = '3px'

        // divTopo[0].onmouseover = function(){console.log('over')};
        // divTopo[0].onmouseout = function(){console.log('out')};

        // Get all users
        var url  = "https://buonny-mock-api-v3.herokuapp.com/telas?url=" + getPageName();
        var xhr  = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onload = function () {
            var telas = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                //console.table(telas.fields);
                
                telas.fields.forEach(formatField);
                setStyleTooltip();    
                document.getElementById('divLoader').style.display = 'none';
                console.log('Status estrangulamento atualizado!');
            } else {
                console.error('Falha ao atualizar status estrangulamento!');
                console.error(telas);
            }
        }
        xhr.send(null);
    }    
})

function getPageName(){
    let url = window.location.toString().split('/');
    return url[url.length - 1];
}

function formatField(element, index, array) {
    //console.log(element.id);
    let field = document.getElementById(element.id);
    field.setAttribute('tooltip', setInfoField(element))
    setClass(field, element.status);    
}

function setClass(field, status){

    switch(status){
        case 'mockado':
            field.style.borderWidth = '2px';
            field.style.borderColor = '#6A5ACD';
            field.style.borderStyle = 'dotted';
            break;
        default:            
            field.style.borderWidth = '2px';
            field.style.borderColor = 'purple';            
            field.style.borderStyle = 'dotted';
            break;
    }
}

function setStyleTooltip(){

    var a = document.getElementsByTagName('*')

    for (var x=0;x < a.length;x++) { // Cria o tooltip
        a[x].onmouseover = function () {
            text = this.getAttribute('tooltip');            
            if (text != null) {// Verifica se existe texto no tooltip
                base.innerHTML = text;                
                if (document.getElementsByTagName('tooltip')[0]){
                    document.getElementsByTagName('tooltip')[0].remove();
                }

                base.style.top = (event.pageY + 25) + 'px';
                base.style.left = (event.pageX) + 'px';

                base.style.position = 'fixed';
                base.style.background = '#fff';
                base.style.color = '#333';
                base.style.borderWidth = '2px';
                base.style.borderStyle = 'solid';
                base.style.borderColor = '#333';     
                base.style.fontSize = '15px';    
                base.style.padding = '15px';

                document.body.appendChild(base);                
            }
        };

        a[x].onmouseout = function () {
            if(document.getElementsByTagName('tooltip').length > 0){
                document.getElementsByTagName('tooltip')[0].remove();// Remove last tooltip
            }
        };        
    }        
}

function setInfoField(field){
    let info = '';
    let templateInfo = `
        <span style='font-weight: bold; font-size: 20px;'>{0}:</span><br>
        <span style='font-weight: bold; padding-left: 20px'>endpoint: </span><span>{1}</span><br>
        <span style='font-weight: bold; padding-left: 20px'>property: </span><span>{2}</span><br>
        `
        
    if(field.request != null && field.request != undefined){
        info += templateInfo.replace('{0}', 'Request').replace('{1}', field.request.endpoint).replace('{2}', field.request.property)
    }

    if(field.response != null && field.response != undefined){
        info += templateInfo.replace('{0}', 'Request').replace('{1}', field.response.endpoint).replace('{2}', field.response.property)
    }
        
    return info;
}

function showLoader(){
    var divLoader = document.getElementById('divLoader');    

    if(divLoader == null){
        divLoader = document.createElement('div'); //Defining all objects    
        divLoader.innerHTML = 'Aguarde, atualizando status';
        divLoader.setAttribute('id', 'divLoader');
        divLoader.style.position = 'absolute'; 
        divLoader.style.top = 0; 
        divLoader.style.bottom = 0; 
        divLoader.style.left = 0; 
        divLoader.style.right = 0; 
        divLoader.style.margin = 'auto';
        divLoader.style.alignContent = 'center';
        divLoader.style.textAlign = 'center';
        divLoader.style.border = '3px solid gray';
        divLoader.style.zIndex = 99999;
        divLoader.style.backgroundColor = '#fff';    
        divLoader.style.width = '300px';
        divLoader.style.height = '10px';
        divLoader.style.padding = '100px';

        document.body.appendChild(divLoader);
    } else {
        divLoader.style.display = 'block';
    }
}