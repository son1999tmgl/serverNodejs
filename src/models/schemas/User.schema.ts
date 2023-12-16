import { ObjectId } from 'mongodb';

enum UserVerifyStatus {
    Unverified, // chưa xác thực email, mặc định = 0
    Verified, // đã xác thực email
    Banned // bị khóa
}

interface UserType {
    _id?: ObjectId | undefined;
    name: string;
    email?: string;
    password: string;
    date_of_birth?: Date;
    created_at?: Date;
    updated_at?: Date;
    email_verify_token?: string; // jwt hoặc '' nếu đã xác thực email
    forgot_password_token?: string; // jwt hoặc '' nếu đã xác thực email
    verify?: UserVerifyStatus;

    bio?: string; // optional
    location?: string; // optional
    website?: string; // optional
    username?: string; // optional
    avatar?: string; // optional
    cover_photo?: string; // optional
}

export class User {
    _id: ObjectId | undefined;
    private email: string;
    private name: string;
    private date_of_birth: Date;
    private password: string;
    private created_at: Date;
    private updated_at: Date;
    private email_verify_token: string; // jwt hoặc '' nếu đã xác thực email
    private forgot_password_token: string; // jwt hoặc '' nếu đã xác thực email
    private verify: UserVerifyStatus;

    private bio: string; // optional
    private location: string; // optional
    private website: string; // optional
    private username: string; // optional
    private avatar: string; // optional
    private cover_photo: string; // optional
    constructor(user: UserType) {
        this._id = user._id;
        this.email = user.email || '';
        this.name = user.name;
        this.date_of_birth = user.date_of_birth || new Date();
        this.password = user.password;
        this.created_at = user.created_at || new Date();
        this.updated_at = user.updated_at || new Date();
        this.email = user.email || '';
        this.email_verify_token = user.email_verify_token || '';
        this.forgot_password_token = user.forgot_password_token || '';
        this.verify = user.verify || UserVerifyStatus.Unverified;
        this.bio = user.bio || '';
        this.location = user.location || '';
        this.website = user.website || '';
        this.username = user.username || '';
        this.avatar = user.avatar || '';
        this.cover_photo = user.cover_photo || '';
    }
}
