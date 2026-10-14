-- ==============================================================================
-- FROTA CONTROL - SCRIPT COMPLETO DE CRIAÇÃO DO BANCO DE DADOS (SUPABASE)
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/ltxccbwvjuspihwiahlh/sql/new
-- ==============================================================================

-- 1. TABELA: MOTOCICLETAS
create table if not exists public.motocicletas (
  id uuid default gen_random_uuid() primary key,
  placa text not null unique,
  marca text,
  modelo text,
  ano integer,
  cor text,
  cidade text,
  status text not null default 'ativa' check (status in ('ativa', 'em_manutencao', 'inativa', 'vendida')),
  intervalo_oleo_km integer not null default 800,
  observacoes text,
  user_id uuid default auth.uid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. TABELA: TÉCNICOS / CONDUTORES
create table if not exists public.tecnicos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  apelido text,
  telefone text,
  cidade text,
  status text not null default 'ativo' check (status in ('ativo', 'afastado', 'ferias', 'desligado')),
  observacoes text,
  user_id uuid default auth.uid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. TABELA: LEITURAS DE HODÔMETRO (KM)
create table if not exists public.leituras_hodometro (
  id uuid default gen_random_uuid() primary key,
  motocicleta_id uuid references public.motocicletas(id) on delete cascade,
  data text,
  data_hora timestamp with time zone default now(),
  km integer not null check (km >= 0),
  observacoes text,
  created_at timestamp with time zone default now()
);

-- 4. TABELA: ABASTECIMENTOS
create table if not exists public.abastecimentos (
  id uuid default gen_random_uuid() primary key,
  motocicleta_id uuid references public.motocicletas(id) on delete cascade,
  data text default to_char(now(), 'YYYY-MM-DD'),
  litros numeric(10,2) not null check (litros > 0),
  preco_por_litro numeric(10,2) not null check (preco_por_litro > 0),
  total numeric(10,2) not null check (total >= 0),
  observacoes text,
  created_at timestamp with time zone default now()
);

-- 5. TABELA: MANUTENÇÕES
create table if not exists public.manutencoes (
  id uuid default gen_random_uuid() primary key,
  moto_id uuid references public.motocicletas(id) on delete cascade,
  motocicleta_id uuid references public.motocicletas(id) on delete cascade,
  data text default to_char(now(), 'YYYY-MM-DD'),
  tipo text not null default 'Preventiva',
  descricao text,
  km integer not null default 0 check (km >= 0),
  troca_oleo boolean default false,
  custo numeric(10,2) default 0.00,
  created_at timestamp with time zone default now()
);

-- 6. TABELA: ALERTAS
create table if not exists public.alertas (
  id uuid default gen_random_uuid() primary key,
  moto_id uuid references public.motocicletas(id) on delete cascade,
  tipo text not null default 'Troca de Óleo',
  mensagem text not null,
  status text not null default 'pendente' check (status in ('pendente', 'resolvido', 'ignorado')),
  data_alerta text default to_char(now(), 'YYYY-MM-DD'),
  created_at timestamp with time zone default now()
);

-- 7. TABELAS FINANCEIRAS: TRANSFERÊNCIAS & DESPESAS
create table if not exists public.transferencias (
  id uuid default gen_random_uuid() primary key,
  tecnico_id uuid references public.tecnicos(id) on delete cascade,
  data text default to_char(now(), 'YYYY-MM-DD'),
  valor numeric(10,2) not null check (valor > 0),
  observacoes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.despesas (
  id uuid default gen_random_uuid() primary key,
  transferencia_id uuid references public.transferencias(id) on delete set null,
  categoria text not null check (categoria in ('combustivel', 'manutencao', 'outros')),
  valor numeric(10,2) not null check (valor > 0),
  data text default to_char(now(), 'YYYY-MM-DD'),
  observacoes text,
  created_at timestamp with time zone default now()
);

-- ==============================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.motocicletas enable row level security;
alter table public.tecnicos enable row level security;
alter table public.leituras_hodometro enable row level security;
alter table public.abastecimentos enable row level security;
alter table public.manutencoes enable row level security;
alter table public.alertas enable row level security;
alter table public.transferencias enable row level security;
alter table public.despesas enable row level security;

-- ==============================================================================
-- POLÍTICAS RLS (Permitem acesso de leitura/escrita para anon e authenticated)
-- ==============================================================================
drop policy if exists "Acesso livre motocicletas" on public.motocicletas;
create policy "Acesso livre motocicletas" on public.motocicletas for all using (true) with check (true);

drop policy if exists "Acesso livre tecnicos" on public.tecnicos;
create policy "Acesso livre tecnicos" on public.tecnicos for all using (true) with check (true);

drop policy if exists "Acesso livre leituras" on public.leituras_hodometro;
create policy "Acesso livre leituras" on public.leituras_hodometro for all using (true) with check (true);

drop policy if exists "Acesso livre abastecimentos" on public.abastecimentos;
create policy "Acesso livre abastecimentos" on public.abastecimentos for all using (true) with check (true);

drop policy if exists "Acesso livre manutencoes" on public.manutencoes;
create policy "Acesso livre manutencoes" on public.manutencoes for all using (true) with check (true);

drop policy if exists "Acesso livre alertas" on public.alertas;
create policy "Acesso livre alertas" on public.alertas for all using (true) with check (true);

drop policy if exists "Acesso livre transferencias" on public.transferencias;
create policy "Acesso livre transferencias" on public.transferencias for all using (true) with check (true);

drop policy if exists "Acesso livre despesas" on public.despesas;
create policy "Acesso livre despesas" on public.despesas for all using (true) with check (true);

-- ==============================================================================
-- CONCEDER PERMISSÕES
-- ==============================================================================
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

-- ==============================================================================
-- DADOS INICIAIS DE EXEMPLO (SEED DATA)
-- ==============================================================================
insert into public.motocicletas (placa, marca, modelo, ano, cor, cidade, status, intervalo_oleo_km, observacoes)
values 
  ('BRA2E19', 'Honda', 'CG 160 Fan', 2023, 'Vermelha', 'São Paulo', 'ativa', 800, 'Equipada com baú de 45L'),
  ('FLX4K92', 'Yamaha', 'Factor 150', 2022, 'Preta', 'Campinas', 'ativa', 800, 'Revisão periódica em dia'),
  ('MTO7H33', 'Honda', 'Bros 160', 2024, 'Azul', 'Santos', 'em_manutencao', 800, 'Aguardando troca de pastilha de freio')
on conflict (placa) do nothing;

insert into public.tecnicos (nome, apelido, telefone, cidade, status)
values
  ('Carlos Eduardo Silva', 'Carlinhos', '(11) 98765-4321', 'São Paulo', 'ativo'),
  ('Marcos Antonio Santos', 'Marcão', '(19) 99876-5432', 'Campinas', 'ativo'),
  ('Fernando Oliveira Lima', 'Fernandinho', '(13) 97654-3210', 'Santos', 'ferias')
on conflict do nothing;

insert into public.alertas (tipo, mensagem, status)
values
  ('Troca de Óleo', 'Motocicleta BRA2E19 atingiu 820 km desde a última troca de óleo recomendada.', 'pendente'),
  ('Revisão', 'Agendamento de revisão geral preventiva da frota de Campinas para o fim do mês.', 'pendente')
on conflict do nothing;
