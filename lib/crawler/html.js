import {JSDOM} from "jsdom"
import {fetchSite} from "./browser"

export default async function gatherPageData(url, itemId = null) {
    const {
        status,
        screenshotStream,
        content
    } = await fetchSite(url, itemId)

    if (status === 200) {
        const {
            title,
            description,
            links,
            body
        } = cleanHtmlString(content)
        return {
            status,
            title,
            description,
            screenshotStream,
            links: filterLinks(links, new URL(url)),
            body
        }
    }
    return {
        status,
        screenshotStream
    }
}

function filterLinks(links, domain) {
    return links.map(l => {
        let u

        // is link a relative url?
        if (l[0] === "/" || l[0] === "?") {
            u = new URL(l, domain.protocol + "//" + domain.hostname)
        } else {
            try {
                u = new URL(l)

                // absolute domains must have the same hostname
                if (u.hostname !== domain.hostname) {
                    return false
                }
            } catch (e) {
                return false
            }
        }

        // only accept http(s) protocol
        if (u.protocol === "http:" || u.protocol === "https:") {
            return u.href
        }
        return false
    })
        .filter(l => l)
        // remove duplicate entries
        .filter((v, i, a) => a.indexOf(v) === i)
}

function cleanHtmlString(htmlString) {
    // remove styles and script tags and while at it, get via jsdom, some meta tags and all a tags
    const {title, description, links, body} = stripScriptStyle(htmlString)

    return {
        title,
        description,
        links,
        body: body
            // reduce multiple whitespaces, tabs and newlines to one whitespace
            .replace(/\s+/g, " ")
            // convert every tag including their attributes to a placeholder
            .replace(/(<([^>]+)>)/ig, "<[caps]>")
            // and make it an array of text between tags
            .split("<[caps]>")
            // we are not interested in empty strings
            .filter(x => x !== "" && x !== " ")
            // remove leading/trailing whitespace
            .map(x => {
                if (x[0] === " ") {
                    x = x.slice(1, x.length)
                }
                if (x[x.length - 1] === " ") {
                    x = x.slice(0, x.length - 1)
                }
                return x
            })
            .join(" ")
    }
}

function stripScriptStyle(htmlString) {
    const {document} = (new JSDOM(htmlString)).window

    // get title meta data
    let title = document.querySelector('title')
    if (typeof title !== "undefined" && title !== null) {
        title = title.innerHTML
    } else {
        console.log("No title given :(", title)
        title = ""
    }

    // get description meta data
    let description = document.querySelector('meta[name="description"]')
    if (typeof description !== "undefined" && description !== null) {
        description = description.content
    } else {
        console.log("No description given :(", description)
        description = ""
    }

    // get all links on the page
    let links = []
    for (let a of document.body.getElementsByTagName("a")) {
        if (a.href) {
            links.push(a.href)
        }
    }

    // remove all <script> tags, don't ask why we have to do a while-loop, idk....
    while (document.body.getElementsByTagName("script").length > 0) {
        for (let script of document.body.getElementsByTagName("script")) {
            script.parentNode.removeChild(script)
        }
    }

    // remove all <style> tags, don't ask why we have to do a while-loop, idk....
    while (document.body.getElementsByTagName("script").length > 0) {
        for (let style of document.body.getElementsByTagName("style")) {
            style.parentNode.removeChild(style)
        }
    }

    // get string back
    return {
        title,
        description,
        links,
        body: document.body.innerHTML
    }
}