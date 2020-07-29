function updateTime() {
    let date = new Date()
    document.getElementById('js-clock').innerHTML = date.toLocaleTimeString()

}
updateTime()
setInterval(()=>{
    updateTime()
}, 1000)