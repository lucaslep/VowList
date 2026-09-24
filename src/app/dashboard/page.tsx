import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle()

  return (
    <main className="app-page">
      <div className="mx-auto max-w-5xl">
        <div className="app-topbar">
          <div>
            <p className="app-kicker">
              Painel do casal
            </p>

            <h1 className="app-title">
              VowList
            </h1>
          </div>

          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="secondary-action"
            >
              Sair
            </button>
          </form>
        </div>

        <section className="mt-10">
          {!wedding ? (
            <div className="app-card app-card-pad">
              <div className="max-w-xl">
                <p className="text-4xl">💍</p>

                <h2 className="mt-4 text-2xl font-bold text-neutral-900">
                  Crie sua página de casamento
                </h2>

                <p className="mt-3 text-neutral-500">
                  Cadastre os nomes do casal, a data do casamento e crie
                  sua lista de presentes.
                </p>

                <Link
                  href="/dashboard/casamento/novo"
                  className="primary-action mt-6"
                >
                  Criar meu casamento
                </Link>
              </div>
            </div>
          ) : (
            <div className="app-card app-card-pad">
              <p className="text-sm font-medium text-neutral-500">
                Seu casamento
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {wedding.partner_one} & {wedding.partner_two}
              </h2>

              {wedding.wedding_date && (
                <p className="mt-2 text-neutral-500">
                  Data: {wedding.wedding_date}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/presentes"
                  className="primary-action"
                >
                  Gerenciar presentes
                </Link>

                <Link
                  href={`/casamento/${wedding.slug}`}
                  className="secondary-action"
                >
                  Ver página pública
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
