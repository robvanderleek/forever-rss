import {User} from "./User";

export interface Auth {
    token: string;
    user: User;
}