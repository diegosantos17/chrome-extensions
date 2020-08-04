chrome.storage.sync.get('user', function (obj) {
        
    if(obj.user !=null && obj.user != undefined){                        
        user = obj.user;
    
        let divFormAuth = document.getElementById('divFormAuth');
        let formLegenda = document.getElementById('formLegenda');

        divFormAuth.style.display = 'none';
        formLegenda.style.display = 'block';

        let spanUser = document.getElementById('spanUser');
        spanUser.textContent = user.nome;            
    }
});                    