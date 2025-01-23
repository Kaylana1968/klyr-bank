import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });

const sessionTokenKey = "sessionToken";

export function setToken(token) {
	cookies.set(sessionTokenKey, token);
}

export function logout() {
	cookies.set(sessionTokenKey, "");
	window.location.href = "/login";
}

export function getToken() {
	return cookies.get(sessionTokenKey);
}
