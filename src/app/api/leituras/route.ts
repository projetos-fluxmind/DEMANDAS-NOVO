import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { LeituraHodometroSchema } from '@/types/extra';

export async function GET() {
  const { data, error } = await supabase.from('leituras_hodometro').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const json = await request.json();
  const parse = LeituraHodometroSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.issues }, { status: 400 });
  }
  const { data, error } = await supabase.from('leituras_hodometro').insert(parse.data).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const json = await request.json();
  const { id, ...rest } = json;
  if (!id) return NextResponse.json({ error: 'ID é obrigatório para atualização' }, { status: 400 });
  const parse = LeituraHodometroSchema.partial().safeParse(rest);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.issues }, { status: 400 });
  }
  const { data, error } = await supabase.from('leituras_hodometro').update(parse.data).eq('id', id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const json = await request.json();
  const { id } = json;
  if (!id) return NextResponse.json({ error: 'ID é obrigatório para exclusão' }, { status: 400 });
  const { error } = await supabase.from('leituras_hodometro').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
