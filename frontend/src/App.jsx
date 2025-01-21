import { useEffect } from "react";
import "./index.css";

export default function App() {
	useEffect(() => {
		fetch("http://127.0.0.1:8000/api", {
			method: "GET"
		})
			.then(res => res.json())
			.then(res => console.log(res));
	}, []);

	return (
		<div className="m-4">
			<h1>Hello, Vite and React!</h1>
		</div>
	);
}
