window.onload = function() {              
    console.log('clicou')      
}

function logSubmit(event) {    
    event.preventDefault();
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;    

    var url  =  'https://buonny-mock-api-v3.herokuapp.com/auth';
    var xhr  = new XMLHttpRequest()
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ "email": email, "password":  senha }));
    xhr.onload = function () {                    
        if(xhr.status == 200){
            var user = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {                                            

                chrome.storage.sync.set({"user": user}, function() {                    
                    //alert(user)
                });

                let divFormAuth = document.getElementById('divFormAuth');
                let formLegenda = document.getElementById('formLegenda');
                divFormAuth.style.display = 'none';
                formLegenda.style.display = 'block';

                let spanUser = document.getElementById('spanUser');
                spanUser.textContent = user.nome;

                sendHex(chrome.storage)
            } else {
                alert("Email e/ou senha inválidos");
            }
        } 
    }        
}

function logout(event) {    
    event.preventDefault();    
    chrome.storage.sync.set({"user": null}, function() {                    
        let divFormAuth = document.getElementById('divFormAuth');
        let formLegenda = document.getElementById('formLegenda');
        divFormAuth.style.display = 'block';
        formLegenda.style.display = 'none';
        localStorage.removeItem("user")
        sendHex(null);
    });
    
}

function sendHex(hex) {
    chrome.tabs.query({active:true, currentWindow:true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, hex)
    })
}

const form = document.getElementById('formAuth');
form.addEventListener('submit', logSubmit);

const formLogout = document.getElementById('formLogout');
formLogout.addEventListener('submit', logout);