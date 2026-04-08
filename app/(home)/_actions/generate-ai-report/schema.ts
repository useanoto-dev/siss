import { z } from "zod";

export const generateAiReportSchema = z.object({
  month: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, "Formato inválido. Use MM (ex: 01, 12)."),
});

export type GenerateAiReportSchema = z.infer<typeof generateAiReportSchema>;
