import { VSWorkUnit, VSMetaRequest } from "@/entities";
import { publicProcedure } from "@/libs/trpc/init";
import { db, work_units } from "@/server";
import { metaResponsePrefix } from "@/utils";
import { eq } from "drizzle-orm";

export const createWorkUnit = publicProcedure.input(VSWorkUnit).mutation(async ({ input }) => {
  try {
    await db.insert(work_units).values(input).returning();
    return {
      message: "Berhasil membuat Unit Kerja",
    };
  } catch (error) {
    throw new Error("Terjadi Kesalahan" + error);
  }
});

export const updateWorkUnit = publicProcedure.input(VSWorkUnit).mutation(async ({ input }) => {
  try {
    await db
      .update(work_units)
      .set(input)
      .where(eq(work_units.id, input.id as string));
    return {
      message: "Berhasil mengubah Unit Kerja",
    };
  } catch (error) {
    throw new Error("Terjadi Kesalahan" + error);
  }
});

export const deleteWorkUnit = publicProcedure
  .input(VSWorkUnit.pick({ id: true }))
  .mutation(async ({ input }) => {
    try {
      await db.delete(work_units).where(eq(work_units.id, input.id as string));
      return {
        message: "Berhasil menghapus Unit Kerja",
      };
    } catch (error) {
      throw new Error("Terjadi Kesalahan" + error);
    }
  });

export const getAllWorkUnit = publicProcedure
  .input(VSMetaRequest.optional())
  .query(async ({ input }) => {
    try {
      const metaPrefix = {
        data: await db
          .select()
          .from(work_units)
          .limit(input?.perPage || 10)
          .offset((input?.page || 0) * (input?.perPage || 10))
          .then((res) => res),
        meta: {
          message: "Berhasil mendapatkan semua Unit Kerja",
          ...input,
        },
      };
      return metaResponsePrefix(metaPrefix);
    } catch (error) {
      throw new Error("Terjadi Kesalahan" + error);
    }
  });

export const getDetailWorkUnit = publicProcedure
  .input(VSWorkUnit.pick({ id: true }))
  .query(async ({ input }) => {
    try {
      return await db
        .select()
        .from(work_units)
        .where(eq(work_units.id, input.id as string))
        .then((res) => res?.at(0));
    } catch (error) {
      throw new Error("Terjadi Kesalahan" + error);
    }
  });
