import { TCommonForms, TInput } from "@/entities";

export type TFieldTextRich = TInput & Omit<TCommonForms, "text">;
