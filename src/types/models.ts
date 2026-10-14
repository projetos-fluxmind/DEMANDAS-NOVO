import { z } from 'zod';

export const MotocicletaSchema = z.object({
  id: z.string().uuid().optional(),
  placa: z.string().min(1, 'Placa é obrigatória'),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.number().int().optional(),
  cor: z.string().optional(),
  cidade: z.string().optional(),
  status: z.enum(['ativa', 'em_manutencao', 'inativa', 'vendida']).default('ativa'),
  intervalo_oleo_km: z.number().int().default(800),
  observacoes: z.string().optional(),
});

export const TecnicoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  apelido: z.string().optional(),
  telefone: z.string().optional(),
  cidade: z.string().optional(),
  status: z.enum(['ativo', 'afastado', 'ferias', 'desligado']).default('ativo'),
  observacoes: z.string().optional(),
});

export type Motocicleta = z.infer<typeof MotocicletaSchema>;
export type Tecnico = z.infer<typeof TecnicoSchema>;
