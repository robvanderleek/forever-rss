import jwksClient from "jwks-rsa";
import {decode, verify} from "jsonwebtoken";
import {HandlerEvent} from "@netlify/functions";
import {AUTH0_AUDIENCE, AUTH0_ISSUER} from "./config";
import fetch, {Response} from "node-fetch";

export async function getSubject(event: HandlerEvent): Promise<string | undefined> {
    const bearerField = event.headers['authorization'];
    if (!bearerField) {
        return undefined;
    }
    const token = bearerField.split(' ')[1]
    const client = jwksClient({jwksUri: `${AUTH0_ISSUER}.well-known/jwks.json`});
    const header = decode(token, {complete: true})?.header;
    const keys = await client.getSigningKey(header?.kid);
    const decoded = verify(token, keys.getPublicKey(), {audience: AUTH0_AUDIENCE, issuer: AUTH0_ISSUER});
    const result = decoded?.sub;
    if (typeof result === 'function') {
        return result();
    } else {
        return result;
    }
}

export async function rssFetch(url: string): Promise<Response> {
    return await fetch(url, {
        headers: {'user-agent': 'curl/7.79.1'},
        redirect: 'follow', follow: 5
    });
}