import { HTMLInputTypeAttribute } from "react";

interface TextInputProps {
  value: string;
  onChange: (newInput: string) => void;
  id: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}

export default function TextInput({
  type = "text",
  value,
  onChange,
  id,
  placeholder,
}: TextInputProps) {
  return (
    <div className="flex flex-col mb-8">
      <label className="label" htmlFor={id}>
        <span className="label-text">{id}</span>
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="input input-bordered w-96"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}
