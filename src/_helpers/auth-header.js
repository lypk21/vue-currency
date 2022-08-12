export function authHeader() {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.api_token) {
        return { 'Authorization': 'Bearer ' + user.api_token };
    } else {
        return {};
    }
}
