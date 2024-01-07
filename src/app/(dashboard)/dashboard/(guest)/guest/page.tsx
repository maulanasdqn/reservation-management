import { DashboardReservationModule } from "@/modules/dashboard/reservation";
import { NextPage } from "next";
import { ReactElement } from "react";

const GuestPage: NextPage = (): ReactElement => {
  return <DashboardReservationModule />;
};

export default GuestPage;
