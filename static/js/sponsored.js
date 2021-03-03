window.addEventListener("load", () => {
    const sponsoredList = [/*{
        id: "sponsored0",
        title: "AnimeFever",
        url: "https://www.animefever.tv",
        description: 'Videos in ' +
            '<span class="badge rounded-pill" style="background-color: var(--table-hover);">720p</span> ' +
            '<span class="badge rounded-pill" style="background-color: var(--table-hover);">480p</span> ' +
            '<span class="badge rounded-pill" style="background-color: var(--table-hover);">360p</span> ' +
            'and available as ' +
            '<span class="badge rounded-pill" style="background-color: var(--table-hover);">Dubs</span> ' +
            '<span class="badge rounded-pill" style="background-color: var(--table-hover);">Subs</span> ' +
            'with ' +
            '<span class="badge rounded-pill" style="background-color: var(--table-hover);">Download</span>-Support'
    }*/]

    if (sponsoredList && sponsoredList.length > 0) {
        sponsoredList.forEach(sponsored => {
            document.querySelector('#sponsoredAnime').innerHTML +=
                '<div class="card m-2" style="width: 18rem;"><div class="card-body bg-darker">' +
                '<h5 class="card-title">' +
                '<div class="spinner-grow d-inline-block rounded-circle bg-secondary spinner-grow-sm" ' +
                'id="online-' + sponsored["id"] + '" data-bs-toggle="tooltip" role="status"></div> ' +
                sponsored["title"] + '</h5>' +
                '<h6 class="card-subtitle mb-2 text-warning">' +
                '<small>Sponsored <i class="bi bi-star-fill"></i></small>' +
                '</h6>' +
                '<p class="card-text d-none d-sm-block">' + sponsored["description"] + '</p>' +
                '<a href="' + sponsored["url"] + '" target="_blank">' +
                '<i class="bi bi-box-arrow-up-right"></i> Visit site' +
                '</a>' +
                '</div></div>'
            checkOnlineStatus(sponsored['url'])
                .then(result => {
                    let onlineStatus = document.querySelector('#online-' + sponsored["id"])
                    console.log("Sponsor online-check", onlineStatus, result)
                    onlineStatus.classList.remove("spinner-grow")
                    // remove previous color-state
                    if (onlineStatus.classList.contains("bg-secondary")) {
                        onlineStatus.classList.remove("bg-secondary")
                    }

                    // apply result color
                    if (result === "cloudflare") {
                        onlineStatus.classList.add("bg-warning")
                        onlineStatus.setAttribute("title", "Unknown")
                    } else if (result) {
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