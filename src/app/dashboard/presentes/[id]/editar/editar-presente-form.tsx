'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Gift = {
  id: string
  name: string
  description: string | null
  price: number | string | null
  image_url: string | null
  product_url: string | null
}

type EditarPresenteFormProps = {
  gift: Gift
  weddingId: string
}

export default function EditarPresenteForm({
  gift,
  weddingId,
}: EditarPresenteFormProps) {
  const supabase = createClient()
  const router = useRouter()

  const [name, setName] = useState(gift.name)
  const [description, setDescription] = useState(gift.description ?? '')
  const [price, setPrice] = useState(
    gift.price === null ? '' : String(gift.price).replace('.', ',')
  )
  const [imageUrl, setImageUrl] = useState(gift.image_url ?? '')
  const [productUrl, setProductUrl] = useState(gift.product_url ?? '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const numericPrice =
      price.trim() === '' ? null : Number(price.replace(',', '.'))

    if (numericPrice !== null && Number.isNaN(numericPrice)) {
      setMessage('Digite um preço válido.')
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: ownedWedding } = await supabase
      .from('weddings')
      .select('id')
      .eq('id', weddingId)
      .eq('owner_id', user.id)
      .maybeSingle()

    if (!ownedWedding) {
      setMessage('Casamento não encontrado.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('gifts')
      .update({
        name: name.trim(),
        description: description.trim() || null,
        price: numericPrice,
        image_url: imageUrl.trim() || null,
        product_url: productUrl.trim() || null,
      })
      .eq('id', gift.id)
      .eq('wedding_id', weddingId)

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/presentes')
    router.refresh()
  }

  return (
    <main className="app-page">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard/presentes" className="back-link">
          ← Voltar para presentes
        </Link>

        <h1 className="app-title mt-4">Alterar presente</h1>

        <p className="mt-2 text-neutral-500">
          Atualize as informações exibidas na lista do casamento.
        </p>

        <form
          onSubmit={handleSubmit}
          className="app-card app-card-pad mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="name">
              Nome do presente
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="description"
            >
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="price">
              Preço
            </label>
            <input
              id="price"
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="imageUrl"
            >
              URL da imagem
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="productUrl"
            >
              Link da loja
            </label>
            <input
              id="productUrl"
              type="url"
              value={productUrl}
              onChange={(event) => setProductUrl(event.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-action w-full disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>

          {message && (
            <p className="rounded-xl bg-neutral-100 p-3 text-sm text-neutral-700">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}
