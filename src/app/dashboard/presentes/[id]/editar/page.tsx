import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditarPresenteForm from './editar-presente-form'

type EditarPresentePageProps = {
  params: Promise<{ id: string }>
}

export default async function EditarPresentePage({
  params,
}: EditarPresentePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!wedding) {
    redirect('/dashboard')
  }

  const { data: gift } = await supabase
    .from('gifts')
    .select('id, name, description, price, image_url, product_url')
    .eq('id', id)
    .eq('wedding_id', wedding.id)
    .maybeSingle()

  if (!gift) {
    notFound()
  }

  return <EditarPresenteForm gift={gift} weddingId={wedding.id} />
}
