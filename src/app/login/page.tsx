'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient(); const router = useRouter()
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [message,setMessage]=useState(''); const [loading,setLoading]=useState(false)
  async function handleLogin(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setMessage('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error){setMessage(error.message);setLoading(false);return}router.push('/dashboard');router.refresh()}
  return <main className="auth-page">
    <aside className="auth-visual"><Link href="/" className="brand"><span className="brand-mark">V</span><span>VowList</span></Link><div className="auth-quote"><span>✦</span><h2>O amor mora nos pequenos detalhes.</h2><p>Organize os sonhos da vida a dois em uma lista tão especial quanto a história de vocês.</p></div></aside>
    <section className="auth-form-side"><div className="auth-form"><span className="app-kicker">Bem-vindos de volta</span><h1>Entrar</h1><p>Acesse e continue preparando esse momento especial.</p><form onSubmit={handleLogin}><div className="field"><label htmlFor="email">E-mail</label><input id="email" type="email" placeholder="voce@email.com" value={email} onChange={e=>setEmail(e.target.value)} required /></div><div className="field"><label htmlFor="password">Senha</label><input id="password" type="password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} required /></div><button type="submit" disabled={loading} className="primary-action w-full disabled:cursor-not-allowed disabled:opacity-60">{loading?'Entrando...':'Entrar na minha lista'}</button></form>{message&&<p className="form-message" role="alert">{message}</p>}<p className="auth-switch">Ainda não possui uma conta? <Link href="/cadastro">Criar conta</Link></p></div></section>
  </main>
}
