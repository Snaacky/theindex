import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useSession} from "next-auth/client"
import {useState} from "react"
import LoginModal from "../modals/LoginModal"
import {isLogin} from "../../lib/session"
import ItemToListModal from "../modals/ItemToListModal"
import iconStyles from "./Icon.module.css"
import styles from "./IconBookmark.module.css"

export default function IconBookmark({item, size}) {
    const [session] = useSession()
    const [show, setShow] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    return <>
        <span className={iconStyles.icon + " " + styles.bookmark}
              onClick={() => {
                  setShow(!show)
              }}
              onMouseOver={() => setIsHovering(true)} onMouseOut={() => setIsHovering(false)}>
            <FontAwesomeIcon icon={isHovering ? ["fas", "bookmark"] : ["far", "bookmark"]} size={size}/>
        </span>
        {show ? (
            isLogin(session) ? <ItemToListModal item={item} close={() => setShow(false)}/> :
                <LoginModal text={"Cannot save item to list of non existing user"}
                            close={() => setShow(false)}/>
        ) : <></>}
    </>
}
