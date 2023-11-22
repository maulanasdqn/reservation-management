import { ChangeEvent, FC, ReactElement } from "react";
import { TTable } from "./type";
import { Search, Pagination } from "@/components";

export const Table: FC<TTable> = (props): ReactElement => {
  return (
    <section className="shadow-md p-4 rounded-lg w-full gap-y-4 flex flex-col">
      <Search {...props} />
      <table {...props} className="border rounded-lg p-2">
        {props.children}
      </table>
      <Pagination {...props} />
    </section>
  );
};
