import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ManutencaoFormSchema } from '@/types/manutencaoForm';

export async function GET() {
  const { data, error } = await supabase.from('manutencoes').select('*').order('data', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const json = await request.json();
  const parse = ManutencaoFormSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.issues }, { status: 400 });
  }
  const { data, error } = await supabase.from('manutencoes').insert(parse.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const json = await request.json();
  const { id, ...rest } = json;
  if (!id) return NextResponse.json({ error: 'ID é obrigatório para atualização' }, { status: 400 });
  const parse = ManutencaoFormSchema.partial().safeParse(rest);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.issues }, { status: 400 });
  }
  const { data, error } = await supabase.from('manutencoes').update(parse.data).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const json = await request.json();
  const { id } = json;
  if (!id) return NextResponse.json({ error: 'ID é obrigatório para exclusão' }, { status: 400 });
  const { error } = await supabase.from('manutencoes').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
