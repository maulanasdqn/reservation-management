import { z } from "zod";

export const VSWorkUnit = z.object({
  id: z.string().optional(),
  name: z.string(),
  companyName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  address: z.string(),
});

export type TVSWorkUnit = z.infer<typeof VSWorkUnit>;
