import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WeddingExperience from './wedding-experience'

type Gift = { id:string; name:string; description:string|null; price:number|null; image_url:string|null; product_url:string|null; status:string }
type Wedding = { id:string|null; partner_one:string; partner_two:string; wedding_date:string|null; description:string|null; location?:string; pix?:string; monogram?:string; deliveryAddress?:string }

const personalizedWedding:Wedding={id:null,partner_one:'Lucas',partner_two:'Gabriella',wedding_date:'2028-01-09',description:'Oi! Estamos muito felizes em viver esse momento tão especial e queremos muito celebrar nosso casamento com você.',location:'Milícia da Imaculada · São Bernardo do Campo',pix:'11933201483',monogram:'LL + GV',deliveryAddress:'Av Sete de Setembro 120'}

function formatDate(value:string|null){if(!value)return null;return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T00:00:00Z`))}

export default async function WeddingPage({params}:PageProps<'/casamento/[slug]'>){
  const {slug}=await params
  const supabase=await createClient()
  const {data}=await supabase.from('weddings').select('id, partner_one, partner_two, wedding_date, description').eq('slug',slug).maybeSingle()
  let wedding:Wedding|null=slug==='lucas-e-gabriella'?personalizedWedding:null
  let gifts:Gift[]=[]
  if(data){wedding=slug==='lucas-e-gabriella'?{...personalizedWedding,...data}:data;const result=await supabase.from('gifts').select('id, name, description, price, image_url, product_url, status').eq('wedding_id',data.id).order('created_at',{ascending:false});gifts=(result.data as Gift[]|null)??[]}
  if(!wedding)notFound()
  return <main className="wedding-page">
    <header className="wedding-hero">
      <div className="wedding-monogram">{wedding.monogram??<>{wedding.partner_one.charAt(0)} <i>&</i> {wedding.partner_two.charAt(0)}</>}</div>
      <span className="wedding-kicker">Com alegria, convidamos você a celebrar</span>
      <h1>{wedding.partner_one} <em>&</em> {wedding.partner_two}</h1>
      {wedding.wedding_date&&<p className="wedding-date">{formatDate(wedding.wedding_date)}</p>}
      {wedding.location&&<p className="wedding-location">⌖ {wedding.location}</p>}
      <div className="invite-rule"><span>✦</span></div>
      {wedding.description&&<blockquote>“{wedding.description}”</blockquote>}
      <div className="hero-actions"><a href="#confirmacao" className="button button-light">Confirmar presença</a><a href="#presentes" className="button button-outline-light">Ver presentes</a></div>
    </header>
    <WeddingExperience weddingId={wedding.id} gifts={gifts} pix={wedding.pix} deliveryAddress={wedding.deliveryAddress}/>
    <footer className="wedding-footer"><span>♡</span><p>Obrigado por fazer parte da nossa história.</p><small>{wedding.partner_one} & {wedding.partner_two} · VowList</small></footer>
  </main>
}
