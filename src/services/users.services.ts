import { Collection } from "mongodb";
import { User } from "~/models/schemas/User.schema";
import database from "./database.services";

class UserService {
    users: Collection<User>
    constructor() {
        this.users = database.users
    }

    async register(payload: { name: string, email: string, password: string, date_of_birth: any }) {
        let { name, email, password, date_of_birth } = payload;
        date_of_birth = new Date(date_of_birth)
        const result = await database.users.insertOne(new User({ name, password, email, date_of_birth }));
        return result;
    }

    async login(payload: { email: string }) {
        const { email } = payload;
        const user = await this.users.findOne({ email })
        return user;
    }
}

const userService = new UserService();
export default userService;