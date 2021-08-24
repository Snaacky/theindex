import styles from "./DataBadge.module.css"

export default function DataBadge({data, title}) {
    const bgStyle = (data === true ? "success" : (data === false ? "danger" : "secondary"))
    return <div className={styles.badge + " badge rounded-pill bg-" + bgStyle}>
        {title}
    </div>
}
