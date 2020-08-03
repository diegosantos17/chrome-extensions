var tip, text;
var fieldsSearch = [];
var fieldsSearchSets = false;
var fieldCount = 1;
var urlApi = "https://buonny-mock-api-v3.herokuapp.com";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {    
    console.log('Atualizado status estrangulamento...');
    var divTopo = document.getElementsByClassName("enviroment-color");
    fieldCount = 1;
    console.log('control-group', $('.control-group').length);    
    $('.btnDetailP').remove();
    console.log('cadilam-ext', $('.btnDetailP').length);    
    showLoader(true);        
    insertFormPage();
    insertBtnDetailsFromPage();
    setFormTooltipAction();

    if(divTopo != undefined && divTopo.length > 0){                        
        divTopo[0].style.borderColor = 'orange'
        divTopo[0].style.borderWidth = '3px'
        
        // Obtendo elementos da tela
        var url  = urlApi + "/telas?url=" + getPageName();
        var xhr  = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onload = function () {            
            if(xhr.status == 200){
                var telas = JSON.parse(xhr.responseText);                

                if (xhr.readyState == 4 && xhr.status == "200") {                        
                    telas.fields.forEach(formatField);
                    //setStyleTooltip();
                    //setBtnDetail();                                            
                    setBtnDetailClick(telas._id);

                    tableResultado = document.querySelectorAll('table[' + telas.tables[0].selector + ']');
                    
                    if(tableResultado != null && tableResultado.length > 0){
                        console.log('tableResultado', tableResultado.offsetLeft, tableResultado.offsetTop);

                        let thead = document.createElement('thead');
                        let th = document.createElement('th');
                        th.setAttribute('class', 'teste');
                        th.innerText = fieldCount++;
                        thead.appendChild(th);

                        // insert a new node before the first list item
                        tableResultado[0].insertBefore(thead, tableResultado[0].firstElementChild);
                    }
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
function setFormTooltipAction(){
    $('#formTooltipField').submit(function(event){        

        event.preventDefault();
        var $form = $(this);
        // Let's select and cache all the fields        
        var $inputs = $form.find("input, select, button, textarea");

        // Serialize the data in the form
        var serializedData = $form.serialize();

        console.log('serializedData', serializedData);

        $.ajax({
            url: urlApi + "/fields",
            type: "post",
            data: serializedData,
            success: function(data, textStatus, jqXHR)
            {
                console(data);
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
         
            }
        });

        // $('#redmine_issue_id').val();
        // $('#swagger_prop_req_name').val();
        // $('#swagger_prop_resp_name').val();
        // $('#input-link_resp_swagger').val();


    })
}

function insertBtnDetailsFromPage(){

    let $field;
    let template = `
        <div class="btnDetailP" 
            data-id="{id}" 
            data-name="{name}" 
            data-class="{class}" 
            data-title="{title}" 
            data-label="{label}" 
            data-tooltip-id="{idTooltip}">{value}
        </div>
    `
    $('.control-group').each(function(item){
        $field = $(this).children('input:not([type=hidden])').first();
        console.log('$field', $field);

        if($field.length == 0){                    
            $field = $(this).children('select').first();
        }
        

        if($field.length > 0){
            let labelDescription = '';
            let $labelField = $(this).children('label').first();

            if($labelField != null && $labelField.length > 0)
            {
                labelDescription = $labelField.text();
            }

            let buttonDetail =  template
            .replace('{id}', $field.attr("id"))
            .replace('{name}', $field.attr("name"))
            .replace('{class}', $field.attr("class"))
            .replace('{title}', $field.attr("title"))
            .replace('{label}', labelDescription)            
            .replace('{idTooltip}', 'tol-' + $field.attr("id"))
            .replace('{value}', fieldCount);

            $(this).append(buttonDetail);
            fieldCount++;
        }
    });

    $('.row-fluid').each(function(item){
        $field = $(this).children('input[type=submit]').first();
        
        if($field.length > 0){
            let buttonDetail =  template
            .replace('{id}', $field.attr("id"))
            .replace('{name}', $field.attr("name"))
            .replace('{class}', $field.attr("class"))
            .replace('{title}', $field.attr("title"))
            .replace('{idTooltip}', 'tol-' + $field.attr("id"))
            .replace('{value}', fieldCount);

            $(this).append(buttonDetail);
            fieldCount++;
        }
    });
    
}

function formatField(element, index, array) {    
    var field;

    if(element.htmlAttribute != null && element.htmlAttribute != undefined){        
        let fieldTemp = document.querySelectorAll(element.htmlDomTagName + "[" + element.htmlAttribute + "]");
        if(fieldTemp != null && fieldTemp.length > 0){            
            field = fieldTemp[0];            
            field.setAttribute('custom-tag', element.htmlDomTagName + element.htmlAttributeValue);
            field.setAttribute("id", element.htmlDomTagName + element.htmlAttributeValue);
        }
    }
    if(element.id == "BtnBuscar"){
        let fieldTemp = document.querySelectorAll('[value="Buscar"]');
        if(fieldTemp != null && fieldTemp.length > 0){
            field = fieldTemp[0];            
        }

    } else if(element.id != ''){
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
            field.style.borderWidth = '1px';
            field.style.borderColor = '#6A5ACD';
            field.style.borderStyle = 'dotted';
            field.style.backgroundColor = '#d9babf';
            break;
        case 'hml':
                field.style.borderWidth = '1px';
                field.style.borderColor = '#0000FF';
                field.style.borderStyle = 'solid';
                field.style.backgroundColor = 'lightblue';                
                break;
        case 'prod':
            field.style.borderWidth = '1px';
            field.style.borderColor = 'green';
            field.style.borderStyle = 'solid';
            field.style.backgroundColor = '#a6cda2';            
            break;
        case 'devdone':
            field.style.borderWidth = '1px';
            field.style.borderColor = 'orange';
            field.style.borderStyle = 'solid';
            field.style.backgroundColor = 'lightyellow';            
            break;                
        default:            
            field.style.borderWidth = '1px';
            field.style.borderColor = 'purple';            
            field.style.borderStyle = 'dotted';
            break;
    }
}

function setBtnDetailClick(idTela){
    $('.btnDetailP').click(function(){
        
        $divFormPopUp2 = $('#divFormPopUp2');

        if($divFormPopUp2.hasClass('show-tooltip')){ // oculta
            $(this).removeClass('red');
            $(this).addClass('green');

            $divFormPopUp2.addClass('hidden-tooltip');
            $divFormPopUp2.removeClass('show-tooltip');
        } else { // exibe
            $(this).addClass('red');
            $(this).removeClass ('green');

            $divFormPopUp2.removeClass('hidden-tooltip')
            $divFormPopUp2.addClass('show-tooltip')            
            //$divFormPopUp2.css({top: $(this).offset().top, left: $(this).offset().left + 30});                

            $formTooltipField = $divFormPopUp2.children('form#formTooltipField');
                        
            $formTooltipField.children('input#idTela').val(idTela);
            $formTooltipField.children('input#dom_id').val($(this).attr('data-id'));
            $formTooltipField.children('input#dom_name').val($(this).attr('data-name'));
            $formTooltipField.children('input#dom_title').val($(this).attr('data-title'));
            $formTooltipField.children('input#dom_class').val($(this).attr('data-class'));            
            $formTooltipField.children('input#dom_label').val($(this).attr('data-label'));            
        }        
    });
}
function setBtnDetail(){

    var a = document.getElementsByTagName('*')    
    var request_prop = '';

    for (var x=0;x < a.length;x++) { // Cria o tooltip        
        text = a[x].getAttribute('tooltip');
                
        if (text != null) {// Verifica se existe texto no tooltip
            var btnDetail = document.createElement('div');
            btnDetail.innerHTML = fieldCount;   
            btnDetail.setAttribute("cadilam-ext", "true");

            if(a[x].getAttribute('id') == 'BtnBuscar'){
                a[x].setAttribute('tooltip', setInfoFieldsSearch(a[x]))
                setStyleTooltip(a[x]);
                fieldsSearchSets = true;
            }

            if(fieldsSearchSets == false){
                request_prop = a[x].getAttribute('request_prop');
                
                if(request_prop != null){
                    fieldsSearch[fieldsSearch.length] = { id: fieldCount, name: request_prop}
                }
            }            
                                                
            var idTooltip = a[x].getAttribute('id');            
            
            btnDetail.setAttribute('data-tooltip-id', 'tol-' + idTooltip)            
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
            btnDetail.style.zIndex  = 99999999;
            
            $elementParent = $('#' + a[x].getAttribute('id')).parent();            
            $elementParent.append('<div class="btnDetailP" data-tooltip-id="tol-' + idTooltip + '">' + fieldCount + '</div>');
            fieldCount++;
        }        
    }       
}

function setStyleTooltip(field = null ){

    var a = [];

    if(field != null){        
        a[0] = document.getElementById(field.getAttribute('id'));
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
    let templateInfoRequest = `
        <span style='font-weight: bold; font-size: 12px;'>{0}:</span><br>
        <span style='font-weight: bold; padding-left: 10px'>property: </span><span>{2}</span><br>        
    `

    let templateInfoResponse = `
        <span style='font-weight: bold; font-size: 12px;'>{0}:</span><br>
        <span style='font-weight: bold; padding-left: 10px'>property: </span><span>{2}</span><br>
        <span style='font-weight: bold; padding-left: 10px'>endpoint: </span><span><a href='{1}' target='_blank'>swagger</a></span><br>
    `
    
    if(field.request != null && field.request != undefined){
        info += templateInfoRequest.replace('{0}', 'Request').replace('{1}', field.request.endpoint).replace('{2}', field.request.property)
    }

    if(field.response != null && field.response != undefined){
        info += templateInfoResponse.replace('{0}', 'Response').replace('{1}', field.response.endpoint).replace('{2}', field.response.property)
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

function insertFormPage(){
    var templateFormPage = `
        <div id="divFormPopUp2" class="hidden-tooltip">
            <form id="formTooltipField">                
                <span class="label-ext">Campo:</span> <input type="text" class="form-readonly" id="dom_label" name="dom_label" readonly /><br />
                <input type="hidden" id="idField" name="idField" />
                <input type="hidden" id="idTela" name="idTela" />
                <h6>Estrangulamento Status</h6>
                <select id="status" name="status">
                    <option value="nao-mapeado">Não Mapeado</option>
                    <option value="mockado">Mockado</option>
                    <option value="dev-done">Dev Done</option>
                    <option value="estrangulamento-homologado">Homologado</option>
                    <option value="estrangulamento-em-producao">Em produção</option>
                </select>

                <h6>DOM</h6>                
                <span class="label-ext">id:</span> <input type="text" class="form-readonly" id="dom_id" name="dom_id" readonly/><br />                
                <span class="label-ext">name:</span> <input type="text" class="form-readonly" id="dom_name" name="dom_name" readonly /><br />
                <span class="label-ext">title:</span> <input type="text" class="form-readonly" id="dom_title" name="dom_title" readonly /><br />
                <span class="label-ext">class:</span> <input type="text" class="form-readonly" id="dom_class" name="dom_class" readonly />
            
                <h6>Redmine</h6>
                <span class="label-ext">ID Issue:</span> <input id="redmine_issue_id" name="redmine_issue_id" type="text" value="" />
                <a id="a-link-redmine" href="#">ver no Redmine</a>
                <h6>Swagger (Api V3)</h6>            
                <span class="label-ext">Request:</span>
                <ul>
                    <li>prop_name: <input id="swagger_prop_req_name" name="swagger_prop_req_name" type="text" value="" /></li>
                </ul>
                <span class="label-ext">Response:</span>
                <ul>
                    <li>prop_name: <input id="swagger_prop_resp_name" name="swagger_prop_resp_name" type="text" value="" /></li>
                    <li>Link Swagger: <input id="input-link_resp_swagger" name="input-link_resp_swagger" type="text" value="" /></li>
                    <li>Swagger: <a id="a-link_resp_swagger" href="#">ver aqui</a></li>
                </ul>
                <hr />
                <input type="submit" value="Salvar" />
            </form>
        </div>
    `;    

    $('body').append(templateFormPage);
}