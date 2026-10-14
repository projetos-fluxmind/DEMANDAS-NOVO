-- Migration for extra tables (leituras, abastecimentos, transferencias, despesas, manutencoes, alertas)

create table public.leituras_hodometro (
  id uuid default gen_random_uuid() primary key,
  motocicleta_id uuid not null references public.motocicletas(id) on delete cascade,
  data timestamp not null,
  km int not null check (km > 0),
  observacoes text
);

create table public.abastecimentos (
  id uuid default gen_random_uuid() primary key,
  motocicleta_id uuid not null references public.motocicletas(id) on delete cascade,
  data timestamp not null,
  litros numeric not null check (litros > 0),
  preco_por_litro numeric not null check (preco_por_litro > 0),
  total numeric generated always as (litros * preco_por_litro) stored,
  observacoes text
);

create table public.transferencias (
  id uuid default gen_random_uuid() primary key,
  tecnico_id uuid not null references public.tecnicos(id) on delete cascade,
  data timestamp not null,
  valor numeric not null check (valor > 0),
  observacoes text
);

create table public.despesas (
  id uuid default gen_random_uuid() primary key,
  transferencia_id uuid references public.transferencias(id) on delete set null,
  categoria text not null check (categoria in ('combustivel','manutencao','outros')),
  valor numeric not null check (valor > 0),
  data timestamp not null,
  observacoes text
);

create table public.manutencoes (
  id uuid default gen_random_uuid() primary key,
  motocicleta_id uuid not null references public.motocicletas(id) on delete cascade,
  tecnico_id uuid not null references public.tecnicos(id) on delete cascade,
  tipo text not null check (tipo in ('oleo','pneus','freios','outro')),
  data timestamp not null,
  custo numeric check (custo > 0),
  observacoes text
);

create table public.alertas (
  id uuid default gen_random_uuid() primary key,
  motocicleta_id uuid not null references public.motocicletas(id) on delete cascade,
  tipo text not null check (tipo in ('oleo','km','manutencao')),
  titulo text not null,
  descricao text,
  data_criacao timestamp default now(),
  resolvido boolean default false
);

-- Enable row level security for new tables
alter table public.leituras_hodometro enable row level security;
alter table public.abastecimentos enable row level security;
alter table public.transferencias enable row level security;
alter table public.despesas enable row level security;
alter table public.manutencoes enable row level security;
alter table public.alertas enable row level security;
