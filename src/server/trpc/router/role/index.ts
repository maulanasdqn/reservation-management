import { VSMetaRequest } from "@/entities";
import { publicProcedure } from "@/libs/trpc/init";
import { db, roles } from "@/server";
import { calculateTotalPages, metaResponsePrefix } from "@/utils";
import { asc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

export const getRole = publicProcedure.input(VSMetaRequest).query(async ({ input }) => {
  try {
    const page = input?.page || 1;
    const perPage = input?.perPage || 10;
    const offset = (page - 1) * perPage;

    const data = await db
      .select()
      .from(roles)
      .where(or(ilike(roles.name, `%${input?.search || ""}%`)))
      .limit(perPage)
      .offset(input?.search ? 0 : offset)
      .orderBy(roles.created_at, asc(roles.created_at));

    const count = await db
      .select({ id: roles.id })
      .from(roles)
      .then((res) => res.length);

    const totalPage = calculateTotalPages(count, perPage);
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const metaPrefix = {
      data,
      meta: {
        code: 200,
        status: "success",
        message: "Berhasil menampilkan reservasi",
        page,
        perPage,
        totalPage,
        nextPage,
        prevPage,
      },
    };
    return metaResponsePrefix(metaPrefix);
  } catch (err) {
    throw new Error(err as string);
  }
});

export const deleteRole = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    try {
      await db.delete(roles).where(eq(roles.id, input.id as string));
      return {
        message: "Berhasil menghapus role!",
      };
    } catch (err) {
      throw new Error(err as string);
    }
  });

export const createRole = publicProcedure
  .input(z.object({ name: z.string(), permissions: z.array(z.string()).optional() }))
  .mutation(async ({ input }) => {
    try {
      await db.insert(roles).values(input).returning();
      return {
        message: "Berhasil membuat role baru!",
      };
    } catch (err) {
      throw new Error(err as string);
    }
  });