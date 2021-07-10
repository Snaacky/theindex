import fs from 'fs'
import path from 'path'

export const images = () => fs.readdirSync(path.join(process.cwd(), 'public/img')).map(i => "/img/" + i)

export function randIcon() {
    const i = images()
    return i[Math.floor(Math.random() * i.length)]
}
