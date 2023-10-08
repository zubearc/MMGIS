document.getElementsByTagName('title')[0].innerHTML = 'MMGIS API'
const favicons = document.querySelectorAll('link[rel="icon"]')
for (let i = 0; i < favicons.length; i++) { favicons[i].setAttribute('href', 'public/images/logos/logo.png') }
