import Image from 'next/image'

export default function BoolValue({value, canEdit = false, onChange}) {
    return <div className={"d-inline-flex"} style={{
        verticalAlign: "middle"
    }}>
        <Image width={value ? 26 : 20} height={20}
               src={"/icons/" + (value ? "yes" : "no") + ".png"}
               alt={value ? "yes" : "no"}/>
    </div>
}
