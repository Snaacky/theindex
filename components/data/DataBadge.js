import styles from "./DataBadge.module.css"

export default function DataBadge({data, title, style = ""}) {
    const bgStyle = style !== "" ? style : (data === true ? "success" : (data === false ? "danger" : "secondary"))
    return <div className={styles.badge + " badge rounded-pill bg-" + bgStyle}>
        {title}
    </div>
}
