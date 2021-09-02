import Card from "./Card"

export default function UserCard(
    {
        user,
        add = null,
        remove = null,
        move = null
    }) {

    const content = {
        _id: user.uid,
        name: user.name,
        description: user.description,
        accountType: user.accountType
    }
    const joined = new Date(user.createdAt).toISOString().slice(0, 10)
    return <Card type={"user"} content={content} imageUrl={user.image} add={add} remove={remove} move={move}
                 bodyContent={
                     <div className={"text-muted mt-auto align-self-end"}>
                         Joined <code>{joined}</code>
                     </div>
                 }/>
}
