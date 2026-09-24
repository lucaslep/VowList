'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NovoPresentePage() {
  const supabase = createClient()
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [productUrl, setProductUrl] = useState('')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage('Você precisa estar logado.')
      setLoading(false)
      return
    }

    const { data: wedding, error: weddingError } =
      await supabase
        .from('weddings')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle()

    if (weddingError || !wedding) {
      setMessage('Casamento não encontrado.')
      setLoading(false)
      return
    }

    const numericPrice =
      price.trim() === ''
        ? null
        : Number(price.replace(',', '.'))

    if (
      numericPrice !== null &&
      Number.isNaN(numericPrice)
    ) {
      setMessage('Digite um preço válido.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('gifts')
      .insert({
        wedding_id: wedding.id,
        name,
        description: description || null,
        price: numericPrice,
        image_url: imageUrl || null,
        product_url: productUrl || null,
        status: 'available',
      })

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
        <Link
          href="/dashboard/presentes"
          className="back-link"
        >
          ← Voltar para presentes
        </Link>

        <h1 className="app-title mt-4">
          Adicionar presente 🎁
        </h1>

        <p className="mt-2 text-neutral-500">
          Adicione um novo item à lista do casamento.
        </p>

        <form
          onSubmit={handleSubmit}
          className="app-card app-card-pad mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nome do presente
            </label>

            <input
              type="text"
              placeholder="Ex: Air Fryer 5L"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Descrição
            </label>

            <textarea
              placeholder="Ex: Air Fryer preta, 5 litros..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Preço
            </label>

            <input
              type="text"
              inputMode="decimal"
              placeholder="499,90"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              URL da imagem
            </label>

            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Link da loja
            </label>

            <input
              type="url"
              placeholder="https://..."
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-action w-full disabled:opacity-60"
          >
            {loading
              ? 'Adicionando...'
              : 'Adicionar presente'}
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
