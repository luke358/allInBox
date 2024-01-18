// // window.addEventListener('DOMContentLoaded', () => {
// //   console.log('domloaded')

// // })

// ferdium.log('testing')
// function getMessages() {
//   let directCount = 0
//   const directCountPerServer = document.querySelectorAll(
//     '[class*="lowerBadge_"] [class*="numberBadge_"]',
//   )

//   for (const directCountBadge of directCountPerServer)
//     directCount += Number.parseInt(directCountBadge.textContent)

//   const indirectCountPerServer
//     = document.title.search('• Discord') === -1 ? 0 : 1

//   // console.log(directCount);
//   // window.api.log(directCount, 'directCount')
//   // window.api.log(document.querySelectorAll(
//   //   '[class*="lowerBadge_"] [class*="numberBadge_"]',
//   // ))
//   // window.api.log(document.title)
//   // console.log(Ferdium)
// }
// // setInterval(getMessages, 1000)
// console.log(document.querySelectorAll('input'))
// console.log('ccc')
// getMessages()
// console.log(document)
const { ipcRenderer } = require('electron')
console.log('tttt')
document.addEventListener('DOMContentLoaded', function () {
  var data = {
    'title': document.title,
    'url': window.location.href,
    'array': {
        'array': ['1','2','3']
    }
  };
  console.log(data, 'dddd')
  ipcRenderer.sendToHost('data', data);
});
