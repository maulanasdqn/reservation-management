import { z } from "zod";

export const VSGuest = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  address: z.string(),
});

export type TVSGuest = z.infer<typeof VSGuest>;
