import PropTypes from "prop-types";

function Button({ type, children, onClick }) {
	return (
		<button
			type={type}
			className="w-fit py-1 px-4 rounded font-bold text-sm uppercase bg-secondary-dark text-white hover:bg-primary transition-colors duration-300s ease"
			onClick={onClick}
		>
			{children}
		</button>
	);
}

Button.propTypes = {
	type: PropTypes.oneOf(["submit", "button"]).isRequired,
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func
};

Button.defaultProps = {
	type: "button",
	text: "Text",
	onClick: undefined
};

export default Button;
