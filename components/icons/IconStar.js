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
    const [isFav, setIsFav] = useState(false)
    const [userFav, setUserFav] = useState([])
    const {data: user, error} = useSWR("/api/user/me")
    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }

    if (user && user.favs) {
        const diff = userFav.filter(x => !user.favs.includes(x))
            .concat(user.favs.filter(x => !userFav.includes(x)))
        if (diff.length > 0) {
            setUserFav(user.favs)
            setIsFav(user.favs.includes(item._id))
        }
    }

    return <>
        <span className={iconStyles.icon + " " + styles.star}
              title={(isFav ? "Un-star" : "Star") + " item"}
              onClick={() => {
                  if (isLogin(session)) {
                      user.favs = isFav ? user.favs.filter(f => f !== item._id) : user.favs.concat([item._id])
                      let body = {
                          uid: "me",
                          favs: user.favs
                      }

                      fetch("/api/edit/user", {
                          method: "post",
                          headers: {"Content-Type": "application/json"},
                          body: JSON.stringify(body)
                      }).then(r => {
                          if (r.status !== 200) {
                              alert("Failed to save data: Error " + r.status)
                          } else {
                              setIsFav(!isFav)
                          }
                      })
                  } else {
                      setShow(true)
                  }
              }}>
            <FontAwesomeIcon
                icon={isFav ? ["fas", "star"] : ["far", "star"]}
                size={size}/>
        </span>
        {show ?
            <LoginModal text={"Cannot mark item as favourite for non existing user"}
                        close={() => setShow(false)}/>
            : <></>}
    </>
}
