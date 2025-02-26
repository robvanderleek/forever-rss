import {Feed} from "../entities/Feed";

export class ApiService {

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
        const requestOptions: { [key: string]: any } = {
            'method': method,
            // 'headers': {Authorization: `Bearer ${token}`}
        };
        if (data) {
            requestOptions['headers']['Content-Type'] = 'application/json';
            requestOptions['body'] = JSON.stringify(data);
        }
        return await fetch(endpoint, requestOptions);
    }

}