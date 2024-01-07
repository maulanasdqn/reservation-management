import { publicProcedure } from "@/libs/trpc/init";
import { db, setting } from "@/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const createSetting = publicProcedure.input(z.string()).mutation(async ({ input }) => {
  try {
    const id = await db
      .select()
      .from(setting)
      .then((res) => res?.at(0)?.id);

    await db
      .update(setting)
      .set({ value: input })
      .where(eq(setting.id, id as string))
      .returning();

    return {
      message: "Berhasil membuat peraturan",
    };
  } catch (error) {
    throw new Error("Terjadi Kesalahan" + error);
  }
});

export const getSetting = publicProcedure.query(async () => {
  try {
    const data = await db
      .select()
      .from(setting)
      .then((res) => res?.at(0));
    return data;
  } catch (error) {
    throw new Error("Terjadi Kesalahan" + error);
  }
});
