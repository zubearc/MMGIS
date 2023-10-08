// Form nav
const pages = ['README']
const configure = []
const layers = []
const tools = []
const apis = [
  { name: 'Main', path: '../api/docs/main' },
  { name: 'Spatial', path: '../api/docs/spatial/' }
]

pages.forEach((v) => {
  const node = document.createElement('li')
  node.setAttribute('id', v)
  node.setAttribute('class', 'page')
  node.addEventListener(
    'click',
    (function (page) {
      return function () {
        const pageElms = document.getElementsByClassName('page')
        for (let i = 0; i < pageElms.length; i++) {
          pageElms[i].setAttribute('class', 'page')
        }
        document.getElementById(page).setAttribute('class', 'page active')
        setPage(page)
      }
    })(v)
  )

  let text = v.replace(/_/g, ' ')
  if (text == 'README') text = 'Home'
  const textnode = document.createTextNode(text)
  node.appendChild(textnode)
  document.getElementById('nav').appendChild(node)
})

configure.forEach((v) => {
  const node = document.createElement('li')
  node.setAttribute('id', v)
  node.setAttribute('class', 'page')
  node.addEventListener(
    'click',
    (function (page) {
      return function () {
        const pageElms = document.getElementsByClassName('page')
        for (let i = 0; i < pageElms.length; i++) {
          pageElms[i].setAttribute('class', 'page')
        }
        document.getElementById(page).setAttribute('class', 'page active')
        setPage(page)
      }
    })(v)
  )

  let text = v.replace(/_/g, ' ')
  if (text == 'README') text = 'Home'
  const textnode = document.createTextNode(text)
  node.appendChild(textnode)
  document.getElementById('navconfigure').appendChild(node)
})

layers.forEach((v) => {
  const node = document.createElement('li')
  node.setAttribute('id', v)
  node.setAttribute('class', 'page')
  node.addEventListener(
    'click',
    (function (page) {
      return function () {
        const pageElms = document.getElementsByClassName('page')
        for (let i = 0; i < pageElms.length; i++) {
          pageElms[i].setAttribute('class', 'page')
        }
        document.getElementById(page).setAttribute('class', 'page active')
        setPage(page)
      }
    })(v)
  )

  let text = v.replace(/_/g, ' ')
  if (text == 'README') text = 'Home'
  const textnode = document.createTextNode(text)
  node.appendChild(textnode)
  document.getElementById('navlayers').appendChild(node)
})

tools.forEach((v) => {
  const node = document.createElement('li')
  node.setAttribute('id', v)
  node.setAttribute('class', 'page')
  node.addEventListener(
    'click',
    (function (page) {
      return function () {
        const pageElms = document.getElementsByClassName('page')
        for (let i = 0; i < pageElms.length; i++) {
          pageElms[i].setAttribute('class', 'page')
        }
        document.getElementById(page).setAttribute('class', 'page active')
        setPage(page)
      }
    })(v)
  )

  let text = v.replace(/_/g, ' ')
  if (text == 'README') text = 'Home'
  const textnode = document.createTextNode(text)
  node.appendChild(textnode)
  document.getElementById('navtools').appendChild(node)
})

apis.forEach((v) => {
  const node = document.createElement('li')
  node.setAttribute('id', v.name)
  node.addEventListener(
    'click',
    (function (api) {
      return function () {
        window.location.href = api.path
      }
    })(v)
  )

  const text = v.name.replace(/_/g, ' ')
  const textnode = document.createTextNode(text)
  node.appendChild(textnode)
  document.getElementById('navapi').appendChild(node)
})

function setPage (page) {
  const xhr = new XMLHttpRequest()
  xhr.addEventListener('load', function () {
    const url = window.location.href.split('?')[0] + '?page=' + page
    window.history.replaceState('', '', url)

    const options = {
      highlight: (code) => hljs.highlightAuto(code).value
    }
    document.getElementById('markdown').innerHTML = marked(
      this.responseText,
      options
    )
  })
  let path = '../documentation/pages/markdowns/' + page + '.md'
  if (page == 'README') path = '../README.md'
  xhr.open('GET', path)
  xhr.send()
}

function getSingleQueryVariable (variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] == variable) {
      return decodeURIComponent(pair[1])
    }
  }

  return false
}

document.getElementById('tbtitle').addEventListener('click', function () {
  window.location.href = '/'
})

setTimeout(function () {
  const page = getSingleQueryVariable('page') || 'README'

  const pageElm = document.getElementById(page)

  if (pageElm) pageElm.dispatchEvent(new CustomEvent('click'))
}, 100)
