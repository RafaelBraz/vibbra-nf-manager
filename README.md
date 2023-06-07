# Informações do projeto

**Nome do projeto:** Controle de NF Freelancer

**Cliente:** Vibbraneo

**Prazo de entrega:** 10 dias úteis

<br />

# Estimativas de horas

### Estrutura de dados da aplicação: **3 horas**

- Arquitetura do banco de dados (BD) - 1h
  - Integração com PlanetScale (serviço de BD na nuvem)
  - Modelagem do banco de dados
- Implementar API do BD - 2h

### Agendamento de tarefas: **2 horas**

- Integração com Inngest (serviço de agendamento de tarefas) - 2h

### Envio de email/sms: **3 horas**

- Integração com MailerSend (serviço de envio de email/sms) - 1h
- Implementar API de envio de email - 1h
- Implementar API de envio de sms - 1h

### Cadastro/Login: **5 horas**

- Cadastro via Google/Facebook/Email - 2h30
  - Integração com serviço next-auth (serviço de autenticação)
  - Integração com API do BD
- Login via Google/Facebook/Email - 2h30
  - Integração com serviço next-auth
  - Integração com API do BD

### Tela Principal: **7 horas**

- Integração com API do BD - 1h
- Dashboard de visualização - 6h
  - Filtragem dos dados
  - Criação de gráficos de análise
  - Estilização dos gráficos

### Menu de preferências: **7 horas**

- Empresas parceiras - 2h
  - Desenvolvimento do formulário de cadastro
  - Desenvolvimento do formulário de edição
- Categorias de despesas - 3h
  - Desenvolvimento do formulário de cadastro
  - Desenvolvimento do formulário de edição/exclusão
- Limite de faturamento do MEI - 1h
  - Desenvolvimento do formulário de edição
- Alertas de faturamento - 1h
  - Desenvolvimento do formulário de ativação

### Lançar notas fiscais: **2 horas**

- Desenvolvimento do formulário de cadastro - 1h
- Desenvolvimento do formulário de edição/exclusão - 1h

### Lançar despesas: **2 horas**

- Desenvolvimento do formulário de cadastro - 1h
- Desenvolvimento do formulário de edição/exclusão - 1h

### Notificação de faturamento: **6 horas**

- Notificação mensal de limite - 3h
- Alerta de proximidade de desenquadramento - 3h

### Total de horas trabalhadas: **37 horas**

<br />

# Missões

## 1. Escopo

O escopo está simples e objetivo. Porém, abaixo estão alguns pontos que podem surgir como dúvida sobre o projeto:

1. O faturamento anual é contabilizado em relação ao mês de competência ou ao mês de faturamento de uma NF?
2. O projeto não trabalha com casos de MEI que acabou de ser criado (nesse caso, é usado o modelo de faturamento proporcional no primeiro ano).

Esses dois casos foram resolvidos com algumas pesquisas sobre o MEI.

## 2. Estimativa de horas [(visualizar)](#estimativas-de-horas)

## 3. Prazo de entrega

"Prazo de entrega" em [(Informações do projeto)](#informações-do-projeto)

## 4. Log de atividades

- [x] Avaliação de escopo do projeto (03/06/2023 - 10h00 à 03/06/2023 - 10h30)
- [x] Estimativa de horas de desenvolvimento (03/06/2023 - 11h00 à 03/06/2023 - 12h45)
- [x] Escolha de tecnologias (03/06/2023 - 11h00 à 03/06/2023 - 12h45)
- [x] Estimativa de dias (03/06/2023 - 12h45 à 03/06/2023 - 12h50)
- [x] Definição de entidades do sistema (03/06/2023 - 14h20 à 03/06/2023 - 14h30)
- [x] Definição de tasks (03/06/2023 - 14h30 à 03/06/2023 - 15h00)
- [x] Inicialização do projeto (03/06/2023 - 15h05 à 03/06/2023 - 15h15)
- [x] Modelagem das entidades no Prisma (03/06/2023 - 15h25 à 03/06/2023 - 15h45)
- [x] Integração Next Api route + Prisma (03/06/2023 - 15h45 à 03/06/2023 - 16h45)
- [x] Usuário: CRUD (03/06/2023 - 17h00 à 03/06/2023 - 17h40 + 03/06/2023 - 18h30 à 03/06/2023 - 19h30)
- [x] Empresa Parceira: CRUD (03/06/2023 - 19h30 à 03/06/2023 - 19h50 + 03/06/2023 - 23h10 à 03/06/2023 - 23h50)
- [x] Nota fiscal: CRUD (04/06/2023 - 20h10 à 04/06/2023 - 20h50)
- [x] Categoria: CRUD (05/06/2023 - 09h50 à 05/06/2023 - 10h20)
- [x] Expense: CRUD (05/06/2023 - 10h25 à 05/06/2023 - 10h55)
- [x] Login & Cadastro (next-auth) (05/06/2023 - 11h30 à 05/06/2023 - 12h50 + 05/06/2023 - 13h30 à 05/06/2023 - 16h25)
- [x] Menu de preferências (06/06/2023 - 10h10 à 06/06/2023 - 12h00 + 06/06/2023 - 19h30 à 06/06/2023 - 21h25)
- [x] Lista/Lançar/Atualizar/Deletar Nota Fiscal (07/06/2023 - 09h15 à 07/06/2023 - 11h20)
- [x] Refactoring: Empresas parceiras (useSWR) (07/06/2023 - 11h20 à 07/06/2023 - 11h40)
- [x] Refactoring: Categorias (useSWR) (07/06/2023 - 11h20 à 07/06/2023 - 11h40)
- [x] Refactoring: Atualizar preferências (atualiza next-auth session) (07/06/2023 - 11h20 à 07/06/2023 - 11h40)
