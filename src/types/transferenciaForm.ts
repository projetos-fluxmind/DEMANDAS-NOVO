import { z } from "zod";

/**
 * Schema para criação/edição de uma transferência financeira.
 * - `moto_id`: UUID da motocicleta associada.
 * - `data`: data da transferência (não pode ser futura).
 * - `valor`: número positivo, duas casas decimais.
 * - `observacao`: texto opcional (máx 300 chars).
 */
export const TransferenciaFormSchema = z.object({
  moto_id: z.string().uuid(),
  data: z.coerce.date().refine((d) => d <= new Date(), { message: "Data não pode ser futura" }),
  valor: z.number().positive().max(1000000, { message: "Valor muito alto" }).refine((n) => Number.isFinite(n), { message: "Valor inválido" }).refine((n) => Number((n * 100).toFixed(0)) === n * 100, { message: "Máximo de duas casas decimais" }),
  observacao: z.string().max(300).optional().or(z.literal("")),
});

export type Transferencia = z.infer<typeof TransferenciaFormSchema>;
