export async function apiFetch(endpoint, user) {
    let headers = {};
    if (user) {
        const token = await user.jwt();
        headers['Authorization'] = `Bearer ${token}`
    }
    const response = await fetch(`/.netlify/functions/${endpoint}`, {headers});
    if (response.ok) {
        return await response.json();
    } else {
        return undefined;
    }
}