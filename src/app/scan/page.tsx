import { ReactElement } from "react";
import { NextPage } from "next";
import { QrScannersModule } from "@/modules";

const QrScanPage: NextPage = (): ReactElement => {
  return <QrScannersModule />;
};

export default QrScanPage;
