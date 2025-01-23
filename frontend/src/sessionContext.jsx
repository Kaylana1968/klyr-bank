import { createContext } from "react";
import { getToken } from "./auth";

// eslint-disable-next-line react-refresh/only-export-components
export const SessionContext = createContext({});

export function SessionContextProvider({ children }) {
	const token = getToken();

	return (
		<SessionContext.Provider value={{ token }}>
			{children}
		</SessionContext.Provider>
	);
}
