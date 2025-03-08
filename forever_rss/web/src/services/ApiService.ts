import {Feed} from "../entities/Feed";
import {User} from "../entities/User";

export class ApiService {

    constructor(private token: string) {
    }

    public async currentUser(): Promise<User> {
        return this.apiGet('/api/v1/user/current');
    }

    public async userFeeds(): Promise<Array<Feed>> {
        return this.apiGet('/api/v1/user/feeds');
    }

    private async apiGet<T>(endpoint: string): Promise<T> {
        const res = await this.apiFetch(endpoint);
        if (res.ok) {
            return await res.json() as T;
        } else {
            throw ('Could not load feeds!');
        }
    }

    private async apiFetch(endpoint: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', data: any = undefined): Promise<Response> {
        let requestOptions: { [key: string]: any } = {};
        requestOptions['method'] = method;
        if (this.token !== 'Anonymous') {
            requestOptions['headers'] = {Authorization: `Bearer ${this.token}`}
        }
        if (data) {
            requestOptions['headers']['Content-Type'] = 'application/json';
            requestOptions['body'] = JSON.stringify(data);
        }
        return await fetch(endpoint, requestOptions);
    }

}