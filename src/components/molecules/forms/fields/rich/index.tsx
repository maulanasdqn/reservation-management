import { InputTextRich, Fieldset } from "@/components";
import { ReactElement, forwardRef } from "react";
import { TFieldTextRich } from "./type";
import ReactQuill from "react-quill";

export const FieldTextRich = forwardRef<ReactQuill, TFieldTextRich>((props, ref): ReactElement => {
  return (
    <Fieldset {...props}>
      <InputTextRich {...props} name={props.name as string} ref={ref} />
    </Fieldset>
  );
});

FieldTextRich.displayName = "FieldTextRich";
