import { MongoClient } from 'mongodb'

const uri = (
  'DATABASE_URL' in process.env
    ? process.env.DATABASE_URL
    : 'mongodb://localhost'
) as string
if (typeof uri !== 'string') {
  throw Error('Unable to connect to DB due to missing DATABASE_URL')
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

class Singleton {
  private static _instance: Singleton
  private client: MongoClient
  private clientPromise: Promise<MongoClient>
  private constructor() {
    this.client = new MongoClient(uri, {
      maxPoolSize: 5,
      directConnection: true,
    })
    this.clientPromise = this.client.connect()
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      global._mongoClientPromise = this.clientPromise
    }
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Singleton()
    }
    return this._instance.clientPromise
  }
}
const clientPromise = Singleton.instance

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
