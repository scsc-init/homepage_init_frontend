import "./ToggleSwitch.css"

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className="switch">
        <input 
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider round"></span>
    </label>
  );
};

export default ToggleSwitch;
