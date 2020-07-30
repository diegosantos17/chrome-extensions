var tip, text;
var fieldsSearch = [];
var fieldsSearchSets = false;

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

            console.log('xhr', xhr)

            if(xhr.status == 200){
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
            } else {
                showLoader(false);
            }
        }
        xhr.send(null);
    }    
})

function formatField(element, index, array) {    
    var field;

    if(element.id == "BtnBuscar"){
        let fieldTemp = document.querySelectorAll('[value="Buscar"]');
        if(fieldTemp != null && fieldTemp.length > 0){
            field = fieldTemp[0];            
        }

    } else {
        field = document.getElementById(element.id);
    }
    
    if(field != null && field != undefined){

        if(element.id != "BtnBuscar"){
            field.setAttribute('tooltip', setInfoField(element))
        } else {
            field.setAttribute('id','BtnBuscar')
            field.setAttribute('endpoint', element.request.endpoint)            
            field.setAttribute('tooltip', '')
        }



        if(element.request != null){
            field.setAttribute('request_prop', element.request.property);
        }
        setClass(field, element.status);    
    }
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
    var fieldCount = 1;
    var request_prop = '';

    for (var x=0;x < a.length;x++) { // Cria o tooltip        
        text = a[x].getAttribute('tooltip');
        
        if (text != null) {// Verifica se existe texto no tooltip
            var btnDetail = document.createElement('div');
            btnDetail.innerHTML = fieldCount;   
            
            if(a[x].getAttribute('id') == 'BtnBuscar'){
                a[x].setAttribute('tooltip', setInfoFieldsSearch(a[x]))
                setStyleTooltip(a[x]);
                fieldsSearchSets = true;
            }

            if(fieldsSearchSets == false){
                request_prop = a[x].getAttribute('request_prop');

                console.log('request_prop', request_prop);

                if(request_prop != null){
                    fieldsSearch[fieldsSearch.length] = { id: fieldCount, name: request_prop}
                }
            }

            fieldCount++;
            
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

                if(this.style.backgroundColor == 'green'){
                    //this.innerHTML = '-';                                                
                    this.style.backgroundColor = 'red';
                    toolTip.style.display = 'block';                         
                } else {
                    //this.innerHTML = '+';                                                
                    toolTip.style.display = 'none'; 
                    this.style.backgroundColor = 'green';
                }                    
            }
        }        
    }   
    var btnBuscar = document.querySelectorAll('[value="Buscar"]');

    if(btnBuscar != null && btnBuscar != undefined){

    }
}

function setStyleTooltip(field = null ){

    var a = [];

    if(field != null){
        a[0] = document.getElementById(field.getAttribute('id'));

        console.log('aaaa', a[0]);
    } else {
       a = document.getElementsByTagName('*');
    }

    for (var x=0;x < a.length;x++) { // Cria o tooltip        

        text = a[x].getAttribute('tooltip');            

        if (text != null && text != '') {// Verifica se existe texto no tooltip
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
            base.style.fontSize = '10px';    
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
        <span style='font-weight: bold; font-size: 12px;'>{0}:</span><br>
        <span style='font-weight: bold; padding-left: 10px'>endpoint: </span><span><a href='{1}' target='_blank'>swagger</a></span><br>        
        `

        // <span style='font-weight: bold; padding-left: 10px'>property: </span><span>{2}</span><br></br>
        
    // if(field.request != null && field.request != undefined){
    //     info += templateInfo.replace('{0}', 'Request').replace('{1}', field.request.endpoint).replace('{2}', field.request.property)
    // }

    if(field.response != null && field.response != undefined){
        info += templateInfo.replace('{0}', 'Response').replace('{1}', field.response.endpoint).replace('{2}', field.response.property)
    }
        
    return info;
}

function setInfoFieldsSearch(field){
    let info = '';
    let templateInfo = `
        <span style='font-weight: bold; font-size: 12px;'>Request:</span><br>
        <span style='font-weight: bold; padding-left: 10px'>endpoint: </span><span><a href='{0}' target='_blank'>swagger</a></span><br>
        <span style='font-weight: bold; padding-left: 10px'>payload: </span><br>{1}
    `        

    let fieldsPayload = '';    

    fieldsSearch.forEach(function (item, indice, array) {
        console.log(item, indice);
        fieldsPayload += '<span style="padding-left: 20px">' + item.id + ': ' + item.name + '</span><br>';        
    });    

    info = templateInfo.replace('{0}', field.getAttribute('endpoint')).replace('{1}', fieldsPayload)        
        
    return info;
}



function showLoader(show = true){
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
        if(show == true){
            divLoader.style.display = 'block';
        } else {
            divLoader.style.display = 'none';
        }
    }
}

function getPageName(){
    let url = window.location.toString().split('portal/');
    let urlFinal = url[1].split('?')[0];
    return urlFinal;
}