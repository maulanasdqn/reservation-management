"use client";
import { FC, ReactElement } from "react";
import { AreaChartAdmin } from "./charts/admin/bar-chart/most-user-transaction";
import { CardChartAdmin } from "./charts/admin";
import { BarChartAdmin } from "./charts/admin/bar-chart/area-chart";

export const DashboardModule: FC = (): ReactElement => {
  return (
    <section className="flex w-full min-h-screen items-center justify-start flex-col">
      <div className="flex flex-col items-start justify-start w-full">
        <div className="w-full">
          <CardChartAdmin />
        </div>
        <div className="flex flex-col md:flex-row gap-x-2 w-full">
          <div className="w-full md:w-1/2">
            <AreaChartAdmin />
          </div>
          <div className="w-full md:w-1/2">
            <BarChartAdmin />
          </div>
        </div>
      </div>
    </section>
  );
};
