import { ReactElement } from "react";
import { NextPage } from "next";
import { ScanSuccessModule } from "@/modules";

const QrScanPage: NextPage = (): ReactElement => {
  return <ScanSuccessModule />;
};

export default QrScanPage;
