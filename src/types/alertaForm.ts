import { z } from 'zod';

export const AlertaFormSchema = z.object({
  id: z.string().uuid().optional(),
  moto_id: z.string().uuid().optional().nullable(),
  tipo: z.enum(['Troca de Óleo', 'Revisão', 'Km Limite', 'Documentação', 'Outro']),
  mensagem: z.string().min(3, 'Mensagem deve ter pelo menos 3 caracteres').max(300),
  status: z.enum(['pendente', 'resolvido', 'ignorado']).default('pendente'),
  data_alerta: z.string().optional(),
});

export type Alerta = z.infer<typeof AlertaFormSchema>;
