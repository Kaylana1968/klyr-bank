import { getToken } from "../auth";

export const GETfetcher = url =>
	fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		}
	}).then(res => res.json());

export const POSTfetcher = url =>
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		}
	}).then(res => res.json());

export const PUTfetcher = url =>
	fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		}
	}).then(res => res.json());
