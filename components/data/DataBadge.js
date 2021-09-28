import styles from './DataBadge.module.css'

export default function DataBadge({data, name, style = "", sponsor = false}) {
    const bgStyle = style !== "" ? style : (data === true ? "success" : (data === false ? "danger" : "secondary"))
    return <div className={styles.badge + " badge rounded-pill bg-" + bgStyle + " " + (sponsor ? styles.sponsor + " text-dark" : "")}>
        {name}
    </div>
  )
}
