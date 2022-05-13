if (typeof window !== 'undefined') {
  if (window.location.hostname === 'theindex.moe') {
    let script = document.createElement('script')
    script.src = 'https://stats.piracy.moe/imamu.js'
    script.async = true
    script.defer = true
    script.setAttribute(
      'data-website-id',
      '7c408638-1374-450e-a803-a08a7c3f03af'
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
