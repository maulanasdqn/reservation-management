"use client";
import { DataTable } from "@/components";
import { TVSReservation } from "@/entities/dashboard/reservation";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { parseAsInteger, useQueryState } from "next-usequerystate";
import { useRouter } from "next/navigation";
import { FC, ReactElement, useMemo } from "react";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { match } from "ts-pattern";
import { clientTrpc } from "@/libs/trpc/client";
import { GUEST_STATUS, STATUS } from "@/constants/status";

export const DashboardReservationCompleteModule: FC = (): ReactElement => {
  const router = useRouter();

  const [search, setSearch] = useQueryState("search");
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(5));

  const { data } = clientTrpc.getAllApprovedReservation.useQuery({
    search: search || "",
    page: page,
    perPage: perPage,
  });

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value?.toLowerCase());
  };

  const columns = useMemo<ColumnDef<TVSReservation>[]>(() => {
    return [
      {
        header: "Aksi",
        cell: ({ row }) => {
          return (
            <div className="flex gap-x-2">
              <AiFillEdit
                className="cursor-pointer bg-green-400 text-white p-1 w-fit h-fit rounded-lg"
                size={20}
              />
              <AiFillEye
                className="cursor-pointer bg-gray-400 text-white p-1 w-fit h-fit rounded-lg"
                size={20}
                onClick={() =>
                  router.push(
                    `/dashboard/guest/detail/${row.original.id}?title=Detail Data Reservasi Tamu`,
                  )
                }
              />
            </div>
          );
        },
      },
      {
        accessorKey: "isApproved",
        header: "Approval",
        accessorFn: (row) => {
          return row.isApproved ? "Sudah Disetujui" : "Belum Disetujui";
        },
      },
      {
        accessorKey: "companyName",
        header: "Nama Perusahaan / Instansi",
      },
      {
        accessorKey: "date",
        header: "Tanggal Kunjungan",
        accessorFn: (row) => {
          return row.date ? format(new Date(row.date), "dd MMM yyyy") : "";
        },
      },
      {
        accessorKey: "hour",
        header: "Jam",
      },
      {
        accessorKey: "objective",
        header: "Tujuan",
      },
      {
        accessorKey: "workUnit.name",
        header: "Unit Kerja",
      },
      {
        accessorKey: "purpose",
        header: "Keperluan",
      },
      {
        accessorKey: "createdAt",
        header: "Tanggal Dibuat",
        accessorFn: (row) => {
          return row.createdAt ? format(new Date(row.createdAt), "dd MMM yyyy") : "";
        },
      },
      {
        accessorKey: "user.fullname",
        header: "User",
      },

      {
        accessorKey: "guestStatus",
        header: "Kategori Tamu",
        accessorFn: (row) => {
          return match(row.guestStatus)
            .with(GUEST_STATUS.VIP, () => "VIP / Rombongan")
            .with(GUEST_STATUS.REGULAR, () => "Reguler")
            .with(GUEST_STATUS.TRANSACTION, () => "Load / Unload Transaksional")
            .otherwise(() => "Tidak terdefinisi");
        },
      },

      {
        accessorKey: "guest.name",
        header: "Tamu",
      },
      {
        accessorKey: "code",
        header: "Kode",
        accessorFn: (row) => {
          return row.isApproved ? row.code : "-";
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        accessorFn: (row) => {
          return match(row.status)
            .with(STATUS.WAITING, () => "Menunggu")
            .with(STATUS.CHECKED_IN, () => "Check In")
            .with(STATUS.CHECKED_OUT, () => "Check Out")
            .with(STATUS.CENCELLED, () => "Dibatalkan")
            .with(STATUS.APPROVED, () => "Disetujui")
            .otherwise(() => "Tidak Terdefinisi");
        },
      },
    ];
  }, [router]);

  return (
    <section className="flex w-full h-full">
      <DataTable
        handleSearch={handleSearch}
        createLink="/dashboard/guest/create?title=Tambah Data Reservasi Tamu"
        createLabel="+ Buat Reservasi"
        columns={columns}
        data={(data?.data as unknown as TVSReservation[]) || []}
        meta={data?.meta}
      />
    </section>
  );
};
