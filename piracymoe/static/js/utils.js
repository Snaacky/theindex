// strip string of any unsafe css chars
const cssSafe = (inputString) => {
    if (inputString) {
        return inputString.replace(/\W/g, '')
    }
    return ""
}

// RegEx matches the input against the IETF standard for URLs
const validateUrl = (value) =>
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
        value
    )

// adds the same function fn for multiple events s to element el
const addListenerMulti = (el, s, fn) => {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

// calculates the needed width of a text using a DOM-Element
const calcTextWidth = (text) => {
    let el = document.querySelector("#text-width-test")
    el.innerHTML = text;

    return Math.ceil(el.clientWidth);
}

// property key to name
const propertyName = (property) => {
    if (columnsReady) {
        try {
            return window.columns["keys"][property]["name"]
        } catch (e) {
            console.error("Property", property, "has no name", e)
        }
    }
    return "???"
}

// property key to description
const propertyDescription = (property) => {
    if (columnsReady) {
        try {
            return window.columns["keys"][property]["description"]
        } catch (e) {
            console.error("Property", property, "has no description", e)
        }
    }
    return "???"
}

const checkOnlineStatus = async (server) => {
    if (!server) {
        server = "https://piracy.moe"
    }
    if (server.slice(server.length - 1) === "/") {
        server = server.slice(0, -1);
    }

    return await fetch("https://ping.piracy.moe/ping", {
        method: 'post',
        body: JSON.stringify({"url": server}),
    }).then(response => {
        if (!response.ok) {
            console.error("Ping-System response is not ok for", server, response)
        }
        return response.text()
    }).then(status => {
        if (status === "online") {
            return true
        } else if (status === "down") {
            return false
        } else if (status === "error") {
            console.warn("Ping-request went somewhere wrong for", server)
            return false
        } else if (status === "cloudflare") {
            return "cloudflare"
        } else {
            // for 500 or above -> server is currently screwed up, so considered down
            console.error("Got error pinging", server, status)
            return false
        }
    }).catch(error => {
        // well for other errors like timeout, ssl or connection error...
        console.error("Unable to complete ping-request of ", server, "due to:", error)
        return false
    })
}

// log to console the async loading status
const loadingLog = () => {
    console.log("tablesGenerated:", tablesGenerated, "dataReady:", dataReady, "columnsReady:", columnsReady, "tablesReady:", tablesReady, "domReady:", domReady)
}