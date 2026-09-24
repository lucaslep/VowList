import Link from 'next/link'

const benefits = [
  ['01', 'Sua lista, do seu jeito', 'Escolha os presentes que combinam com a nova vida de vocês.'],
  ['02', 'Um link para compartilhar', 'Envie junto ao convite e deixe tudo simples para os convidados.'],
  ['03', 'Feito com carinho', 'Uma experiência bonita, delicada e fácil de usar em qualquer tela.'],
]

function Brand() {
  return (
    <Link href="/" className="brand" aria-label="VowList — página inicial">
      <span className="brand-mark" aria-hidden="true">V</span><span>VowList</span>
    </Link>
  )
}

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="site-nav" aria-label="Navegação principal">
        <Brand />
        <div className="nav-actions">
          <Link href="/login" className="text-link">Entrar</Link>
          <Link href="/cadastro" className="button button-primary button-small">Criar minha lista</Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow"><span>✦</span> Celebre o amor, compartilhe sonhos</span>
          <h1>O começo da vida a dois merece ser <em>inesquecível.</em></h1>
          <p>Crie uma lista de presentes elegante, pessoal e fácil de compartilhar com quem faz parte da história de vocês.</p>
          <div className="hero-actions">
            <Link href="/cadastro" className="button button-primary">Criar nossa lista <span aria-hidden="true">→</span></Link>
            <a href="#como-funciona" className="button button-ghost">Como funciona</a>
          </div>
          <div className="trust-row">
            <div className="avatar-stack" aria-hidden="true"><span>A</span><span>M</span><span>L</span></div>
            <p><strong>Feito para celebrar</strong><br />cada história de amor</p>
          </div>
        </div>

        <div className="hero-art" aria-label="Prévia de uma lista de casamento elegante">
          <div className="orb orb-one" /><div className="orb orb-two" />
          <div className="invite-card">
            <div className="invite-flourish">⌁</div><span className="invite-kicker">vamos nos casar</span>
            <h2>Lucas <i>&</i> Gabriella</h2><div className="invite-rule"><span>✦</span></div>
            <p>09 · 01 · 2028</p><span className="invite-note">Nossa maior alegria é celebrar com você</span>
          </div>
          <div className="floating-card floating-gift"><span className="floating-icon">♢</span><div><strong>Lista personalizada</strong><small>Escolhida pelo casal</small></div></div>
          <div className="floating-card floating-love"><span>♡</span> Feito com amor</div>
          <div className="botanical botanical-left">❧</div><div className="botanical botanical-right">❧</div>
        </div>
      </section>

      <section id="como-funciona" className="benefits-section">
        <div className="section-heading"><span className="eyebrow">Simples em cada detalhe</span><h2>Tudo para o grande dia</h2><p>Vocês cuidam dos sonhos. A gente deixa a lista linda e organizada.</p></div>
        <div className="benefits-grid">
          {benefits.map(([number, title, description]) => <article key={number} className="benefit-card"><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="final-cta"><span>✦</span><h2>Prontos para começar?</h2><p>Crie agora a lista que vai fazer parte desse capítulo tão especial.</p><Link href="/cadastro" className="button button-light">Criar nossa lista</Link></section>
      <footer className="site-footer"><Brand /><p>Para histórias que começam com “sim”.</p></footer>
    </main>
  )
}
