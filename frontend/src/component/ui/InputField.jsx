import PropTypes from "prop-types";

function InputField({ label, type, name, placeholder, value, onChange }) {
	return (
		<div className="flex flex-col">
			<label className="text-sm text-gray-500">{label}</label>
			<input
				className="outline-none border-2 border-secondary-dark rounded py-1 px-2 focus:border-primary transition-colors duration-300s ease "
				type={type}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
}

InputField.propTypes = {
	label: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["text", "number"]).isRequired,
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func
};

InputField.defaultProps = {
	type: "text",
	onChange: undefined
};

export default InputField;
