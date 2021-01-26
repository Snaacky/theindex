if (window.location.hostname === "piracy.moe") {
    document.querySelector("body")
        .innerHTML += '<script async defer data-website-id="6e4610bb-d364-413d-a371-2601b31a4c9b" ' +
        'src="https://stats.piracy.moe/umami.js"></script>'
} else {
    console.error("You are not viewing the index under the real domain piracy.moe, but", window.location.hostname)
}