'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import WeddingCountdown from './wedding-countdown'

type Gift={id:string;name:string;description:string|null;price:number|null;image_url:string|null;product_url:string|null;status:string}
type Props={weddingId:string|null;gifts:Gift[];pix?:string;deliveryAddress?:string}

const ceremonyMapsUrl='https://www.google.com/maps/search/?api=1&query=Estrada%20do%20Morro%20Grande%2C%20870%2C%20Finco%2C%20S%C3%A3o%20Bernardo%20do%20Campo%20-%20SP'

export default function WeddingExperience({weddingId,gifts:initialGifts,pix,deliveryAddress}:Props){
  const supabase=createClient();const [gifts,setGifts]=useState(initialGifts);const [selected,setSelected]=useState<Gift|null>(null);const [guestName,setGuestName]=useState('');const [guestPhone,setGuestPhone]=useState('');const [giftMessage,setGiftMessage]=useState('');const [rsvpMessage,setRsvpMessage]=useState('');const [loading,setLoading]=useState(false);const [attending,setAttending]=useState(true);const [companionCount,setCompanionCount]=useState(0)
  async function reserveGift(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    if(!selected)return

    const storeWindow=selected.product_url?window.open('about:blank','_blank'):null
    setLoading(true)
    setGiftMessage('')

    try{
      const {data,error}=await supabase.rpc('reserve_gift',{p_gift_id:selected.id,p_guest_name:guestName.trim(),p_guest_phone:guestPhone.trim()}).abortSignal(AbortSignal.timeout(15000))
      if(error||!data){
        storeWindow?.close()
        setGiftMessage(error?.message??'Este presente já foi escolhido por outra pessoa.')
        return
      }

      setGifts(current=>current.map(gift=>gift.id===selected.id?{...gift,status:'reserved'}:gift))
      setGiftMessage('Presente reservado com sucesso!')

      if(selected.product_url){
        if(storeWindow){storeWindow.opener=null;storeWindow.location.href=selected.product_url}
        else setGiftMessage('Presente reservado. O navegador bloqueou a loja; permita pop-ups e tente abrir novamente.')
      }
    }catch{
      storeWindow?.close()
      setGiftMessage('Não foi possível concluir a reserva. Verifique sua conexão e tente novamente.')
    }finally{
      setLoading(false)
    }
  }
  async function submitRsvp(event:React.FormEvent<HTMLFormElement>){event.preventDefault();if(!weddingId)return;setLoading(true);setRsvpMessage('');const form=new FormData(event.currentTarget);const companionNames=attending?Array.from({length:companionCount},(_,index)=>String(form.get(`companion_${index}`)).trim()):[];const {error}=await supabase.from('rsvps').insert({wedding_id:weddingId,guest_name:String(form.get('name')).trim(),phone:String(form.get('phone')).trim(),attending,companions:companionNames.length,companion_names:companionNames});setRsvpMessage(error?error.message:'Presença registrada. Obrigado pela confirmação!');if(!error){event.currentTarget.reset();setAttending(true);setCompanionCount(0)}setLoading(false)}
  return <>
    <section id="cerimonia" className="ceremony-section" aria-labelledby="ceremony-title">
      <div className="ceremony-icon" aria-hidden="true">♡</div>
      <h2 id="ceremony-title">Milícia da Imaculada</h2>
      <span className="ceremony-label">Cerimônia</span>
      <strong className="ceremony-date">22/01/2028</strong>
      <blockquote>“Super omnia autem haec caritatem, quod est vinculum perfectionis.” <cite>— Colossenses 3:14</cite></blockquote>
      <address>Estrada do Morro Grande, 870, no bairro dos Finco, na região do Riacho Grande</address>
      <a className="ceremony-map-button" href={ceremonyMapsUrl} target="_blank" rel="noopener noreferrer">Abrir com Google Maps</a>
      <WeddingCountdown />
    </section>
    <section id="confirmacao" className="rsvp-section"><div className="section-heading"><span className="eyebrow">Esperamos você</span><h2>Confirme sua presença</h2><p>Preencha os dados para nos ajudar na organização desse dia especial.</p></div><form className="rsvp-form" onSubmit={submitRsvp}><input name="name" placeholder="Seu nome completo" required/><input name="phone" type="tel" placeholder="Telefone com DDD" required/><select name="attending" value={attending?'yes':'no'} onChange={event=>{const willAttend=event.target.value==='yes';setAttending(willAttend);if(!willAttend)setCompanionCount(0)}} required><option value="yes">Sim, estarei presente</option><option value="no">Não poderei comparecer</option></select>{attending&&<label className="companions-field">Quantidade de acompanhantes<input name="companions" type="number" min="0" max="10" value={companionCount} onChange={event=>setCompanionCount(Math.min(10,Math.max(0,Number(event.target.value))))} required/></label>}{attending&&Array.from({length:companionCount},(_,index)=><input className="companion-name" key={index} name={`companion_${index}`} placeholder={`Nome do acompanhante ${index+1}`} required/>)}<button className="primary-action" disabled={loading||!weddingId}>Confirmar presença</button>{rsvpMessage&&<p className="form-message">{rsvpMessage}</p>}</form></section>
    <section id="presentes" className="gift-section"><div className="section-heading"><span className="eyebrow">Escolhidos com carinho</span><h2>Nossa lista de presentes</h2><p>Ao escolher um item, ele fica reservado para evitar presentes duplicados.</p></div>
      {!gifts.length?<div className="empty-gifts">♡<h3>Estamos preparando tudo</h3><p>Nossa lista será divulgada em breve.</p></div>:<div className="gift-grid">{gifts.map(gift=><article className="gift-card" key={gift.id}><div className="gift-image">{gift.image_url?<img src={gift.image_url} alt={gift.name}/>:<span>♢</span>}</div><div className="gift-content"><div className="gift-title-row"><h3>{gift.name}</h3><span className="status-pill">{gift.status==='available'?'Disponível':'Reservado'}</span></div>{gift.description&&<p>{gift.description}</p>}{gift.price!==null&&<strong>{Number(gift.price).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong>}<button className="primary-action" disabled={gift.status!=='available'} onClick={()=>{setSelected(gift);setGiftMessage('')}}>{gift.status==='available'?'Quero presentear':'Já escolhido'}</button></div></article>)}</div>}
      {selected&&selected.status==='available'&&<div className="reservation-overlay"><form className="gift-reservation" onSubmit={reserveGift}><button type="button" className="modal-close" onClick={()=>setSelected(null)}>×</button><span className="eyebrow">Reservar presente</span><h3>{selected.name}</h3><p>Informe seus dados. O item será reservado antes de abrir a loja.</p><input value={guestName} onChange={e=>setGuestName(e.target.value)} placeholder="Seu nome" required/><input value={guestPhone} onChange={e=>setGuestPhone(e.target.value)} type="tel" placeholder="Telefone com DDD" required/><button className="primary-action" disabled={loading}>{loading?'Reservando...':'Reservar e abrir loja'}</button>{giftMessage&&<p className="form-message">{giftMessage}</p>}</form></div>}
      <div className="support-grid">{deliveryAddress&&<div className="support-card"><span>⌂</span><div><small>Endereço de entrega</small><h3>Envie diretamente para nossa casa</h3><p>{deliveryAddress}</p></div></div>}{pix&&<div className="support-card"><span>◇</span><div><small>Contribuição via Pix</small><h3>Lua de Mel</h3><p>Ajude a transformar nossa viagem em lembranças inesquecíveis.</p><strong>(11) 93320-1483</strong></div></div>}{pix&&<div className="support-card"><span>♡</span><div><small>Contribuição via Pix</small><h3>Organização da casa nova</h3><p>Contribua com os primeiros capítulos do nosso novo lar.</p><strong>(11) 93320-1483</strong></div></div>}</div>
    </section>
  </>
}
