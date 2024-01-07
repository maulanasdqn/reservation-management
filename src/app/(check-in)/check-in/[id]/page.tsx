"use client";
import { clientTrpc } from "@/libs/trpc/client";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { ReactElement } from "react";
import QRCode from "react-qr-code";

const CheckInPage: NextPage = (): ReactElement => {
  const { id } = useParams();
  const { data: setting } = clientTrpc.getSetting.useQuery();
  const { data: detail } = clientTrpc.getDetailReservation.useQuery({ id: id as string });
  return (
    <section className="flex w-full gap-y-3 justify-center items-center flex-col h-screen bg-gray-50">
      <QRCode value={detail?.code || ""} />
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-medium">Peraturan Masuk ke PT Len Industri</h1>
        <div
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: setting?.value || "" }}
        />
      </div>
    </section>
  );
};

export default CheckInPage;
