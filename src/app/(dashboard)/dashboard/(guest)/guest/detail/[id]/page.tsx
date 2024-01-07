import { DashboardReservationDetailModule } from "@/modules/dashboard/reservation";
import { NextPage } from "next";
import { ReactElement } from "react";

const GuestDetailPage: NextPage = (): ReactElement => {
  return <DashboardReservationDetailModule />;
};

export default GuestDetailPage;
