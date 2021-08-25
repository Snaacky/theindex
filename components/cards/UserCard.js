import Card from "./Card"
import DataBadge from "../data/DataBadge"

export default function UserCard(
    {
        user,
        add = null,
        remove = null,
        move = null
    }) {
    const content = {
        title: user.name,
        urlId: user.uid,
        description: user.description
    }
    const joined = new Date(user.createdAt).toISOString().slice(0, 10)
    return <Card type={"user"} content={content} imageUrl={user.image} add={add} remove={remove} move={move}
                 bodyContent={<div>
                     <DataBadge title={user.accountType} style={"primary"}/>
                     <div className={"text-muted"}>
                         Joined <code>{joined}</code>
                     </div>
                 </div>}/>
}
