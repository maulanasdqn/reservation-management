"use client";
import { FC, ReactElement } from "react";
import { useState } from "react";
import { useZxing } from "react-zxing";
import { useRouter } from "next/navigation";
export const QrScannersModule: FC = (): ReactElement => {
  const [result, setResult] = useState<string>("");
  const router = useRouter();
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      router.push("/scan-success");
    },
    // paused: result !== "",
  });
  return (
    <div className="flex flex-col w-full min-h-screen justify-start  lg:items-center">
      <div className="w-full h-1/2 rounded shadow-md p-2 my-6 text-center text-2xl font-bold ">
        <h1>Pindai QRIS</h1>
      </div>
      <video className="w-full lg:w-1/2 h-auto " ref={ref} />
    </div>
  );
};
