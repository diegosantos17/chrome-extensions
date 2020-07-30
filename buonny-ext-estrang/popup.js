function sendHex(hex) {
    chrome.tabs.query({active:true, currentWindow:true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, hex)
    })
}

let p = document.querySelectorAll('p')[1],
    picker = new CP(document.querySelector('input'), false, p)

picker.on("change", function (color) {
    this.source.value = '#' + color
    sendHex('#'+color)

})

picker.fit = function () {
    this.self.style.left = this.self.style.top = ""
}
// Adiciona classe static para color picker
picker.self.classList.add('static')

// Força o color picker a ficar aparecendo
picker.enter()