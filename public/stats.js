if (typeof window !== 'undefined') {
  if (window.location.hostname === 'theindex.moe') {
    let script = document.createElement('script')
    script.src = 'https://stats.theindex.moe/imamu.js'
    script.async = true
    script.defer = true
    script.setAttribute(
      'data-website-id',
      '9a122690-3f95-4e79-b289-72cc0885a619'
    )

    console.log('Appending stats script')
    document.body.appendChild(script)
  } else {
    console.warn(
      'You are not viewing the index under the real domain theindex.moe, but',
      window.location.hostname
    )
  }
}
