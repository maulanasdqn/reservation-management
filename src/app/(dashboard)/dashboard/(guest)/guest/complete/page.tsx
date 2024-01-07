import { DashboardReservationCompleteModule } from "@/modules/dashboard/reservation";
import { NextPage } from "next";
import { ReactElement } from "react";

const GuestPage: NextPage = (): ReactElement => {
  return <DashboardReservationCompleteModule />;
};

export default GuestPage;
