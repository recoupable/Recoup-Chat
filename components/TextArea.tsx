"use client";

import { ChangeEventHandler, useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface ITextArea {
  id?: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  label?: string;
  className?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  hookToForm: boolean;
  clasNameError?: string;
  disabled?: boolean;
  rows?: number;
}

function TextArea({
  id,
  name,
  value,
  label,
  hookToForm,
  onChange,
  className,
  clasNameError,
  rows = 1,
}: ITextArea) {
  const formContext = useFormContext();
  const isFullyHooked = name && hookToForm && formContext;

  const fieldError = isFullyHooked && formContext?.formState?.errors?.[name];

  useEffect(() => {
    if (name && hookToForm) {
      formContext.setValue(name, value);
    }
  }, [value, name, formContext, hookToForm]);

  return (
    <div className="relative w-full ">
      <label className="text-sm">{label}</label>
      <textarea
        {...(id && { id: id })}
        value={value}
        className={`w-full !outline-none border-gray-700 border-[1px] px-2 py-1 md:p-2 rounded-md text-sm
          ${className ? className : ""} ${
            hookToForm && fieldError && fieldError?.message ? clasNameError : ""
          }`}
        {...(!hookToForm && {
          value: value,
          onChange: onChange,
        })}
        {...(isFullyHooked
          ? formContext.register(name, {
              onChange: (e) => onChange && onChange(e),
            })
          : {})}
        name={name}
        rows={rows}
      />

      {isFullyHooked && fieldError && fieldError?.message && (
        <p className="text-red-600 text-xs">{fieldError?.message as string}</p>
      )}
    </div>
  );
}

TextArea.defaultProps = {
  hookToForm: false,
  type: "text",
};

export default TextArea;
