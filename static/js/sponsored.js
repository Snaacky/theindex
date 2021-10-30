window.addEventListener("load", () => {
    const sponsoredListAnime = [
        {
            id: "sponsored-anime-1",
            title: "Zoro.to",
            url: "https://zoro.to",
            description: 'Watch in ' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">1080p</span>' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">720p</span>' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">480p</span>' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">360p</span>' +
            ' x <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Subs</span> / ' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Dubs</span> '
        }
    ]

    const sponsoredListManga = [
        {
            id: "sponsored-manga-1",
            title: "MangaReader.to",
            url: "https://MangaReader.to",
            description: 'Try MangaReader if you need a Free Manga site with Premium Features and Absolutely No Ads'
        }
    ]

    if (sponsoredListAnime && sponsoredListAnime.length > 0) {
        sponsoredListAnime.forEach(sponsored => {
            document.querySelector('#sponsoredAnime').innerHTML +=
                '<div class="col" style="padding-right:1em;">' +
                '<div class="card mx-auto pr-1" style="min-width: 160px; max-width: 19.4rem;"><div class="card-body bg-darker">' +
                '<h5 class="card-title">' +
                '<div class="spinner-grow d-inline-block rounded-circle bg-secondary spinner-grow-sm" ' +
                'id="online-' + sponsored["id"] + '" data-bs-toggle="tooltip" role="status"></div> ' +
                sponsored["title"] + '</h5>' +
                '<h6 class="card-subtitle mb-2 text-warning">' +
                '<small><i class="bi bi-star-fill"></i></small>' +
                '</h6>' +
                '<p class="card-text d-none d-lg-block">' + sponsored["description"] + '</p>' +
                '<a class="umami--click--sponsored--' + sponsored["title"].toLowerCase() + '" href="' + sponsored["url"] + '" target="_blank">' +
                '<i class="bi bi-box-arrow-up-right"></i> Visit site' +
                '</a>' +
                '</div></div></div>'
            checkOnlineStatus(sponsored['url'])
                .then(status => {
                    let onlineStatus = document.querySelector('#online-' + sponsored["id"])
                    console.log("Sponsor online-check", onlineStatus, status)
                    onlineStatus.classList.remove("spinner-grow")
                    // remove previous color-state
                    if (onlineStatus.classList.contains("bg-secondary")) {
                        onlineStatus.classList.remove("bg-secondary")
                    }

                    // apply result color
                    if (status["status"] === "unknown") {
                        onlineStatus.classList.add("bg-warning")
                        onlineStatus.setAttribute("title", "Unknown")
                    } else if (status["status"] === "up") {
                        onlineStatus.classList.add("label-yes")
                        onlineStatus.setAttribute("title", "Online")
                    } else {
                        onlineStatus.classList.add("label-no")
                        onlineStatus.setAttribute("title", "Offline")
                    }

                    // initialize Tooltip
                    new bootstrap.Tooltip(onlineStatus)
                })
        })
    } else {
        document.querySelector('#sponsoredListAnime').remove()
    }

    if (sponsoredListManga && sponsoredListManga.length > 0) {
        sponsoredListManga.forEach(sponsored => {
            document.querySelector('#sponsoredManga').innerHTML +=
                '<div class="col" style="padding-right:1em;">' +
                '<div class="card mx-auto pr-1" style="min-width: 160px; max-width: 19.4rem;"><div class="card-body bg-darker">' +
                '<h5 class="card-title">' +
                '<div class="spinner-grow d-inline-block rounded-circle bg-secondary spinner-grow-sm" ' +
                'id="online-' + sponsored["id"] + '" data-bs-toggle="tooltip" role="status"></div> ' +
                sponsored["title"] + '</h5>' +
                '<h6 class="card-subtitle mb-2 text-warning">' +
                '<small><i class="bi bi-star-fill"></i></small>' +
                '</h6>' +
                '<p class="card-text d-none d-lg-block">' + sponsored["description"] + '</p>' +
                '<a class="umami--click--sponsored--' + sponsored["title"].toLowerCase() + '" href="' + sponsored["url"] + '" target="_blank">' +
                '<i class="bi bi-box-arrow-up-right"></i> Visit site' +
                '</a>' +
                '</div></div></div>'
            checkOnlineStatus(sponsored['url'])
                .then(status => {
                    let onlineStatus = document.querySelector('#online-' + sponsored["id"])
                    console.log("Sponsor online-check", onlineStatus, status)
                    onlineStatus.classList.remove("spinner-grow")
                    // remove previous color-state
                    if (onlineStatus.classList.contains("bg-secondary")) {
                        onlineStatus.classList.remove("bg-secondary")
                    }

                    // apply result color
                    if (status["status"] === "unknown") {
                        onlineStatus.classList.add("bg-warning")
                        onlineStatus.setAttribute("title", "Unknown")
                    } else if (status["status"] === "up") {
                        onlineStatus.classList.add("label-yes")
                        onlineStatus.setAttribute("title", "Online")
                    } else {
                        onlineStatus.classList.add("label-no")
                        onlineStatus.setAttribute("title", "Offline")
                    }

                    // initialize Tooltip
                    new bootstrap.Tooltip(onlineStatus)
                })
        })
    } else {
        document.querySelector('#sponsoredListManga').remove()
    }

})
