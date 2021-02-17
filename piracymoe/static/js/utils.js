const cssSafe = (inputString) => {
    return inputString.replace(/\W/g, '')
}

const addListenerMulti = (el, s, fn) => {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

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