import {getLibrariesWithCollections} from "../../lib/db/libraries"

export default async function handler(req, res) {
    res.status(200).json(await getLibrariesWithCollections())
}
