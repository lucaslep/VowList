import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ConfirmacoesPage(){
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect('/login')
  const {data:wedding}=await supabase.from('weddings').select('id').eq('owner_id',user.id).maybeSingle();if(!wedding)redirect('/dashboard')
  const {data:rsvps}=await supabase.from('rsvps').select('id, guest_name, phone, attending, companions, companion_names, created_at').eq('wedding_id',wedding.id).order('created_at',{ascending:false})
  return <main className="app-page"><div className="mx-auto max-w-5xl"><Link href="/dashboard" className="back-link">← Voltar para o dashboard</Link><h1 className="app-title mt-4">Confirmações de presença</h1><p className="mt-2 text-neutral-500">Acompanhe as respostas dos convidados.</p>
    {!rsvps?.length?<div className="app-card app-card-pad mt-8 text-center"><h2 className="text-xl font-semibold">Nenhuma confirmação ainda</h2><p className="mt-2 text-neutral-500">As respostas aparecerão aqui.</p></div>:<div className="mt-8 grid gap-4">{rsvps.map(item=><article className="app-card app-card-pad" key={item.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{item.guest_name}</h2><p className="mt-1 text-sm text-neutral-500">{item.phone}</p><p className="mt-1 text-sm text-neutral-500">Acompanhantes: {item.companions}</p>{item.companion_names?.length>0&&<ul className="mt-2 list-inside list-disc text-sm text-neutral-600">{item.companion_names.map((name:string)=><li key={name}>{name}</li>)}</ul>}</div><span className="status-pill">{item.attending?'Presença confirmada':'Não comparecerá'}</span></div></article>)}</div>}
  </div></main>
}
