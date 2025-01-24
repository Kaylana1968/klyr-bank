import PropTypes from "prop-types";

function Container({ children, style }) {
	return <main className={`w-full h-full p-10 flex flex-col ${style}`}>{children}</main>;
}

Container.propTypes = {
	children: PropTypes.node.isRequired
};

export default Container;
