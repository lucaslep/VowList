'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function CadastroPage(){
  const supabase=createClient();const [name,setName]=useState('');const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [message,setMessage]=useState('');const [loading,setLoading]=useState(false)
  async function handleSignUp(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setMessage('');const {error}=await supabase.auth.signUp({email,password,options:{data:{name}}});if(error){setMessage(error.message);setLoading(false);return}setMessage('Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.');setName('');setEmail('');setPassword('');setLoading(false)}
  return <main className="auth-page">
    <aside className="auth-visual"><Link href="/" className="brand"><span className="brand-mark">V</span><span>VowList</span></Link><div className="auth-quote"><span>✦</span><h2>Um novo capítulo começa aqui.</h2><p>Crie uma experiência bonita para vocês e inesquecível para seus convidados.</p></div></aside>
    <section className="auth-form-side"><div className="auth-form"><span className="app-kicker">Comecem por aqui</span><h1>Criar conta</h1><p>Em poucos minutos, a lista de vocês estará pronta.</p><form onSubmit={handleSignUp}><div className="field"><label htmlFor="name">Seu nome</label><input id="name" type="text" placeholder="Como podemos chamar você?" value={name} onChange={e=>setName(e.target.value)} required /></div><div className="field"><label htmlFor="email">E-mail</label><input id="email" type="email" placeholder="voce@email.com" value={email} onChange={e=>setEmail(e.target.value)} required /></div><div className="field"><label htmlFor="password">Senha</label><input id="password" type="password" placeholder="Mínimo de 6 caracteres" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required /></div><button type="submit" disabled={loading} className="primary-action w-full disabled:cursor-not-allowed disabled:opacity-60">{loading?'Criando conta...':'Criar nossa lista'}</button></form>{message&&<p className="form-message" role="status">{message}</p>}<p className="auth-switch">Já possui uma conta? <Link href="/login">Entrar</Link></p></div></section>
  </main>
}
