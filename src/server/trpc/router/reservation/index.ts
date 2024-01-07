import { ROLES } from "@/constants/role";
import { STATUS } from "@/constants/status";
import { VSMetaRequest } from "@/entities";
import { VSReservation } from "@/entities/dashboard/reservation";
import { publicProcedure } from "@/libs/trpc/init";
import { db, guests, reservations, users, work_units } from "@/server/database";
import { calculateTotalPages, metaResponsePrefix } from "@/utils";
import { TRPCError } from "@trpc/server";
import { eq, like, ilike, or, and, asc } from "drizzle-orm";

export const createReservation = publicProcedure
  .input(VSReservation.omit({ id: true }))
  .mutation(async ({ input }) => {
    try {
      await db
        .insert(reservations)
        .values({
          ...input,
          isApproved: Boolean(input.isApproved),
        })
        .returning();
      return {
        message: "Buat Reservasi Berhasil",
      };
    } catch (err) {
      const error = err as TRPCError;
      throw new Error(error?.message);
    }
  });

export const updateReservation = publicProcedure
  .input(VSReservation.pick({ id: true }))
  .mutation(async ({ input }) => {
    try {
      await db
        .update(reservations)
        .set(input)
        .where(eq(reservations.id, input?.id as string))
        .returning();
      return {
        message: "Perbarui Reservasi Berhasil",
      };
    } catch (err) {
      const error = err as TRPCError;
      throw new Error(error?.message);
    }
  });

export const deleteReservation = publicProcedure
  .input(VSReservation.pick({ id: true }))
  .mutation(async ({ input }) => {
    try {
      await db
        .delete(reservations)
        .where(eq(reservations.id, input.id as string))
        .returning();
      return {
        message: "Hapus Reservasi Berhasil",
      };
    } catch (err) {
      const error = err as TRPCError;
      throw new Error(error?.message);
    }
  });

export const getDetailReservation = publicProcedure
  .input(VSReservation.pick({ id: true }))
  .query(async ({ input }) => {
    try {
      const response = await db
        .select()
        .from(reservations)
        .where(eq(reservations.id, input.id as string))
        .then((res) => res.at(0));

      return response;
    } catch (err) {
      const error = err as TRPCError;
      throw new Error(error?.message);
    }
  });

export const approveReservation = publicProcedure
  .input(VSReservation.pick({ id: true }))
  .mutation(async ({ input }) => {
    try {
      await db
        .update(reservations)
        .set({ status: STATUS.APPROVED, isApproved: true })
        .where(eq(reservations.id, input.id as string))
        .returning();
      return {
        message: "Approve Reservasi Berhasil",
      };
    } catch (err) {
      const error = err as TRPCError;
      throw new Error(error?.message);
    }
  });

export const rejectReservation = publicProcedure
  .input(VSReservation.pick({ id: true }))
  .mutation(async ({ input }) => {
    try {
      await db
        .update(reservations)
        .set({ status: STATUS.CENCELLED, isApproved: false })
        .where(eq(reservations.id, input.id as string))
        .returning();
      return {
        message: "Approve Reservasi Berhasil",
      };
    } catch (err) {
      const error = err as TRPCError;
      throw new Error(error?.message);
    }
  });

export const getAllReservation = publicProcedure
  .input(VSMetaRequest.optional())
  .query(async ({ input, ctx }) => {
    try {
      const page = input?.page || 1;
      const perPage = input?.perPage || 10;
      const offset = (page - 1) * perPage;

      const data = await db
        .select()
        .from(reservations)
        .leftJoin(work_units, eq(work_units.id, reservations.workUnitId))
        .leftJoin(guests, eq(guests.id, reservations.guestId))
        .leftJoin(users, eq(users.id, reservations.userId))
        .where(
          and(
            eq(
              users.id,
              ctx.session?.user?.role?.name === ROLES.ADMIN
                ? reservations.userId
                : (ctx.session?.user?.id as string),
            ),
            or(
              ilike(reservations.companyName, `%${input?.search || ""}%`),
              ilike(reservations.objective, `%${input?.search || ""}%`),
              ilike(reservations.purpose, `%${input?.search || ""}%`),
            ),
          ),
        )
        .limit(perPage)
        .offset(input?.search ? 0 : offset)
        .orderBy(reservations.createdAt, asc(reservations.createdAt));

      const count = await db
        .select({ isApproved: reservations.isApproved })
        .from(reservations)
        .leftJoin(users, eq(users.id, reservations.userId))
        .where(
          and(
            eq(
              users.id,
              ctx.session?.user?.role?.name === ROLES.ADMIN
                ? reservations.userId
                : (ctx.session?.user?.id as string),
            ),
            or(
              ilike(reservations.companyName, `%${input?.search || ""}%`),
              ilike(reservations.objective, `%${input?.search || ""}%`),
              ilike(reservations.purpose, `%${input?.search || ""}%`),
            ),
          ),
        )
        .then((res) => res.length);

      const totalPage = calculateTotalPages(count, perPage);
      const nextPage = page < totalPage ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      const metaPrefix = {
        data: data.map((row) => ({
          ...row.app_reservations,
          user: row.user,
          workUnit: row.app_work_units,
          guest: row.app_guests,
        })),
        meta: {
          message: "Berhasil menampilkan reservasi",
          totalPage,
          nextPage,
          prevPage,
          ...input,
        },
      };
      return metaResponsePrefix(metaPrefix);
    } catch (err) {
      const error = err as TRPCError;
      throw new Error(error?.message);
    }
  });

export const getAllCompletedReservation = publicProcedure
  .input(VSMetaRequest.optional())
  .query(async ({ input }) => {
    try {
      return await db
        .select()
        .from(reservations)
        .where(
          or(
            eq(reservations.status, STATUS.APPROVED),
            like(reservations.companyName, `%${input?.search}%`),
          ),
        )
        .then((res) => res);
    } catch (err) {
      const error = err as TRPCError;
      throw new Error(error?.message);
    }
  });
