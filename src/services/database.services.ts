import { Collection, Db, MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { User } from '~/models/schemas/User.schema';
config();
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@facebook.jhpjjkt.mongodb.net/?retryWrites=true&w=majority`;

class Database {
    private client: MongoClient;
    private db: Db;
    constructor() {
        this.client = new MongoClient(uri);
        this.db = this.client.db('facebook-dev');
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

    user(): Collection<User> {
        return this.db.collection('users');
    }
}
const database = new Database();
export default database;
