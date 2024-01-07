import { FieldTextRich } from "@/components";
import { ReactElement } from "react";
import { FieldValues, useController } from "react-hook-form";
import { TControlledFieldText } from "./type";

export const ControlledFieldTextRich = <T extends FieldValues>(
  props: TControlledFieldText<T>,
): ReactElement => {
  const { field } = useController(props);
  return <FieldTextRich {...{ ...props, ...field }} />;
};
