import {rssFetch} from "@/function-utils";

test('RSS fetch', async () =>{
    const response = await rssFetch('https://google.com/');

    expect(response.status).toBe(200);
});