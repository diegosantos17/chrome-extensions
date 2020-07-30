

var tip, text;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Atualizado status estrangulamento...');
    var divTopo = document.getElementsByClassName("enviroment-color");
    showLoader();
        
    if(divTopo != undefined && divTopo.length > 0){                        
        divTopo[0].style.borderColor = 'orange'
        divTopo[0].style.borderWidth = '3px'
        
        // Obtendo elementos da tela
        var url  = "https://buonny-mock-api-v3.herokuapp.com/telas?url=" + getPageName();
        var xhr  = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onload = function () {
            var telas = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {                        
                telas.fields.forEach(formatField);
                setStyleTooltip();    
                setBtnDetail();    
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
    let field = document.getElementById(element.id);
    field.setAttribute('tooltip', setInfoField(element))
    setClass(field, element.status);    
}

function setClass(field, status){

    switch(status){
        case 'mock':            
            field.style.borderWidth = '2px';
            field.style.borderColor = '#6A5ACD';
            field.style.borderStyle = 'dotted';
            break;
        case 'hml':
                field.style.borderWidth = '2px';
                field.style.borderColor = '#0000FF';
                field.style.borderStyle = 'solid';
                break;
        case 'prod':
            field.style.borderWidth = '2px';
            field.style.borderColor = 'green';
            field.style.borderStyle = 'solid';
            break;
        default:            
            field.style.borderWidth = '2px';
            field.style.borderColor = 'purple';            
            field.style.borderStyle = 'dotted';
            break;
    }
}

function setBtnDetail(){

    var a = document.getElementsByTagName('*')

    for (var x=0;x < a.length;x++) { // Cria o tooltip
        console.log('text', text);
        text = a[x].getAttribute('tooltip');            
        if (text != null) {// Verifica se existe texto no tooltip
            var btnDetail = document.createElement('div');
            btnDetail.innerHTML = '+';                                                
            btnDetail.style.top = (a[x].offsetTop + 6) + 'px';
            btnDetail.style.left = (a[x].offsetLeft + 10) + 'px';                

            btnDetail.setAttribute('data-tooltip-id', 'tol-' + a[x].getAttribute('id'))
            btnDetail.style.position = 'fixed';
            btnDetail.style.background = 'green';
            btnDetail.style.color = '#fff';
            btnDetail.style.borderWidth = '1px';
            btnDetail.style.borderStyle = 'solid';
            btnDetail.style.borderColor = '#333';     
            btnDetail.style.borderRadius = '5px';     
            btnDetail.style.fontSize = '10px';
            btnDetail.style.width = '16px';
            btnDetail.style.textAlign = 'center';
            btnDetail.style.cursor = 'pointer';

            document.body.appendChild(btnDetail);                

            btnDetail.onclick = function(){

                let toolTipId = this.getAttribute('data-tooltip-id');
                let toolTip = document.getElementById(toolTipId);

                if(this.innerHTML == '+'){
                    this.innerHTML = '-';                                                
                    this.style.backgroundColor = 'red';
                    toolTip.style.display = 'block';                         
                } else {
                    this.innerHTML = '+';                                                
                    toolTip.style.display = 'none'; 
                    this.style.backgroundColor = 'green';
                }                    
            }
        }        
    }        
}

function setStyleTooltip(){

    var a = document.getElementsByTagName('*')

    for (var x=0;x < a.length;x++) { // Cria o tooltip        

        text = a[x].getAttribute('tooltip');            
        if (text != null) {// Verifica se existe texto no tooltip
            let base = document.createElement('tooltip'); 
            base.innerHTML = text;                
                            
            base.style.top = (a[x].offsetTop + 7) + 'px';
            base.style.left = (a[x].offsetLeft + 28) + 'px';                

            base.setAttribute('id', 'tol-' + a[x].getAttribute('id'));
            base.style.position = 'fixed';
            base.style.background = '#fff';
            base.style.color = '#333';
            base.style.borderWidth = '2px';
            base.style.borderStyle = 'solid';
            base.style.borderColor = '#333';     
            base.style.fontSize = '15px';    
            base.style.padding = '15px';
            base.style.display = 'none';
            base.style.zIndex = 999999;
            document.body.appendChild(base);                
        }        
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
        divLoader = document.createElement('div');
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