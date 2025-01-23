/** @type {import('tailwindcss').Config} */
export default {
	content: ["./*.{html,jsx}", "./src/**/*.jsx"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#3730a3",
					dark: "#312E81"
				},
				secondary: {
					DEFAULT: "#e0e7ff",
					dark: "#818CF8"
				}
			},
		}
	},
	plugins: []
};
