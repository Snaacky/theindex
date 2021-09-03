import iconStyles from "./Icon.module.css"
import styles from "./IconStar.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useSession} from "next-auth/client"
import {isLogin} from "../../lib/session"
import LoginModal from "../modals/LoginModal"
import {useState} from "react"
import useSWR from "swr"
import Error from "../../pages/_error"

export default function IconStar({item, size}) {
    const [session] = useSession()
    const [show, setShow] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const {data: user, error} = useSWR("/api/user/me")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!user) {
        return <></>
    }
    const isFav = user.favs.includes(item._id)

    return <>
        <span className={iconStyles.icon + " " + styles.star} title={"Star item"}
              onClick={() => {
                  if (isLogin(session)) {
                      user.favs = isFav ? user.favs.filter(f => f !== item._id) : user.favs.concat([item._id])
                      let body = {
                          uid: "me",
                          favs: user.favs
                      }
                      console.log("Saving new favs list", body)
                      fetch("/api/edit/user", {
                          method: "post",
                          headers: {"Content-Type": "application/json"},
                          body: JSON.stringify(body)
                      }).then(r => {
                          if (r.status !== 200) {
                              alert("Failed to save data: Error " + r.status)
                          }
                      })
                  } else {
                      setShow(true)
                  }
              }}
              onMouseOver={() => setIsHovering(true)} onMouseOut={() => setIsHovering(false)}>
            <FontAwesomeIcon
                icon={isHovering && !isFav || !isHovering && isFav ? ["fas", "star"] : ["far", "star"]}
                size={size}/>
        </span>
        {show ?
            <LoginModal text={"Cannot mark item as favourite for non existing user"}
                        close={() => setShow(false)}/>
            : <></>}
    </>
}
