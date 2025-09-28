import './ToggleSwitch.css';

const ToggleSwitch = ({ checked, onChange, className = '', ...rest }) => {
  const value = !!checked;
  const labelClass = ['switch switch--form', className].filter(Boolean).join(' ');

  return (
    <label className={labelClass} title={value ? "켜짐" : "꺼짐"}>
      <input
        type="checkbox"
        checked={value}
        onChange={(event) => onChange?.(event.target.checked)}
        {...rest}
      />
      <span className="slider" aria-hidden="true"></span>
    </label>
  );
};

export default ToggleSwitch;
