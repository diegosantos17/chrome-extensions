
//https://instagram.fpoa7-2.fna.fbcdn.net/vp/96eb05d6fc8e6728bc3e065d4bec147f/
// 5E206943/t51.2885-15/e35/58895263_2867589866799941_1745319594301342531_n.jpg?_nc_ht=instagram.fpoa7-2.fna.fbcdn.net&_nc_cat=105
executeImageDownload = (info, tab)=>{
    chrome.tabs.sendMessage(tab.id, "downloadClickedElement", function(url) {
        let fileName = url.substring(0, url.indexOf('?')).substring(url.lastIndexOf('/')+1);
        chrome.downloads.download({
            url: url,
            filename: fileName
        })
    })
}
chrome.contextMenus.create({
    title: "Salvar imagem como..",
    contexts: ["page"],
    onclick: executeImageDownload
})