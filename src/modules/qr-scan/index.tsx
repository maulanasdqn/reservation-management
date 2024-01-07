"use client";
import { FC, ReactElement } from "react";
import { useZxing } from "react-zxing";
import { useRouter } from "next/navigation";
import { clientTrpc } from "@/libs/trpc/client";
import { notifyMessage } from "@/utils";
export const QrScannersModule: FC = (): ReactElement => {
  const { mutate } = clientTrpc.onScanReservation.useMutation();

  const router = useRouter();
  const { ref } = useZxing({
    onDecodeResult(result) {
      mutate(
        {
          code: result.getText(),
        },
        {
          onSuccess: () => {
            router.push("/scan-success");
          },
          onError: () => {
            notifyMessage({ type: "error", message: "Reservasi Tidak Ditemukan" });
          },
        },
      );
    },
  });
  return (
    <div className="flex flex-col w-full min-h-screen justify-start  lg:items-center">
      <div className="w-full h-1/2 rounded shadow-md p-2 my-6 text-center text-2xl font-bold ">
        <h1>Pindai QRIS</h1>
      </div>
      <video className="w-full lg:w-1/4 h-auto" ref={ref} />
    </div>
  );
};
