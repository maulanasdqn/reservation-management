import { DashboardReservationCreateModule } from "@/modules/dashboard/reservation";
import { NextPage } from "next";
import { ReactElement } from "react";

const GuestCreatePage: NextPage = (): ReactElement => {
  return <DashboardReservationCreateModule />;
};

export default GuestCreatePage;
