import { TCommonForms, TMetaItem, TMetaResponse } from "@/entities";
import { PERMISSIONS } from "@/server/database/schema";
import { clsx } from "clsx";
import { toast } from "react-toastify";

export const inputClassName = ({
  size,
  status,
  preppend,
  append,
}: Pick<TCommonForms, "size" | "status" | "append" | "preppend">): string =>
  clsx(
    "rounded-lg border border-1 outline-none w-full",
    "disabled:bg-gray-100 disabled:placeholder:text-gray-500 disabled:border-gray-200",
    "disable:cursor-not-allowed disable:opacity-50 disable:select-none disabled:text-gray-400",
    {
      "text-sm placeholder:text-xs pl-2 pr-3 py-2": size === "sm" && !preppend && !append,
      "text-sm placeholder:text-xs pl-7 pr-3 py-2": size === "sm" && preppend && !append,
      "text-sm placeholder:text-xs pl-2 pr-7 py-2": size === "sm" && !preppend && append,
      "text-sm placeholder:text-xs pl-7 pr-7 py-2": size === "sm" && preppend && append,
    },
    {
      "text-base placeholder:text-sm pl-3 pr-4 py-3": size === "md" && !preppend && !append,
      "text-base placeholder:text-sm pl-9 pr-4 py-3": size === "md" && preppend && !append,
      "text-base placeholder:text-sm pl-3 pr-9 py-3": size === "md" && !preppend && append,
      "text-base placeholder:text-sm pl-10 pr-10 py-3": size === "md" && preppend && append,
    },
    {
      "text-lg placeholder:text-base pl-4 pr-5 py-4": size === "lg" && !preppend && !append,
    },
    {
      "border-gray-300 placeholder:text-gray-500 text-gray-500 bg-gray-50":
        status === "none" || status === undefined,
      "border-green-600 placeholder:text-green-600 text-green-600 bg-green-50":
        status === "success",
      "border-red-300 placeholder:text-red-300 text-red-400 bg-red-50": status === "error",
      "border-yellow-400 placeholder:text-yellow-400 text-yellow-400 bg-yellow-50":
        status === "warning",
    },
  );

export const formatCurrency = (value: number | unknown): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));

export function hasCommonElements<T>(arr1: T[], arr2: T[]): boolean {
  const [shorter, longer] = arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];
  const set = new Set<T>(shorter);
  return longer.some((element) => set.has(element));
}

export const permissionMapper = [
  {
    url: "/dashboard",
    permissions: [PERMISSIONS.IS_ADMIN],
  },
  {
    url: "/dashboard/guest",
    permissions: [PERMISSIONS.GUEST_READ],
  },
  {
    url: "/dashboard/guest/complete",
    permissions: [PERMISSIONS.GUEST_READ],
  },
  {
    url: "/dashboard/setting",
    permissions: [PERMISSIONS.IS_ADMIN],
  },
  {
    url: "/scan",
    permissions: [],
  },
  {
    url: "/check-in",
    permissions: [],
  },
];

export const metaResponsePrefix = <T>({
  data,
  meta,
}: {
  data: T;
  meta: TMetaItem;
}): TMetaResponse<T> => {
  return {
    data,
    meta,
  };
};

export function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
}

export const notifyMessage = ({
  message,
  type = "success",
}: {
  message: string;
  type: "success" | "error";
}) =>
  toast(message, {
    position: "top-right",
    type,
    theme: "light",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export function generateAlphanumericCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
