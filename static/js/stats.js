if (window.location.hostname === "piracy.moe") {
    let script = document.createElement('script')
    script.src = "https://stats.piracy.moe/umami.js"
    script.async = true
    script.defer = true
    script.setAttribute("data-website-id", "6e4610bb-d364-413d-a371-2601b31a4c9b")
    document.body.appendChild(script)
} else {
    console.error("You are not viewing the index under the real domain piracy.moe, but", window.location.hostname)
}