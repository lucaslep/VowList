# VowList

VowList é uma aplicação web para criação e gerenciamento de listas de presentes de casamento.

O projeto permite que o casal crie uma página personalizada, cadastre presentes e compartilhe a lista com amigos e familiares através de um link público.

---

## Funcionalidades

- Cadastro e login de usuários
- Autenticação com Supabase
- Criação de página do casamento
- Nome dos noivos
- Data do casamento
- Mensagem personalizada para os convidados
- URL personalizada para cada casal
- Cadastro de presentes
- Preço do presente
- Descrição
- Imagem
- Link da loja
- Status do presente
- Página pública da lista
- Dashboard para gerenciamento
- Controle de acesso utilizando Row Level Security

---

## Tecnologias utilizadas

Este projeto foi desenvolvido com:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Vercel

---

## Arquitetura

A aplicação utiliza Next.js para o frontend e backend da aplicação.

O Supabase é responsável por:

- autenticação
- banco de dados PostgreSQL
- controle de acesso
- armazenamento dos dados

Fluxo principal:

```text
Usuário
   ↓
Next.js
   ↓
Supabase Auth
   ↓
PostgreSQL
```

---

## Roadmap

Funcionalidades implementadas:

- [x] Cadastro de usuários
- [x] Login
- [x] Integração com Supabase
- [x] Criação de casamento
- [x] Dashboard
- [x] Cadastro de presentes
- [x] Edição de presentes
- [x] Exclusão de presentes
- [x] Página pública do casamento
- [x] Reserva de presentes
- [x] Mensagem dos convidados
- [x] Upload de imagens
- [x] QR Code da lista
- [x] Indicador de progresso da lista
- [x] Filtro por faixa de preço
- [x] Layout responsivo
- [x] Deploy na Vercel

---

## Objetivo do projeto

O VowList foi criado como um projeto full-stack para praticar conceitos de desenvolvimento web moderno, incluindo:

autenticação
banco de dados relacional
controle de acesso
Server Components
integração frontend/backend
desenvolvimento de produto
experiência do usuário
deploy de aplicações web

Além de servir como projeto de portfólio, a aplicação foi pensada para poder ser utilizada em um casamento real.

---

## Como executar o projeto

Clone o repositório:
git clone SEU_REPOSITORIO

Entre na pasta:
cd wedding-gift-list

Instale as dependências:
npm install

Crie um arquivo:
.env.local

Adicione as variáveis do Supabase:
NEXT_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA_DO_SUPABASE

Depois execute:
npm run dev

Abra:
http://localhost:3000
