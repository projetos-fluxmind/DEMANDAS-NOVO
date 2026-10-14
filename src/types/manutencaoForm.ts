import { z } from "zod";

export const ManutencaoFormSchema = z.object({
  id: z.string().uuid().optional(),
  moto_id: z.string().uuid(),
  data: z.string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida" })
    .refine((val) => new Date(val) <= new Date(), { message: "Data não pode ser futura" }),
  tipo: z.enum(["Preventiva", "Corretiva", "Preditiva", "Outro"]),
  descricao: z.string().max(300).optional(),
  km: z.number().int().positive(),
  troca_oleo: z.boolean().default(false),
});

export type Manutencao = z.infer<typeof ManutencaoFormSchema>;
