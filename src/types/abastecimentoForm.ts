import { z } from 'zod';

export const AbastecimentoFormSchema = z.object({
  motocicleta_id: z.string().uuid({ message: 'ID da moto obrigatório' }),
  data: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Data inválida' }),
  litros: z.number().positive({ message: 'Litros deve ser positivo' }),
  preco_por_litro: z.number().positive({ message: 'Preço por litro deve ser positivo' }),
  observacoes: z.string().optional(),
});

export type AbastecimentoForm = z.infer<typeof AbastecimentoFormSchema>;
