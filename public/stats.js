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

    let script2 = document.createElement('script')
    script2.async = true
    script2.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3776361007456826'
    script2.crossorigin = 'anonymous'
    console.log('Appending adsense script')
    document.body.appendChild(script2)
  } else {
    console.warn(
      'You are not viewing the index under the real domain theindex.moe, but',
      window.location.hostname
    )
  }
}
