import { VSGuest, VSMetaRequest } from "@/entities";
import { publicProcedure } from "@/libs/trpc/init";
import { db, guests } from "@/server";
import { metaResponsePrefix } from "@/utils";
import { eq } from "drizzle-orm";

export const createGuest = publicProcedure
  .input(VSGuest.omit({ id: true }))
  .mutation(async ({ input }) => {
    try {
      const data = await db.insert(guests).values(input).returning();
      return {
        message: "Berhasil membuat Tamu",
        id: data[0].id,
      };
    } catch (error) {
      throw new Error("Terjadi Kesalahan" + error);
    }
  });

export const getAllGuest = publicProcedure
  .input(VSMetaRequest.optional())
  .query(async ({ input }) => {
    try {
      const metaPrefix = {
        data: await db.select().from(guests),
        meta: {
          message: "Berhasil menampilkan Tamu",
          ...input,
        },
      };
      return metaResponsePrefix(metaPrefix);
    } catch (error) {
      throw new Error("Terjadi Kesalahan" + error);
    }
  });

export const getDetailGuest = publicProcedure
  .input(VSGuest.pick({ id: true }))
  .query(async ({ input }) => {
    try {
      return await db
        .select()
        .from(guests)
        .where(eq(guests.id, input.id as string))
        .then((res) => res?.at(0));
    } catch (error) {
      throw new Error("Terjadi Kesalahan" + error);
    }
  });

export const updateGuest = publicProcedure.input(VSGuest).mutation(async ({ input }) => {
  try {
    return await db
      .update(guests)
      .set(input)
      .where(eq(guests.id, input.id as string))
      .then((res) => res);
  } catch (error) {
    throw new Error("Terjadi Kesalahan" + error);
  }
});

export const deleteGuest = publicProcedure.input(VSGuest).mutation(async ({ input }) => {
  try {
    return await db
      .delete(guests)
      .where(eq(guests.id, input.id as string))
      .then((res) => res);
  } catch (error) {
    throw new Error("Terjadi Kesalahan" + error);
  }
});
