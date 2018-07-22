import Cookies from 'js-cookie';

const AccessTokenKey = 'access_token';
const RefreshTokenKey = 'refresh_token';
export function getAccessToken() {
    return Cookies.get(AccessTokenKey);
}
export function getRefreshToken() {
    return Cookies.get(RefreshTokenKey);
}
export function setRefreshToken(token) {
    return Cookies.set(RefreshTokenKey, token);
}
export function setAccessToken(token) {
    return Cookies.set(AccessTokenKey, token);
}
export function removeToken() {
    Cookies.remove(AccessTokenKey);
    Cookies.remove(RefreshTokenKey);
}
