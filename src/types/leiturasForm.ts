import { z } from 'zod';

export const LeituraFormSchema = z.object({
  motocicleta_id: z.string().uuid({message: 'Moto é obrigatória'}),
  data: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Data inválida' }),
  km: z.number().int().positive({ message: 'Km deve ser positivo' }),
  observacoes: z.string().optional()
});

export type LeituraForm = z.infer<typeof LeituraFormSchema>;
