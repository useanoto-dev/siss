# Finance AI — Instruções para o Claude

## Cérebro do Projeto (Obsidian)

**SEMPRE** ao iniciar uma sessão, leia o arquivo de contexto:

```
C:\Users\dubli\Documents\Siss\meu novo cerebro\00 - Finance AI\🧠 Contexto Atual.md
```

Esse arquivo contém:
- Onde paramos na última sessão
- Estado atual de cada módulo
- Pendências e próximos passos
- Decisões técnicas já tomadas

## Ao Encerrar / Ao Fazer Progresso Significativo

Atualize o arquivo `🧠 Contexto Atual.md` com:
1. O que foi feito
2. Estado atual atualizado
3. Próximo passo claro

E crie/atualize o log da sessão em:
```
C:\Users\dubli\Documents\Siss\meu novo cerebro\00 - Finance AI\Sessões\YYYY-MM-DD.md
```

## Stack do Projeto

- **Next.js 14** (App Router)
- **Clerk** — autenticação
- **Prisma + PostgreSQL (Neon)** — banco de dados
- **OpenAI** — relatórios com IA
- **Stripe** — assinaturas (plano gratuito + premium)
- **Vercel** — deploy

## Regras

- Não sugerir trocar stack sem o usuário pedir
- Sempre considerar se mudanças afetam o modelo de assinatura (free vs premium)
- Manter o Obsidian atualizado em tempo real conforme avançamos
