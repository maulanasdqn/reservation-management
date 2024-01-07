"use client";
import {
  Button,
  ControlledFieldDate,
  ControlledFieldSelect,
  ControlledFieldText,
  ControlledFieldTextArea,
  FormTemplate,
} from "@/components";
import { GUEST_STATUS } from "@/constants/status";
import { TVSGuest, VSGuest } from "@/entities";
import { TVSReservation, VSReservation } from "@/entities/dashboard/reservation";
import { clientTrpc } from "@/libs/trpc/client";
import { notifyMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { FC, ReactElement, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export const DashboardReservationUpdateModule: FC = (): ReactElement => {
  const { id } = useParams();
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { isValid, errors, isDirty },
  } = useForm<Omit<TVSReservation, "id"> & Omit<TVSGuest, "id">>({
    mode: "all",
    resolver: zodResolver(
      VSReservation.omit({ id: true, guestId: true }).merge(VSGuest.omit({ id: true })),
    ),
  });

  console.log(errors);

  const { data: workUnits } = clientTrpc.getAllWorkUnit.useQuery();
  const { data: session } = useSession();
  const { data: detailReservation } = clientTrpc.getDetailReservation.useQuery({
    id: id as string,
  });
  const { data: detailGuest } = clientTrpc.getDetailGuest.useQuery({
    id: detailReservation?.guestId as string,
  });
  const { mutate: updateReservation } = clientTrpc.updateReservation.useMutation();
  const { mutate: updateGuest } = clientTrpc.updateGuest.useMutation();

  const { push } = useRouter();

  useEffect(() => {
    reset({
      //@ts-ignore
      date: new Date((detailReservation?.date as string) || new Date()) as Date,
      ...detailReservation,
      ...detailGuest,
    });
  }, [detailGuest, detailReservation, reset]);

  const workUnitOptions = useMemo(() => {
    if (!workUnits) return [];
    return workUnits?.data?.map((workUnit) => ({
      label: workUnit.name,
      value: workUnit.id,
    }));
  }, [workUnits]);

  const guestCategoryOptions = [
    {
      label: "Reguler",
      value: GUEST_STATUS.REGULAR,
    },
    {
      label: "Rombongan / VIP",
      value: GUEST_STATUS.VIP,
    },
    {
      label: "Loading/Unloading Transaksi",
      value: GUEST_STATUS.TRANSACTION,
    },
  ];

  const onSubmit = handleSubmit((data) => {
    console.log("Data Dari Form", data);
    updateGuest(
      {
        id: detailReservation?.guestId as string,
        ...data,
      },
      {
        onSuccess: () => {
          updateReservation(
            {
              ...data,
              id: id as string,
              guestId: detailGuest?.id as string,
            },
            {
              onSuccess: () => {
                push("/dashboard/guest?title=Data Tamu");
                notifyMessage({ type: "success", message: "Tamu Berhasi Diperbarui" });
              },

              onError: () => {
                notifyMessage({ type: "error", message: "Tamu Gagal Diperbarui" });
              },
            },
          );
        },
      },
    );
  });

  useEffect(() => {
    setValue("userId", session?.user?.id as string);
  }, [session, setValue]);

  return (
    <FormTemplate onSubmit={onSubmit}>
      <span className="text-2xl font-semibold">Data Tamu</span>
      <div className="flex gap-x-3 w-full">
        <ControlledFieldText
          size="sm"
          required
          placeholder="Nama Perusahaan"
          label="Perusuhaan / Instansi"
          name={"companyName"}
          control={control}
          type="text"
        />
        <ControlledFieldText
          size="sm"
          required
          label="Nama Tamu"
          control={control}
          name="name"
          placeholder="Masukkan nama tamu"
        />
      </div>
      <div className="flex gap-x-3 w-full">
        <ControlledFieldText
          size="sm"
          required
          name={"email"}
          placeholder="Email Perwakilan"
          label="Email (Perwakilan)"
          control={control}
          type="text"
        />
        <ControlledFieldText
          size="sm"
          required
          name="phoneNumber"
          placeholder="No.HP Perwakilan"
          label="No.HP (Perwakilan)"
          control={control}
          type="text"
        />
      </div>
      <div className="w-full flex flex-col gap-y-3">
        <div className="w-1/2">
          <ControlledFieldText
            size="sm"
            label="Jumlah Tamu"
            placeholder="Jumlah tamu"
            control={control}
            name="guestTotal"
            type="number"
          />
        </div>
        <ControlledFieldTextArea
          size="sm"
          label="Alamat"
          placeholder="Masukkan alamat tamu"
          control={control}
          name="address"
        />
      </div>
      <span className="text-2xl font-semibold">Data Reservasi</span>
      <div className="flex gap-x-3 w-full">
        <ControlledFieldSelect
          size="sm"
          label="Unit Kerja"
          options={workUnitOptions}
          control={control}
          name="workUnitId"
          placeholder="Pilih Unit Kerja"
        />
        <ControlledFieldSelect
          size="sm"
          label="Kategori Tamu"
          options={guestCategoryOptions}
          control={control}
          name="guestStatus"
          placeholder="Pilih Tipe Tamu"
        />
      </div>
      <div className="flex gap-x-3 w-full">
        <ControlledFieldDate
          size="sm"
          label="Tanggal"
          control={control}
          name="date"
          placeholder="Pilih Tanggal"
        />
        <ControlledFieldText
          size="sm"
          label="Jam (Waktu dalam WIB)"
          placeholder="Jam"
          control={control}
          name="hour"
          type="time"
        />
      </div>

      <div className="flex gap-x-3 w-full">
        <ControlledFieldText
          size="sm"
          label="Keperluan"
          placeholder="Keperluan"
          control={control}
          name="purpose"
          type="text"
        />
        <ControlledFieldText
          size="sm"
          label="Yang Ditemui"
          placeholder="Nama Yang Ditemui"
          control={control}
          name="objective"
          type="text"
        />
      </div>

      <div className="flex gap-x-4">
        <Button type="submit" size="sm" disabled={!isValid && !isDirty}>
          Simpan
        </Button>
        <Button
          onClick={() => {
            reset();
          }}
          type="button"
          size="sm"
          variant="cancel"
        >
          Batal
        </Button>
      </div>
    </FormTemplate>
  );
};
