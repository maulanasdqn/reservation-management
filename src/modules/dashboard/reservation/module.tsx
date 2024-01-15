"use client";
import { Button, DataTable, Modal } from "@/components";
import { TVSReservation } from "@/entities/dashboard/reservation";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { parseAsInteger, useQueryState } from "next-usequerystate";
import { useRouter } from "next/navigation";
import { FC, ReactElement, useMemo, useState } from "react";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillDelete,
  AiFillEdit,
  AiFillEye,
} from "react-icons/ai";
import { match } from "ts-pattern";
import { clientTrpc } from "@/libs/trpc/client";
import { useSession } from "next-auth/react";
import { GUEST_STATUS, STATUS } from "@/constants/status";
import { ROLES } from "@/constants/role";
import { notifyMessage } from "@/utils";

export const DashboardReservationModule: FC = (): ReactElement => {
  const router = useRouter();

  const [search, setSearch] = useQueryState("search");
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(5));
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState("");
  const { data: session } = useSession();

  const { mutate: deleteReservation } = clientTrpc.deleteReservation.useMutation();
  const { mutate: approveReservation } = clientTrpc.approveReservation.useMutation();
  const { mutate: cancelReservation } = clientTrpc.rejectReservation.useMutation();

  const { data, refetch } = clientTrpc.getAllReservation.useQuery({
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
                onClick={() =>
                  router.push(
                    `/dashboard/guest/update/${row.original.id}?title=Perbarui Data Reservasi Tamu`,
                  )
                }
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
              {!row.original.isApproved &&
                session?.user?.role?.name === ROLES.ADMIN &&
                row.original.status === STATUS.WAITING && (
                  <AiFillCheckCircle
                    className="cursor-pointer bg-blue-400 text-white p-1 w-fit h-fit rounded-lg"
                    size={20}
                    onClick={() => {
                      setApproveModal(!approveModal);
                      setId(row.original.id);
                    }}
                  />
                )}

              {!row.original.isApproved && row.original.status === STATUS.WAITING && (
                <AiFillCloseCircle
                  className="cursor-pointer bg-orange-400 text-white p-1 w-fit h-fit rounded-lg"
                  size={20}
                  onClick={() => {
                    setRejectModal(!approveModal);
                    setId(row.original.id);
                  }}
                />
              )}

              {session?.user?.role?.name === ROLES.ADMIN && (
                <AiFillDelete
                  className="cursor-pointer bg-red-400 text-white p-1 w-fit h-fit rounded-lg"
                  size={20}
                  onClick={() => {
                    setDeleteModal(!approveModal);
                    setId(row.original.id);
                  }}
                />
              )}
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
        header: "Tanggal",
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
  }, [approveModal, router, session?.user?.role?.name]);

  return (
    <>
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
      <Modal
        width="400"
        height="100"
        title="Approval Reservasi"
        isOpen={approveModal}
        onClose={() => setApproveModal(false)}
      >
        <div className="flex flex-col gap-y-4">
          <span className="text-1xl text-red-500 font-medium">
            Apakah anda yakin akan mengapprove pengajuan reservasi ini?
          </span>
          <div className="flex gap-x-4">
            <Button
              onClick={async () => {
                approveReservation(
                  { id: id },
                  {
                    onSuccess: () => {
                      setId("");
                      setApproveModal(false);
                      refetch();
                      notifyMessage({ type: "success", message: "Pengajuan Berhasil Disetujui" });
                    },
                  },
                );
              }}
              variant="primary"
            >
              Ya
            </Button>
            <Button
              onClick={() => {
                setId("");
                setApproveModal(false);
              }}
              variant="cancel"
            >
              Batal
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        width="400"
        height="100"
        title="Approval Reservasi"
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
      >
        <div className="flex flex-col gap-y-4">
          <span className="text-1xl text-red-500 font-medium">
            Apakah anda yakin akan menolak pengajuan reservasi ini?
          </span>
          <div className="flex gap-x-4">
            <Button
              onClick={async () => {
                cancelReservation(
                  { id: id },
                  {
                    onSuccess: () => {
                      setId("");
                      setRejectModal(false);
                      refetch();
                      notifyMessage({ type: "success", message: "Pengajuan Reservasi Dibatalkan" });
                    },
                  },
                );
              }}
              variant="primary"
            >
              Ya
            </Button>
            <Button
              onClick={() => {
                setId("");
                setRejectModal(false);
              }}
              variant="cancel"
            >
              Batal
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        width="400"
        height="100"
        title="Hapus Reservasi"
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
      >
        <div className="flex flex-col gap-y-4">
          <span className="text-1xl text-red-500 font-medium">
            Apakah anda yakin akan menghapus pengajuan reservasi ini?
          </span>
          <div className="flex gap-x-4">
            <Button
              onClick={async () => {
                deleteReservation(
                  { id: id },
                  {
                    onSuccess: () => {
                      setId("");
                      setDeleteModal(false);
                      refetch();
                      notifyMessage({ type: "success", message: "Reservasi Berhasil Dihapus" });
                    },
                  },
                );
              }}
              variant="primary"
            >
              Ya
            </Button>
            <Button
              onClick={() => {
                setId("");
                setDeleteModal(false);
              }}
              variant="cancel"
            >
              Batal
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
