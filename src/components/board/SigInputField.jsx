// components/SigInputField.jsx
import * as Input from "@/components/Input.jsx";

export default function SigInputField({ label, placeholder, register, name }) {
  return (
    <Input.Root>
      <Input.Label>{label}</Input.Label>
      <Input.Input
        placeholder={placeholder}
        {...register(name, { required: true })}
      />
    </Input.Root>
  );
}
