import { Collection, Db, MongoClient } from 'mongodb';
import { User } from '~/models/schemas/User.schema';
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@facebook.jhpjjkt.mongodb.net/?retryWrites=true&w=majority`;

class Database {
    private client: MongoClient;
    private db: Db;
    constructor() {
        this.client = new MongoClient(uri);
        this.db = this.client.db(process.env.DB_NAME);
    }
    async connect() {
        try {
            await this.db.command({ ping: 1 });
            console.log('Pinged your deployment. You successfully connected to MongoDB');
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    }

    get users(): Collection<User> {
        return this.db.collection(process.env.DB_USERS_COLLECTION as string);
    }
}
const database = new Database();
export default database;
