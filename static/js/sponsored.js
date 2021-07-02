window.addEventListener("load", () => {
    const sponsoredList = [
        {
            id: "sponsored0",
            title: "AnimeFever",
            url: "https://www.animefever.tv",
            description: 'Watch anime in ' +
                '<span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">1080p</span> ' +
                '<span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">720p</span>' +
                ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">480p</span>' +
                '<span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">360p</span>' +
                ' x <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Subs</span>' +
                ' , <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Dubs</span>' +
                ' &amp; <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Downloads</span><span>, apps available in </span>' +
                '<span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Android</span><span>' +
                ' and </span><span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">iOS</span>'
        },
        {
            id: "sponsored1",
            title: "ZoRo.to",
            url: "https://zoro.to/",
            description: 'NO ADS, watch free anime in' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">1080p</span>' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">720p</span>' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">360p</span> with' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Subs</span>' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Dubs</span> + ' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Schedule</span><span> feature </span>'
        },
        {
            id: "sponsored2",
            title: "KimAnime.com",
            url: "https://kimanime.com",
            description: 'Watch in ' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">1080p</span>' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">720p</span>' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">480p</span>' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">360p</span>' +
            ' x <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Subs</span> / ' +
            ' <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Dubs</span> ' +
            ' + <span class="badge rounded-pill" style="background-color: #ffc106;color: #202020;">Downloads</span>'
        }
    ]

    if (sponsoredList && sponsoredList.length > 0) {
        sponsoredList.forEach(sponsored => {
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
        document.querySelector('#sponsoredAnime').remove()
    }

})