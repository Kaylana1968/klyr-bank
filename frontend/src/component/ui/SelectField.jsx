import PropTypes from 'prop-types';

function SelectField({label, options, name, value, onChange}) {
  return (
    <div className='flex flex-col'>
      <label className='text-sm text-gray-500'>{label}</label>
      <select
        className='bg-white outline-none border-2 border-secondary-dark rounded py-1 px-2 focus:border-primary transition-colors duration-300s ease'
        name={name}
        value={value}
        onChange={onChange}
      >
        <option>Selectionner un compte</option>
        {options.map(option => (
            <option key={option.id} value={option.id}>
                {option.name}
            </option>
        ))}
      </select>
    </div>
  )
}

SelectField.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
};

SelectField.defaultProps = {
    onChange: undefined,
};

export default SelectField
