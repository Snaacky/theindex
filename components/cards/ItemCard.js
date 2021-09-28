import Link from 'next/link'
import BoolValue from '../data/BoolValue'
import ArrayValue from '../data/ArrayValue'
import Card from './Card'
import { splitColumnsIntoTypes } from '../../lib/item'

export default function ItemCard({
  item,
  columns = [],
  add = null,
  remove = null,
  move = null,
}) {
  const column = splitColumnsIntoTypes(columns, item)

export default function ItemCard(
    {
        item,
        columns = [],
        add = null,
        remove = null,
        move = null
    }) {

    const column = splitColumnsIntoTypes(columns, item)

    return <Card type={"item"} content={item} add={add} remove={remove} move={move} bodyContent={<>
        {column.yes.length > 0 ?
            <div className={"d-flex flex-wrap mb-1"}>
                {column.yes.map(c => <BoolValue data={true} column={c} sponsor={item.sponsor} key={c._id}/>)}
            </div> : <></>
        }
        {!item.sponsor && column.no.length > 0 ?
            <div className={"d-flex flex-wrap mb-1"}>
                {column.no.map(c => <BoolValue data={false} column={c} key={c._id}/>)}
            </div> : <></>
        }
        {column.array.length > 0 ?
            <div className={"d-flex flex-wrap mb-1"}>
                {column.array.map(c => {
                    return <div key={c._id}>
                        <Link href={"/column/" + c.urlId}>
                            <a className={"me-2"} title={"View column " + c.name}>
                                {c.name}:
                            </a>
                        </Link>
                        <ArrayValue data={item.data[c._id]} column={c}/>
                    </div>
                })}
            </div> : <></>
        }
    </>}/>
}
