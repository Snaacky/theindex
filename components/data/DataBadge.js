import styles from './DataBadge.module.css'

export default function DataBadge({ data, name, style = '', sponsor = false }) {
  let bgStyle = style
  if (style === '') {
    if (data === true) {
      bgStyle = 'success'
    } else if (data === false) {
      bgStyle = 'danger'
    } else {
      bgStyle = 'secondary'
    }
  }

  return (
    <>
      <div
        className={
          styles.badge +
          ' badge rounded-pill bg-' +
          bgStyle +
          ' ' +
          (sponsor ? styles.sponsor + ' text-dark' : '')
        }
      >
        {name}
      </div>
    </>
  )
}
