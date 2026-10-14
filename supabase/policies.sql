-- RLS policies for all tables

-- Motorcycles
create policy "motocicletas_select" on public.motocicletas using (auth.uid() = user_id);
create policy "motocicletas_insert" on public.motocicletas with check (auth.uid() = user_id);
create policy "motocicletas_update" on public.motocicletas using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "motocicletas_delete" on public.motocicletas using (auth.uid() = user_id);

-- Technicians
create policy "tecnicos_select" on public.tecnicos using (auth.uid() = user_id);
create policy "tecnicos_insert" on public.tecnicos with check (auth.uid() = user_id);
create policy "tecnicos_update" on public.tecnicos using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tecnicos_delete" on public.tecnicos using (auth.uid() = user_id);

-- Leituras Hodômetro
create policy "leituras_select" on public.leituras_hodometro using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "leituras_insert" on public.leituras_hodometro with check (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "leituras_update" on public.leituras_hodometro using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id)) with check (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "leituras_delete" on public.leituras_hodometro using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));

-- Abastecimentos
create policy "abastecimentos_select" on public.abastecimentos using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "abastecimentos_insert" on public.abastecimentos with check (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "abastecimentos_update" on public.abastecimentos using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id)) with check (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "abastecimentos_delete" on public.abastecimentos using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));

-- Transferências
create policy "transferencias_select" on public.transferencias using (auth.uid() = (select user_id from public.tecnicos where id = tecnico_id));
create policy "transferencias_insert" on public.transferencias with check (auth.uid() = (select user_id from public.tecnicos where id = tecnico_id));
create policy "transferencias_update" on public.transferencias using (auth.uid() = (select user_id from public.tecnicos where id = tecnico_id)) with check (auth.uid() = (select user_id from public.tecnicos where id = tecnico_id));
create policy "transferencias_delete" on public.transferencias using (auth.uid() = (select user_id from public.tecnicos where id = tecnico_id));

-- Despesas
create policy "despesas_select" on public.despesas using (auth.uid() = (select user_id from public.tecnicos where id = (select tecnico_id from public.transferencias where id = transferencia_id)));
create policy "despesas_insert" on public.despesas with check (auth.uid() = (select user_id from public.tecnicos where id = (select tecnico_id from public.transferencias where id = transferencia_id)));
create policy "despesas_update" on public.despesas using (auth.uid() = (select user_id from public.tecnicos where id = (select tecnico_id from public.transferencias where id = transferencia_id))) with check (auth.uid() = (select user_id from public.tecnicos where id = (select tecnico_id from public.transferencias where id = transferencia_id)));
create policy "despesas_delete" on public.despesas using (auth.uid() = (select user_id from public.tecnicos where id = (select tecnico_id from public.transferencias where id = transferencia_id)));

-- Manutenções
create policy "manutencoes_select" on public.manutencoes using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "manutencoes_insert" on public.manutencoes with check (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "manutencoes_update" on public.manutencoes using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id)) with check (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "manutencoes_delete" on public.manutencoes using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));

-- Alertas
create policy "alertas_select" on public.alertas using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "alertas_insert" on public.alertas with check (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "alertas_update" on public.alertas using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id)) with check (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
create policy "alertas_delete" on public.alertas using (auth.uid() = (select user_id from public.motocicletas where id = motocicleta_id));
