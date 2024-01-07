import { DashboardReservationUpdateModule } from "@/modules/dashboard/reservation";
import { NextPage } from "next";
import { ReactElement } from "react";

const GuestUpdatePage: NextPage = (): ReactElement => {
  return <DashboardReservationUpdateModule />;
};

export default GuestUpdatePage;
