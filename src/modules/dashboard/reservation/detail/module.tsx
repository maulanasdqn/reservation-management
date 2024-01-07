"use client";
import { FC, ReactElement } from "react";
import QRCode from "react-qr-code";
import { DashboardHeadTemplate, FormTemplate } from "@/components";
import Link from "next/link";
import { format } from "date-fns";
import { match } from "ts-pattern";
import { clientTrpc } from "@/libs/trpc/client";
import { useParams } from "next/navigation";
import { GUEST_STATUS, STATUS } from "@/constants/status";

export const DashboardReservationDetailModule: FC = (): ReactElement => {
  const { id } = useParams();
  const { data } = clientTrpc.getDetailReservation.useQuery({ id: id as string });
  return (
    <>
      <FormTemplate>
        <div className="flex flex-col md:flex-row gap-y-6 md:gap-x-6">
          <div className="flex flex-col gap-y-2">
            {data?.isApproved ? (
              <QRCode value={`${data?.code}`} />
            ) : (
              <span className="w-[200px] h-[200px] text-center flex items-center justify-center border p-2 rounded-lg">
                QR Code akan muncul ketika reservasi sudah di approve
              </span>
            )}
            <span>
              Kode Checkin Tamu : {data?.isApproved ? <strong>{data?.code}</strong> : "-"}
            </span>
            {data?.isApproved ? (
              <Link
                className="text-blue-600"
                href="/check-in/[id]"
                as={`/check-in/${data?.id}`}
                target="_blank"
              >
                Link Checkin
              </Link>
            ) : (
              <span>Link: -</span>
            )}
          </div>
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
              <span className="text-lg font-medium">Nama Perushaan / Instansi</span>
              <span>{data?.companyName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Keperluan</span>
              <span>{data?.purpose}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Tujuan</span>
              <span>{data?.objective}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Tanggal</span>
              <span>
                {format(new Date((data?.date as unknown as Date) || new Date()), "dd MMM yyyy")}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
              <span className="text-lg font-medium">Status</span>
              <span>
                {match(data?.status)
                  .with(STATUS.WAITING, () => "Menunggu")
                  .with(STATUS.CHECKED_IN, () => "Check In")
                  .with(STATUS.CHECKED_OUT, () => "Check Out")
                  .with(STATUS.CENCELLED, () => "Dibatalkan")
                  .with(STATUS.APPROVED, () => "Disetujui")
                  .otherwise(() => "Tidak Terdefinisi")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Jam</span>
              <span>{data?.hour}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-medium">Kategori Tamu</span>
              <span>
                {match(data?.guestStatus)
                  .with(GUEST_STATUS.VIP, () => "VIP / Rombongan")
                  .with(GUEST_STATUS.REGULAR, () => "Reguler")
                  .with(GUEST_STATUS.TRANSACTION, () => "Load / Unload Transaksional")
                  .otherwise(() => "Tidak terdefinisi")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Tanggal Dibuat</span>
              <span>
                {format(
                  new Date((data?.createdAt as unknown as Date) || new Date()),
                  "dd MMM yyyy",
                )}
              </span>
            </div>
          </div>
        </div>
      </FormTemplate>
    </>
  );
};
