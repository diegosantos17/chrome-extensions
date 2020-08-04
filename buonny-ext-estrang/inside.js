var tip, text;
var fieldsSearch = [];
var fieldsSearchSets = false;
var fieldCount = 1;
var urlApi = "https://buonny-mock-api-v3.herokuapp.com";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {                
    
    chrome.storage.sync.get('user', function (obj) {
        if(obj.user !=null && obj.user != undefined){                        
            localStorage.setItem('user', JSON.stringify('obj.user'));
            loadFields(obj.user);
        } else {
            localStorage.removeItem('user');
            $('.btnDetailP').remove();    
            $("#divFormPopUp2").remove();

            $('.nao-mapeado').removeClass('nao-mapeado');
            $('.mockado').removeClass('mockado');
            $('.estrangulamento-homologado').removeClass('estrangulamento-homologado');
            $('.dev-done').removeClass('dev-done');                
            $('.estrangulamento-em-producao').removeClass('estrangulamento-em-producao');        
        }    
    });    
        
    // var divTopo = document.getElementsByClassName("enviroment-color");            
    // if(divTopo != undefined && divTopo.length > 0){                            
            
    // }
})

function loadFields(user) {
    insertFormPage(user);
    $('.btnDetailP').remove();
    fieldCount = 1;
    console.log('Atualizado status estrangulamento...');
    showLoader(true);

    var url  = urlApi + "/telas?url=" + getPageName();
    var xhr  = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {            
        if(xhr.status == 200){
            var telas = JSON.parse(xhr.responseText);                

            if (xhr.readyState == 4 && xhr.status == "200") {                        
                telas.fields.forEach(formatField);
                insertBtnDetailsFromPage();
                setFormTooltipAction();
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
};


function reloadPage(){
    showLoader(true);
    showLoader(false);
}

function setFormTooltipAction(){
    $('#formTooltipField').unbind('submit');
    $('#formTooltipField').submit(function(event){        

        event.preventDefault();
        var $form = $(this);

        $idField = $form.children('#idField');
        $idTela = $form.children('#idTela');
        $status = $form.children('#status');
        $dom_id = $form.children('#dom_id');
        $dom_name = $form.children('#dom_name');
        $dom_title = $form.children('#dom_title');
        $dom_class = $form.children('#dom_class');
        $redmine_issue_id = $form.children('#redmine_issue_id');
        $swagger_prop_req_name = $('#swagger_prop_req_name');
        $swagger_prop_resp_name = $('#swagger_prop_resp_name');
        $input_link_resp_swagger = $('#input_link_resp_swagger');                

        $data = {
            'idField': $idField.val(),                              
            'status': $status.val(),
            'dom_id': $dom_id.val(),
            'dom_name': $dom_name.val(),
            'dom_title': $dom_title.val(),
            'dom_class': $dom_class.val(),
            'dom_tag': $('#' + $dom_id.val()).prop('tagName'),
            'redmine_issue_id': $redmine_issue_id.val(),
            'swagger_prop_req_name': $swagger_prop_req_name.val(),
            'swagger_prop_resp_name': $swagger_prop_resp_name.val(),
            'input_link_resp_swagger': $input_link_resp_swagger.val()
        }

        $(window).scrollTop(0);

        if($idField.val() == '' || $idField.val() == 'undefined'){
            $.post(
                urlApi + "/telas/" + $idTela.val() + "/fields", 
                $data
            )
            .done(function(field){
                $('#idField').val(field._id);
                loadFields(getUser());
                alert("Campo criado com sucesso");                
            });
        } else {            
            $.ajax({
                type: 'PUT',
                url: urlApi + "/fields/" + $idField.val(),
                contentType: 'application/json',
                data: JSON.stringify($data), // access in body
            }).done(function () {
                console.log('SUCCESS');
                loadFields(getUser());
                alert("Campo alterado com sucesso");                
            }).fail(function (msg) {
                console.log('FAIL');
            }).always(function (msg) {
                console.log('ALWAYS');
            });            
        }                
    })
}

function insertBtnDetailsFromPage(){

    let $field;
    let template = `
        <div class="btnDetailP" 
            data-id="{data-id}" 
            data-dom-id="{dom-id}" 
            data-name="{name}" 
            data-class="{class}" 
            data-title="{title}" 
            data-label="{label}" 
            data-redmine_issue_id="{data-redmine_issue_id}"            
            data-swagger_prop_req_name="{data-swagger_prop_req_name}" 
            data-swagger_prop_resp_name="{data-swagger_prop_resp_name}" 
            data-input_link_resp_swagger="{data-input_link_resp_swagger}"
            data-status="{data-status}"
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
            .replace('{dom-id}', $field.attr("id"))
            .replace('{data-id}', $field.attr("data-id"))                        
            .replace('{name}', $field.attr("name"))
            .replace('{class}', $field.attr("class"))
            .replace('{title}', $field.attr("title"))
            .replace('{label}', labelDescription)            
            .replace('{idTooltip}', 'tol-' + $field.attr("id"))
            .replace('{value}', fieldCount)
            .replace('{data-redmine_issue_id}', $field.attr("data-redmine_issue_id"))
            .replace('{data-swagger_prop_req_name}', $field.attr("data-swagger_prop_req_name"))                        
            .replace('{data-swagger_prop_resp_name}', $field.attr("data-swagger_prop_resp_name"))            
            .replace('{data-input_link_resp_swagger}', $field.attr("data-input_link_resp_swagger"))            
            .replace('{data-status}', $field.attr("data-status"))
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
        
    var $field;
    
    if(element.dom_id != null && element.dom_id != undefined){
        $field = $('#' + element.dom_id);
    }

    if(
        ($field == null || $field == undefined)
        && element.dom_title != null 
        && element.dom_title != undefined
        && element.dom_tag != null 
        && element.dom_tag != undefined
    ){
        $field = $('"' + element.dom_tag + '[title=' + element.dom_tag + ']"');
    }    
    if($field != null && $field != undefined){        
        $field.removeClass('nao-mapeado')
        .removeClass('mockado')
        .removeClass('estrangulamento-homologado')
        .removeClass('dev-done')
        .removeClass('estrangulamento-em-producao');        

        $field.addClass(element.status);
        $field.attr("data-id", element._id);        
        $field.attr("data-redmine_issue_id", element.redmine_issue_id);
        $field.attr("data-status", element.status);
        $field.attr("data-swagger_prop_req_name", element.request.property);
        $field.attr("data-swagger_prop_resp_name", element.response.property);
        $field.attr("data-input_link_resp_swagger", element.response.endpoint);                
    }    

    // if(element.htmlAttribute != null && element.htmlAttribute != undefined){        
    //     let fieldTemp = document.querySelectorAll(element.htmlDomTagName + "[" + element.htmlAttribute + "]");
    //     if(fieldTemp != null && fieldTemp.length > 0){            
    //         field = fieldTemp[0];            
    //         field.setAttribute('custom-tag', element.htmlDomTagName + element.htmlAttributeValue);
    //         field.setAttribute("id", element.htmlDomTagName + element.htmlAttributeValue);
    //     }
    // }
    // if(element.id == "BtnBuscar"){
    //     let fieldTemp = document.querySelectorAll('[value="Buscar"]');
    //     if(fieldTemp != null && fieldTemp.length > 0){
    //         field = fieldTemp[0];            
    //     }

    // } else if(element.id != ''){
    //     field = document.getElementById(element.id);
    // }
    
    // if(field != null && field != undefined){

    //     if(element.id != "BtnBuscar"){
    //         field.setAttribute('tooltip', setInfoField(element))
    //     } else {
    //         field.setAttribute('id','BtnBuscar')
    //         field.setAttribute('endpoint', element.request.endpoint)            
    //         field.setAttribute('tooltip', '')
    //     }

    //     if(element.request != null){
    //         field.setAttribute('request_prop', element.request.property);
    //     }
    //     setClass(field, element.status);
    // }
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

            $formTooltipField = $divFormPopUp2.children('form#formTooltipField');            
            
            $formTooltipField.children('input#idTela').val(idTela);
            $formTooltipField.children('input#idField').val($(this).attr('data-id'));
            $formTooltipField.children('input#dom_id').val($(this).attr('data-dom-id'));
            $formTooltipField.children('input#dom_name').val($(this).attr('data-name'));
            $formTooltipField.children('input#dom_title').val($(this).attr('data-title'));
            $formTooltipField.children('input#dom_class').val($(this).attr('data-class'));            
            $formTooltipField.children('input#dom_label').val($(this).attr('data-label'));

            $('input#redmine_issue_id').val($(this).attr('data-redmine_issue_id'));
            $('input#swagger_prop_req_name').val($(this).attr('data-swagger_prop_req_name'));
            $('select#status').val($(this).attr('data-status'));
            $('input#swagger_prop_resp_name').val($(this).attr('data-swagger_prop_resp_name'));
            $('input#input_link_resp_swagger').val($(this).attr('data-input_link_resp_swagger'));
            
            
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

function insertFormPage(user){

    $("#divFormPopUp2").remove();    
    
    var readonly = (user.admin == true) ? ''  : 'readonly';
    var disabled = (user.admin == true) ? ''  : 'disabled';
    var display = (user.admin == true) ? '' : 'style="display:none"';

    console.log('user', user);
    console.log('user 2', user.admin);

    var templateFormPage = `
        <div id="divFormPopUp2" class="hidden-tooltip">
            <form id="formTooltipField">                
                <span class="label-ext">Campo:</span> <input type="text" class="form-readonly" id="dom_label" name="dom_label" readonly /><br />
                <input type="hidden" id="idField" name="idField" />
                <input type="hidden" id="idTela" name="idTela" />
                <h6>Estrangulamento Status</h6>
                <select id="status" name="status" {disabled}>
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
                <span class="label-ext">ID Issue:</span> <input id="redmine_issue_id" name="redmine_issue_id" type="text" value="" {readonly} />
                <a id="a-link-redmine" href="#">ver no Redmine</a>
                <h6>Swagger (Api V3)</h6>            
                <span class="label-ext">Request:</span>
                <ul>
                    <li>prop_name: <input id="swagger_prop_req_name" name="swagger_prop_req_name" type="text" value="" {readonly} /></li>
                </ul>
                <span class="label-ext">Response:</span>
                <ul>
                    <li>prop_name: <input id="swagger_prop_resp_name" name="swagger_prop_resp_name" type="text" value="" {readonly} /></li>
                    <li>Link Swagger: <input id="input_link_resp_swagger" name="input_link_resp_swagger" type="text" value="" {readonly} /></li>
                    <li>Swagger: <a id="a-link_resp_swagger" href="#">ver aqui</a></li>
                </ul>
                <hr />
                <input type="submit" value="Salvar" {display} />
            </form>
        </div>
    `;    
        
    $('body').append(templateFormPage.replace(/{disabled}/g, disabled).replace(/{display}/g, display).replace(/{readonly}/g, readonly));
}

function getUser() {
    var user = JSON.parse(localStorage.getItem("user"));
    return user;
}