import { z } from "zod";

export const VSReservation = z.object({
  id: z.string(),
  guestId: z.string().nullable(),
  workUnitId: z.string(),
  checkIn: z.coerce.date().optional().nullable(),
  checkOut: z.coerce.date().optional().nullable(),
  date: z.coerce.date(),
  guestTotal: z.string(),
  isApproved: z.boolean().optional().nullable(),
  userId: z.string(),
  status: z.string().nullable().optional(),
  checkInStatus: z.string().nullable().optional(),
  guestStatus: z.string(),
  purpose: z.string(),
  code: z.string().nullable().optional(),
  objective: z.string(),
  companyName: z.string().nullable().optional(),
  hour: z.string(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
});

export type TVSReservation = z.infer<typeof VSReservation>;
