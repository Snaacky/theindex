import Row from "./Row"
import DataBadge from "../data/DataBadge"

export default function UserRow(
    {
        user,
        add = null,
        remove = null,
        move = null
    }) {

    const joined = new Date(user.createdAt).toISOString().slice(0, 10)
    return <Row type={"user"} content={user} add={add} remove={remove} move={move}
                bodyContent={<div>
                    <DataBadge name={user.accountType} style={"primary"}/>
                    <div className={"text-muted"}>
                        Joined <code>{joined}</code>
                    </div>
                </div>} imageUrl={user.image ? user.image : "/img/puzzled.png"}/>
}
