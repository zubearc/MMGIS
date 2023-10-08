async function main () {
  const componentHtml = await fetch('components/main.html').then(response => response.text())
  const demo = document.createElement('div')
  demo.innerHTML = componentHtml
  document.body.innerHTML += componentHtml

  document.querySelector('.LoadingPage').style.display = 'none'
}

main()
console.log('hello world!')
