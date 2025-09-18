import "./ToggleSwitch.css"

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label class="switch">
        <input 
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span class="slider round"></span>
    </label>
  );
};

export default ToggleSwitch;
