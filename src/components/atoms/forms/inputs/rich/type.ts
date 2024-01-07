import { TCommonForms } from "@/entities";

export type TInputTextRich = {
  name: string;
  placeholder?: string;
  disabled?: boolean;
  value?: any;
  onChange?: (value: any) => void;
} & Pick<TCommonForms, "size" | "status">;
