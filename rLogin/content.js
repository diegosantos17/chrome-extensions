let firebaseConfig = {
    apiKey: "AIzaSyDNfuqHNP65UISxD72yI3ToRZm742jksJ4",
    authDomain: "rlogin-f34ac.firebaseapp.com",
    databaseURL: "https://rlogin-f34ac.firebaseio.com",
    projectId: "rlogin-f34ac",
    storageBucket: "rlogin-f34ac.appspot.com",
    messagingSenderId: "975650615306",
    appId: "1:975650615306:web:619934f41b5ee8da252ff3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let activeView;
function switchView(newView) {
    activeView.hide()
    activeView = $('.'+newView)
    activeView.show()
}

$(document).ready(function () {
    activeView = $('.js-login')
    $('a').click(function (e) {
        e.preventDefault()
        if($(this).attr('switch')){
            switchView($(this).attr('switch'))
        }
    })
    $('.js-register-form').submit(function (e) {
        e.preventDefault()
        let email = $('#r-email').val()
        let password = $('#r-password').val()
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (res) {
                console.log(res)
                if(res.operationType == "signIn"){
                    switchView('js-painel')
                }
            }).catch(function (error) {
                console.log(error)
            })
    })
    $('.js-login-form').submit(function (e) {
        e.preventDefault()
        let email = $('#l-email').val()
        let password = $('#l-password').val()
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (res) {
                console.log(res)
                if(res.operationType == "signIn"){
                    switchView('js-painel')
                }
            }).catch(function (error) {
                console.log(error)
            })
    })
})