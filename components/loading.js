export default function Loader() {
    return <div className={"d-flex justify-content-center align-items-center h-100 w-100"}>
        <h3>
            Loading...
        </h3>
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
}
