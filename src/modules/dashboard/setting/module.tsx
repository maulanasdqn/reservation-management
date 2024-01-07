"use client";
import { ControlledFieldText, ControlledFieldTextArea, FormTemplate } from "@/components";
import { FC, ReactElement } from "react";
import { useForm } from "react-hook-form";
import { TUser } from "@/entities";

export const SettingModule: FC<{ session: TUser }> = ({ session }): ReactElement => {
  const { control } = useForm();
  return (
    <FormTemplate>
      <div className="flex w-full gap-x-6 min-h-screen h-full">
        <ControlledFieldText control={control} name={"business.name"} label="Nama Bisnis" />
        <ControlledFieldText
          control={control}
          name={"business.phoneNumber"}
          disabled
          label="Nomor Telepon Bisnis"
        />
        <ControlledFieldTextArea
          control={control}
          name={"business.address"}
          label="Alamat Bisnis"
        />
      </div>
    </FormTemplate>
  );
};
