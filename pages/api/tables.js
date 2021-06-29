import {getTables} from '../../lib/tables'

export default async function handler(req, res) {
    return await getTables()
}
