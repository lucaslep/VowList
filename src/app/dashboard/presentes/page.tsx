import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PresentesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id, partner_one, partner_two')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!wedding) {
    redirect('/dashboard')
  }

  const { data: gifts } = await supabase
    .from('gifts')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', {
      ascending: false,
    })

  return (
    <main className="app-page">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="back-link"
            >
              ← Voltar para o dashboard
            </Link>

            <h1 className="app-title mt-3">
              Presentes
            </h1>

            <p className="mt-1 text-neutral-500">
              Lista de {wedding.partner_one} & {wedding.partner_two}
            </p>
          </div>

          <Link
            href="/dashboard/presentes/novo"
            className="primary-action"
          >
            + Adicionar presente
          </Link>
        </header>

        {!gifts || gifts.length === 0 ? (
          <section className="app-card mt-10 border-dashed p-12 text-center">
            <div className="text-5xl">
              🎁
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Sua lista está vazia
            </h2>

            <p className="mx-auto mt-2 max-w-md text-neutral-500">
              Adicione seu primeiro presente para começar a montar sua lista.
            </p>

            <Link
              href="/dashboard/presentes/novo"
              className="primary-action mt-6"
            >
              Adicionar primeiro presente
            </Link>
          </section>
        ) : (
          <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gifts.map((gift) => (
              <article
                key={gift.id}
                className="app-card overflow-hidden"
              >
                <div className="aspect-[4/3] bg-neutral-100">
                  {gift.image_url ? (
                    <img
                      src={gift.image_url}
                      alt={gift.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      🎁
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold">
                      {gift.name}
                    </h2>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs">
                      {gift.status === 'available'
                        ? 'Disponível'
                        : gift.status === 'reserved'
                          ? 'Reservado'
                          : 'Comprado'}
                    </span>
                  </div>

                  {gift.price !== null && (
                    <p className="mt-3 text-xl font-bold">
                      {Number(gift.price).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  )}

                  {gift.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-neutral-500">
                      {gift.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
