import { ChangeEventHandler, useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface IInput {
  id?: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  hookToForm: boolean;
  type: "text" | "password" | "url" | "number" | "email";
  classNameError?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

function Input({
  id,
  name,
  value,
  hookToForm,
  onChange,
  className,
  classNameError,
  disabled,
  label,
  type,
  required,
}: IInput) {
  const formContext = useFormContext();
  const isFullyHooked = Boolean(name && hookToForm && formContext);
  const fieldError = isFullyHooked && formContext?.formState?.errors?.[name];

  useEffect(() => {
    if (name && hookToForm) {
      formContext.setValue(name, value);
    }
  }, [value, name, formContext, hookToForm]);

  return (
    <div className="relative w-full">
      <label className="text-sm">
        {label}
        {required && <span className="text-red-700"> *</span>}
      </label>
      <input
        {...(id && { id })}
        value={value}
        className={`w-full !outline-none border-gray-700 border-[1px] px-2 py-1 md:p-2 rounded-md text-sm
          ${className || ""} ${
            hookToForm && fieldError && fieldError?.message
              ? `${classNameError} !border-red-700`
              : ""
          }`}
        {...(!hookToForm && {
          value,
          onChange,
        })}
        {...(isFullyHooked
          ? formContext.register(name as string, {
              onChange: (e) => onChange && onChange(e),
            })
          : {})}
        name={name}
        disabled={disabled}
        type={type}
      />

      {isFullyHooked && fieldError && fieldError?.message && (
        <p className="!text-red-700 text-sm pt-2">
          {fieldError?.message as string}
        </p>
      )}
    </div>
  );
}

Input.defaultProps = {
  hookToForm: false,
  type: "text",
};

export default Input;
