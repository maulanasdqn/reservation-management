import { forwardRef, useMemo } from "react";
import { TInputTextRich } from "./type";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "font",
  "size",
  "break",
];

const options = {
  modules,
  formats,
};

export const InputTextRich = forwardRef<any, TInputTextRich>(
  ({ onChange, status, ...props }, ref) => {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);
    return (
      <ReactQuill
        theme={"snow"}
        readOnly={props.disabled}
        onChange={(content, delta, source, editor) => {
          if (editor.getLength() > 1) {
            return onChange?.(content);
          } else {
            return onChange?.("");
          }
        }}
        {...{ ...options, ...props }}
      />
    );
  },
);

InputTextRich.displayName = "InputTextRich";
