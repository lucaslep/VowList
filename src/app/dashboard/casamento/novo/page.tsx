'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NovoCasamentoPage() {
  const supabase = createClient()
  const router = useRouter()

  const [partnerOne, setPartnerOne] = useState('')
  const [partnerTwo, setPartnerTwo] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [description, setDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function handlePartnerChange(
    field: 'one' | 'two',
    value: string
  ) {
    if (field === 'one') {
      setPartnerOne(value)

      const newSlug = generateSlug(
        `${value}-e-${partnerTwo}`
      )

      setSlug(newSlug)
    }

    if (field === 'two') {
      setPartnerTwo(value)

      const newSlug = generateSlug(
        `${partnerOne}-e-${value}`
      )

      setSlug(newSlug)
    }
  }

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
      setMessage('Usuário não autenticado.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('weddings')
      .insert({
        owner_id: user.id,
        partner_one: partnerOne,
        partner_two: partnerTwo,
        wedding_date: weddingDate || null,
        description,
        slug,
      })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="app-page">
      <div className="mx-auto max-w-2xl">
        <div>
          <p className="app-kicker">
            Configuração inicial
          </p>

          <h1 className="app-title">
            Crie seu casamento 💍
          </h1>

          <p className="mt-2 text-neutral-500">
            Essas informações aparecerão na sua página pública.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="app-card app-card-pad mt-8 space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Primeiro nome
              </label>

              <input
                type="text"
                value={partnerOne}
                onChange={(e) =>
                  handlePartnerChange('one', e.target.value)
                }
                placeholder="Ana"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Segundo nome
              </label>

              <input
                type="text"
                value={partnerTwo}
                onChange={(e) =>
                  handlePartnerChange('two', e.target.value)
                }
                placeholder="Pedro"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Data do casamento
            </label>

            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Mensagem para os convidados
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Estamos muito felizes em compartilhar esse momento com vocês..."
              rows={4}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Link da página
            </label>

            <div className="flex rounded-xl border border-neutral-300">
              <span className="flex items-center bg-neutral-100 px-3 text-sm text-neutral-500">
                /casamento/
              </span>

              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(generateSlug(e.target.value))
                }
                placeholder="ana-e-pedro"
                className="w-full rounded-r-xl px-4 py-3 outline-none"
                required
              />
            </div>

            <p className="mt-2 text-xs text-neutral-500">
              Exemplo: /casamento/ana-e-pedro
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-action w-full disabled:opacity-60"
          >
            {loading ? 'Criando...' : 'Criar casamento'}
          </button>

          {message && (
            <p className="rounded-xl bg-neutral-100 p-3 text-sm">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}
