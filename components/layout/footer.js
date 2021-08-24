import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function Footer({error}) {
    return <footer className={"mt-auto py-3 bg-2"}
                   style={{color: "#c6c6c6"}}>
        <div className="container">
            {error ?
                <p>
                    HTTP status code <kbd className={"text-danger"}>
                    {error}
                </kbd>
                </p>
                :
                <p>
                    The Anime Index is an index listing and comparing all different types of websites, applications, and
                    services for consuming Japanese media. We do not host any copyright infringing files, our services
                    do not enable any sort of file sharing, and we strictly forbid the distribution of copyrighted
                    media. All data is provided faithfully to the best of our knowledge and is subject to change without
                    prior notice. We are not affiliated or partnered with any of the services or applications listed. We
                    are affiliated with certain VPN providers via their referral affiliate program and receive a
                    commission for signups via our affiliate links. We are not responsible for any of the services
                    listed on the index.
                </p>
            }
            <hr/>
            <div className="row g-2">
                <div className="col d-flex justify-content-center icon-link-hover">
                    <a href="https://www.reddit.com/r/animepiracy/" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={["fab", "reddit"]} className={"me-2"}/>
                        <span className="d-none d-sm-inline-block">Reddit</span>
                    </a>
                </div>
                <div className="col d-flex justify-content-center icon-link-hover">
                    <a href="https://discord.gg/piracy" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={["fab", "discord"]} className={"me-2"}/>
                        <span className="d-none d-sm-inline-block">Discord</span>
                    </a>
                </div>
                <div className="col d-flex justify-content-center">
                    <a href="https://twitter.com/ranimepiracy" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={["fab", "twitter"]} className={"me-2"}/>
                        <span className="d-none d-sm-inline-block">Twitter</span>
                    </a>
                </div>
                <div className="col d-flex justify-content-center">
                    <a href="https://github.com/ranimepiracy/index" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={["fab", "github"]} className={"me-2"}/>
                        <span className="d-none d-sm-inline-block">Github</span>
                    </a>
                </div>
            </div>
        </div>
    </footer>
}
