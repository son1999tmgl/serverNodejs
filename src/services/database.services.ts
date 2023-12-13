import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
config();
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@facebook.jhpjjkt.mongodb.net/?retryWrites=true&w=majority`;

class Database {
    private client: MongoClient;
    constructor() {
        this.client = new MongoClient(uri);
    }
    async connect() {
        try {
            await this.client.db('facebook-dev').command({ ping: 1 });
            console.log('Pinged your deployment. You successfully connected to MongoDB');
        } catch (err) {
            console.log(err);
            process.exit(1);
        } finally {
            await this.client.close();
        }
    }
}
const database = new Database();
export default database;
