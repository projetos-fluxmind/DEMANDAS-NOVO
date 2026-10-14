import { z } from 'zod';

export const LeituraHodometroSchema = z.object({
  id: z.string().uuid().optional(),
  motocicleta_id: z.string().uuid(),
  data: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Data inválida' }),
  km: z.number().int().positive(),
  observacoes: z.string().optional(),
});

export const AbastecimentoSchema = z.object({
  id: z.string().uuid().optional(),
  motocicleta_id: z.string().uuid(),
  data: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Data inválida' }),
  litros: z.number().positive(),
  preco_por_litro: z.number().positive(),
  total: z.number().positive(),
  observacoes: z.string().optional(),
});

export const TransferenciaSchema = z.object({
  id: z.string().uuid().optional(),
  tecnico_id: z.string().uuid(),
  data: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Data inválida' }),
  valor: z.number().positive(),
  observacoes: z.string().optional(),
});

export const DespesaSchema = z.object({
  id: z.string().uuid().optional(),
  transferencia_id: z.string().uuid().optional(),
  categoria: z.enum(['combustivel', 'manutencao', 'outros']),
  valor: z.number().positive(),
  data: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Data inválida' }),
  observacoes: z.string().optional(),
});

export const ManutencaoSchema = z.object({
  id: z.string().uuid().optional(),
  motocicleta_id: z.string().uuid(),
  tecnico_id: z.string().uuid(),
  tipo: z.enum(['oleo', 'pneus', 'freios', 'outro']),
  data: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Data inválida' }),
  custo: z.number().positive().optional(),
  observacoes: z.string().optional(),
});

export const AlertaSchema = z.object({
  id: z.string().uuid().optional(),
  motocicleta_id: z.string().uuid(),
  tipo: z.enum(['oleo', 'km', 'manutencao']),
  titulo: z.string(),
  descricao: z.string().optional(),
  data_criacao: z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Data inválida' }),
  resolvido: z.boolean().default(false),
});

export type LeituraHodometro = z.infer<typeof LeituraHodometroSchema>;
export type Abastecimento = z.infer<typeof AbastecimentoSchema>;
export type Transferencia = z.infer<typeof TransferenciaSchema>;
export type Despesa = z.infer<typeof DespesaSchema>;
export type Manutencao = z.infer<typeof ManutencaoSchema>;
export type Alerta = z.infer<typeof AlertaSchema>;
