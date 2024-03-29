"use client";
import { signOut } from "next-auth/react";
import { FC, ReactElement, Suspense, useMemo, useState } from "react";
import { IoMdClose, IoMdLogOut, IoMdMenu, IoMdPerson } from "react-icons/io";
import Image from "next/image";
import { useQueryState } from "next-usequerystate";
import { clsx } from "clsx";
import Link from "next/link";
import { TUser } from "@/entities";
import Avatar from "react-avatar";

export const Navbar: FC<{ user: TUser }> = ({ user }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useQueryState("isSidebarOpen");

  const userName = useMemo(() => user?.fullname, [user]);
  const profilePic = useMemo(() => user?.image, [user]);

  const navbarClassName = clsx(
    "w-full items-center gap-x-4 right-0 fixed top-0 bg-gray-800 shadow-md p-4 max-h-[56px] z-1 justify-between flex z-10",
    {
      "sm:pl-[280px]": isSidebarOpen === "open" || isSidebarOpen === "null" || !isSidebarOpen,
      "pl-6": isSidebarOpen === "close",
    },
  );

  const handleSidebar = async () => {
    if (isSidebarOpen === "open") {
      setIsSidebarOpen("close");
    } else {
      setIsSidebarOpen("open");
    }
  };

  return (
    <nav className={navbarClassName}>
      <div className="flex gap-x-4 relative">
        {isSidebarOpen === "close" ? (
          <IoMdMenu onClick={handleSidebar} className="font-bold text-white" size={24} />
        ) : (
          <IoMdClose onClick={handleSidebar} className="font-bold text-white" size={24} />
        )}
        <span className="text-white">
          Selamat Datang, <Suspense fallback="Loading..."> {userName} </Suspense>
        </span>
      </div>
      {profilePic ? (
        <Image
          onClick={() => setIsOpen(!isOpen)}
          src={profilePic}
          alt="profile"
          width={30}
          height={30}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <Avatar
          name={userName}
          className="cursor-pointer rounded-full"
          onClick={() => setIsOpen(!isOpen)}
          size={"30"}
        />
      )}
      {isOpen && (
        <div className="absolute top-16 select-none right-3 p-4 gap-y-4 rounded-lg shadow-md h-auto w-[300px] flex flex-col bg-white">
          <Link href={"/dashboard/setting?title=Pengaturan&menu=account"}>
            <span className="flex gap-x-2  hover:bg-gray-200 p-2 rounded-lg items-center font-medium text-gray-500 cursor-pointer">
              <IoMdPerson size={20} />
              Profile
            </span>
          </Link>
          <hr />
          <span
            onClick={() => signOut()}
            className="flex gap-x-2  hover:bg-gray-200 p-2 rounded-lg items-center font-medium text-gray-500 cursor-pointer"
          >
            <IoMdLogOut size={20} /> Keluar
          </span>
        </div>
      )}
    </nav>
  );
};

export * from "./landing";
