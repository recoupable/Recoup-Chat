"use client";

import { ChangeEventHandler, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea as ShadCNTextarea } from "./ui/textarea";

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
  placeholder,
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
      <ShadCNTextarea
        {...(id && { id: id })}
        value={value}
        placeholder={placeholder}
        className={`
          outline-none border-grey border-[1px] focus-visible:ring-0 shadow-none
          ${className ? className : ""} ${hookToForm && fieldError && fieldError?.message ? clasNameError : ""}`}
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
