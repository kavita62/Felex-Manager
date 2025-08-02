# 🚀 AutoPost AI - Sistema de Gestão de Redes Sociais

Uma aplicação moderna para gestão automatizada de conteúdo em redes sociais, construída com React, Vite, Tailwind CSS e Supabase.

![AutoPost AI](https://img.shields.io/badge/React-18.3.1-blue)
![AutoPost AI](https://img.shields.io/badge/Vite-5.4.19-purple)
![AutoPost AI](https://img.shields.io/badge/Tailwind-3.4.17-cyan)
![AutoPost AI](https://img.shields.io/badge/Supabase-2.53.0-green)

## ✨ Funcionalidades

- **🔐 Autenticação Completa**: Login/registo com email/senha e GitHub OAuth
- **📊 Dashboard Intuitivo**: Interface moderna e responsiva
- **🤖 AI Studio**: Criação e gestão de agentes de IA
- **📅 Calendário de Publicações**: Agendamento e gestão de conteúdo
- **📝 Gestão de Conteúdo**: Organização de posts e mídia
- **📈 Análises**: Métricas e relatórios de desempenho
- **🎨 Design System**: Interface consistente e acessível

## 🛠️ Stack Tecnológica

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Autenticação**: Supabase Auth
- **Base de Dados**: Supabase PostgreSQL
- **Ícones**: Lucide React
- **Estado**: React Context API
- **Deploy**: Vercel

## 🚀 Instalação e Configuração

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/autopost-ai.git
cd autopost-ai
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_projeto_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📦 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Constrói para produção
npm run lint         # Executa o linter
npm run preview      # Pré-visualiza a build de produção
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── auth/          # Autenticação (LoginPage, etc.)
│   ├── ui/            # Componentes UI reutilizáveis
│   ├── sections/      # Seções principais da aplicação
│   │   ├── aiStudio/  # AI Studio components
│   │   ├── youtube/   # YouTube integration
│   │   └── ...        # Outras seções
│   └── modals/        # Modais da aplicação
├── contexts/          # React Contexts (AuthContext)
├── lib/              # Configurações (Supabase)
├── data/             # Dados mock
└── index.tsx         # Entry point
```

## 🎨 Design System

A aplicação utiliza Tailwind CSS com um design system consistente:
- **Cores**: Tons de cinza e índigo
- **Tipografia**: Sistema de fontes responsivo
- **Componentes**: Reutilizáveis e acessíveis
- **Animações**: Transições suaves e feedback visual

## 🔒 Autenticação

O sistema de autenticação inclui:
- ✅ Login/registo com email e senha
- ✅ Login social (GitHub)
- ✅ Gestão automática de sessões
- ✅ Proteção de rotas
- ✅ Logout funcional

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 🖥️ Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## 🚀 Deploy no Vercel

### 1. Conectar ao Vercel
1. Aceda a [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Importe este repositório

### 2. Configurar Variáveis de Ambiente
No dashboard do Vercel, adicione as variáveis:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Deploy Automático
O Vercel fará deploy automático a cada push para a branch `main`

## 🔧 Configuração do Supabase

Siga as instruções detalhadas em [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se tiver dúvidas ou problemas, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ usando React, Vite e Supabase**
