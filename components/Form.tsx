import { joiResolver } from "@hookform/resolvers/joi";
import React, { FormEvent, ReactNode } from "react";
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form";

interface IForm {
  id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  onError?: SubmitErrorHandler<Object>;
  children: ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  initialValues?: Object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema: any;
}

function Form({
  id,
  onSubmit,
  validationSchema,
  children,
  onError,
  className,
  initialValues,
}: IForm) {
  const formMethods = useForm({
    resolver: joiResolver(validationSchema),
    defaultValues: initialValues,
  });

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      await formMethods.handleSubmit(onSubmit, onError)(event);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        {...(id && { id: id })}
        onSubmit={handleFormSubmit}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
}

Form.defaultProps = {
  onSubmit: () => {},
  children: "",
  className: "",
  initialValues: {},
};

export default Form;
