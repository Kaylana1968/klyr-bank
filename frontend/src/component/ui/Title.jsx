import PropTypes from 'prop-types';

function Title({children}) {
  return (
    <h2 className='text-center text-xl text-primary font-bold uppercase mb-5'>
        {children}
    </h2>
  )
}

Title.propTypes = {
    children: PropTypes.node.isRequired,
};

Title.defaultProps = {
    children: "Titre de la page"
};

export default Title