"use client";
import { FC, Fragment, ReactElement, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { IoMdDesktop, IoMdLogOut, IoMdSettings } from "react-icons/io";
import { AiFillCaretDown } from "react-icons/ai";
import { FaUserCheck, FaUserClock } from "react-icons/fa";
import { PiUsersThreeFill } from "react-icons/pi";
import Link from "next/link";
import { useQueryState } from "next-usequerystate";
import { TUser } from "@/entities/user";
import { PERMISSIONS } from "@/server/database/schema";
import { hasCommonElements } from "@/utils";
import { FaUsersCog, FaUserEdit } from "react-icons/fa";
import Image from "next/image";

export const Sidebar: FC<{ user: TUser }> = ({ user }): ReactElement => {
  const [isSidebarOpen, setIsSidebarOpen] = useQueryState("isSidebarOpen");
  const [open, setOpen] = useState("");
  const userName = useMemo(() => user?.fullname, [user]);
  const roleName = useMemo(() => user?.role?.name, [user]);
  const pathname = usePathname();

  const selectedMenu = (url: string) =>
    clsx(
      "flex items-center p-2 text-white rounded-lg group hover:text-white hover:bg-primary hover:bg-opacity-70",
      {
        "bg-primary text-white": pathname === url,
      },
    );

  const sidebarClassName = clsx("fixed top-0 left-0 z-40 w-64 h-screen transition-transform", {
    "translate-x-0": isSidebarOpen === "open" || isSidebarOpen === "null" || !isSidebarOpen,
    "-translate-x-full": isSidebarOpen === "close",
  });

  const iconClassName = (url: string) =>
    clsx(
      "flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-white group-hover:text-white hover:text-white",
      {
        "text-primary ": pathname !== url,

        "text-white": pathname === url,
      },
    );

  const sidebarData = [
    {
      name: "Tamu",
      icon: <FaUserEdit className={iconClassName("/dashboard/guest")} />,
      path: "guest",
      permissions: [PERMISSIONS.GUEST_READ],
      children: [
        {
          name: "Data Tamu",
          icon: <FaUserClock className={iconClassName("/dashboard/guest")} />,
          path: "/dashboard/guest",
          url: `/dashboard/guest?title=Data Tamu&isSidebarOpen=${isSidebarOpen}`,
          permissions: [PERMISSIONS.GUEST_READ],
        },
        {
          name: "Data Tamu Selesai",
          icon: <FaUserCheck className={iconClassName("/dashboard/order")} />,
          path: "/dashboard/guest/complete",
          url: `/dashboard/guest/complete?title=Data Tamu Selesai&isSidebarOpen=${isSidebarOpen}`,
          permissions: [PERMISSIONS.GUEST_READ],
        },
      ],
    },

    {
      name: "Pengguna",
      icon: <FaUsersCog className={iconClassName("/dashboard/user")} />,
      path: "role",
      permissions: [PERMISSIONS.USER_READ],
      children: [
        {
          name: "Pengguna",
          icon: <PiUsersThreeFill className={iconClassName("/dashboard/user")} />,
          path: "/dashboard/user",
          url: `/dashboard/user?title=Data Pengguna&isSidebarOpen=${isSidebarOpen}`,
          permissions: [PERMISSIONS.USER_READ],
        },
      ],
    },
  ];

  return (
    <aside id="default-sidebar" className={sidebarClassName} aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800 shadow-md">
        <div className="flex flex-col gap-y-4 mb-4">
          <div className="flex gap-x-2 items-center">
            <Image src={"/logo.png"} alt="Logo" width={60} height={60} />
            <span className="text-gray-200 font-bold  w-full block text-2xl">Reservation</span>
          </div>
          <Link href={"/dashboard/setting?menu=account"}>
            <div className="bg-gray-600 p-2 rounded-lg flex flex-col cursor-pointer">
              <span className="text-gray-200 text-base">{userName}</span>
              <span className="text-gray-200 text-sm">{roleName}</span>
            </div>
          </Link>
        </div>
        <ul className="space-y-2 font-medium">
          {hasCommonElements([PERMISSIONS.IS_ADMIN], user?.role?.permissions) && (
            <li>
              <Link
                href={`/dashboard?title=Dashboard&isSidebarOpen=${isSidebarOpen}`}
                className={selectedMenu("/dashboard")}
              >
                <IoMdDesktop className={iconClassName("/dashboard")} />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
          )}
          {sidebarData.map((item, index) => (
            <Fragment key={index}>
              {hasCommonElements(item.permissions, user?.role?.permissions) && (
                <li key={index} className="text-white">
                  <div
                    onClick={() =>
                      open === "" || open !== item.path ? setOpen(item.path) : setOpen("")
                    }
                    className="flex gap-x-3 cursor-pointer group justify-between select-none items-center p-2 rounded-lg text-white hover:bg-primary hover:text-white hover:bg-opacity-70"
                  >
                    <div className="flex gap-x-3 items-center group">
                      {item.icon}
                      {item.name}
                    </div>
                    <AiFillCaretDown
                      className={clsx(
                        "flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white",
                        {
                          "rotate-180": open === item.path,
                        },
                      )}
                    />
                  </div>
                  <div className="my-3" />
                  {open === item.path && (
                    <div className="flex flex-col gap-y-2 p-2 bg-gray-700 ml-2 text-primary rounded-lg">
                      {item.children?.map((child, index) => (
                        <Fragment key={index}>
                          {hasCommonElements(child.permissions, user?.role?.permissions) && (
                            <Link key={index} href={child.url} className={selectedMenu(child.path)}>
                              {child.icon}
                              <span className="flex-1 ms-3 whitespace-nowrap">{child.name}</span>
                            </Link>
                          )}
                        </Fragment>
                      ))}
                    </div>
                  )}
                </li>
              )}
            </Fragment>
          ))}
          {hasCommonElements([PERMISSIONS.IS_ADMIN], user?.role?.permissions) && (
            <li>
              <Link
                href={`/dashboard/setting?title=Pengaturan&isSidebarOpen=${isSidebarOpen}&menu=account`}
                className={selectedMenu("/dashboard/setting")}
              >
                <IoMdSettings className={iconClassName("/dashboard/setting")} />
                <span className="ms-3">Pengaturan</span>
              </Link>
            </li>
          )}
          <li className="block md:hidden">
            <span onClick={() => setIsSidebarOpen("close")} className={selectedMenu("")}>
              <IoMdLogOut className={iconClassName("")} />
              <span className="ms-3">Tutup Sidebar</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
};
