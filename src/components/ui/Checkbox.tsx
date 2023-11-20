interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className='inline-flex items-center space-x-2 cursor-pointer'>
      <input
        type='checkbox'
        className='form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
        checked={checked}
        onChange={onChange}
      />
      <span className='text-gray-700'>{label}</span>
    </label>
  )
}

export default Checkbox
