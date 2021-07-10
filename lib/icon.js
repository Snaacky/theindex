import fs from 'fs'
import path from 'path'

const images = fs.readdirSync(path.join(process.cwd(), 'public/img'))

export default function randIcon() {
    return "/img/" + images[Math.floor(Math.random() * images.length)]
}