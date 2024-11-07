import { ChangeEventHandler, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

interface ITextArea {
  id?: string
  name?: string
  value?: any
  label?: string
  className?: string
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
  placeholder?: string
  hookToForm: boolean
  clasNameError?: string
  disabled?: boolean
  rows?: number
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
  const formContext = useFormContext()
  const isFullyHooked = name && hookToForm && formContext

  const fieldError = isFullyHooked && formContext?.formState?.errors?.[name]

  useEffect(() => {
    if (name && hookToForm) {
      formContext.setValue(name, value)
    }
  }, [value, name, formContext, hookToForm])

  return (
    <div className="relative w-full ">
      <label className="text-sm">
        {label}
      </label>
      <textarea
        {...(id && { id: id })}
        value={value}
        className={`text-black w-full border border-[#d1d5d5] placeholder:text-[#9b9b9b]
          rounded-[0.5rem] focus:ring-0 focus:border-blue 
          top-[16px] md:text-[0.875rem] font-radikal_light pt-[16px]
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {isFullyHooked && fieldError && fieldError?.message && (
        <p className="text-red-600 font-madeoutersans text-[10px]">
          {fieldError?.message as string}
        </p>
      )}
    </div>
  )
}

TextArea.defaultProps = {
  hookToForm: false,
  type: "text",
}

export default TextArea
