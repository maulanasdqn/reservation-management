"use client";
import { Button, FormTemplate } from "@/components";
import { FC, ReactElement, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ControlledFieldTextRich } from "@/components/organisms/forms/fields/controlleds/rich";
import { clientTrpc } from "@/libs/trpc/client";
import { notifyMessage } from "@/utils";

export const SettingModule: FC = (): ReactElement => {
  const { data } = clientTrpc.getSetting.useQuery();

  const { control, handleSubmit, reset } = useForm<{ value: string }>({
    defaultValues: {
      value: data?.value,
    },
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const { mutate } = clientTrpc.createSetting.useMutation();

  const onSubmit = handleSubmit((data) => {
    mutate(data.value, {
      onSuccess: () => {
        notifyMessage({ type: "success", message: "Pengaturan Berhasil Dibuat" });
      },
    });
  });

  return (
    <FormTemplate onSubmit={onSubmit}>
      <div className="flex flex-col w-full gap-y-6 min-h-screen h-full">
        <ControlledFieldTextRich control={control} name={"value"} />
        <div className="w-fit">
          <Button type="submit">Simpan</Button>
        </div>
      </div>
    </FormTemplate>
  );
};
