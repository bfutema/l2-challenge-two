# Sistema de Gestão Escolar - API REST

API REST desenvolvida em NestJS para gerenciamento de informações escolares, incluindo professores, salas de aula e horários. Sistema completo com banco de dados PostgreSQL, testes unitários e e2e, e documentação de endpoints.

## 🎯 Objetivo do Projeto

Este projeto demonstra habilidades em desenvolvimento backend com foco em:
- Arquitetura de APIs RESTful
- Integração com banco de dados PostgreSQL
- Testes automatizados (unitários e e2e)
- Containerização com Docker
- Documentação técnica
- Boas práticas de desenvolvimento

## 🏗️ Estrutura do Banco de Dados

### Entidades Principais:
- **departments** - Departamentos da escola
- **titles** - Títulos dos professores
- **teachers** - Professores
- **buildings** - Prédios da escola
- **rooms** - Salas de aula
- **subjects** - Matérias
- **classes** - Turmas
- **class_schedules** - Horários das aulas
- **subject_prerequisites** - Pré-requisitos das matérias

## 🚀 Como Executar

### Opção 1: Docker Compose (Recomendado) 🐳

**Simples e rápido!** Execute apenas:

```bash
docker compose up
```

Isso irá:
- ✅ Subir o banco PostgreSQL automaticamente
- ✅ Executar o seed para popular os dados
- ✅ Iniciar a aplicação NestJS
- ✅ Disponibilizar a API em `http://localhost:3000`

**Para parar:**
```bash
docker compose down
```

### Opção 2: Desenvolvimento Local 💻

Se preferir rodar localmente:

#### 1. Instalar Dependências
```bash
yarn install
```

#### 2. Configurar Banco de Dados
Certifique-se de que o PostgreSQL está rodando e configure as variáveis de ambiente no arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=chaves_user
DB_PASSWORD=chaves_password
DB_NAME=chaves_db
NODE_ENV=development
```

#### 3. Executar Seed (Popular Banco de Dados)
```bash
yarn seed
```

#### 4. Iniciar Aplicação
```bash
yarn start:dev
```

A aplicação estará disponível em: `http://localhost:3000`

## 🚀 Comandos Úteis

```bash
# Executar testes unitários
yarn test

# Executar testes e2e
yarn test:e2e

# Executar todos os testes
yarn test && yarn test:e2e

# Verificar cobertura de testes
yarn test:cov

# Linting do código
yarn lint

# Formatação do código
yarn format

# Build da aplicação
yarn build

# Seed do banco de dados
yarn seed
```

## 📊 Endpoints Disponíveis

### 1. Horários dos Professores
**GET** `/school/teacher-hours`

Retorna a quantidade de horas que cada professor tem comprometido em aulas.

**Exemplo de Resposta:**
```json
[
  {
    "teacher_id": 1,
    "teacher_name": "Professor 1",
    "total_classes": 2,
    "total_hours": 4.0
  },
  {
    "teacher_id": 2,
    "teacher_name": "Professor 2",
    "total_classes": 2,
    "total_hours": 4.0
  }
]
```

### 2. Horários das Salas
**GET** `/school/room-schedules`

Retorna a lista de salas com horários livres e ocupados.

**Exemplo de Resposta:**
```json
[
  {
    "room_id": 1,
    "room_name": "Sala 1",
    "building_name": "Prédio A - Ciências Exatas",
    "occupied_schedules": [
      {
        "day_of_week": 1,
        "start_time": "08:00",
        "end_time": "10:00",
        "subject": "Álgebra Linear",
        "class_code": "MAT101-2024-1"
      }
    ],
    "free_schedules": [
      {
        "day_of_week": 1,
        "time_slot": "10:00"
      },
      {
        "day_of_week": 2,
        "time_slot": "08:00"
      }
    ]
  }
]
```

## 🎯 Funcionalidades

### Consulta SQL para Horários dos Professores
A consulta calcula:
- Total de aulas por professor
- Total de horas por professor (convertendo tempo em horas)
- Ordenação por ID do professor

### Sistema de Horários das Salas
- **Horários Ocupados**: Mostra quando e por qual matéria a sala está sendo usada
- **Horários Livres**: Calcula automaticamente os horários disponíveis
- **Horário de Funcionamento**: 8h às 18h, segunda a sexta-feira
- **Slots de Tempo**: 2 horas por slot (8h-10h, 10h-12h, 14h-16h, 16h-18h)

## 📝 Dados de Exemplo (Seed)

O seed cria:
- 8 departamentos (Matemática, Física, Química, etc.)
- 4 títulos de professores
- 8 professores distribuídos pelos departamentos
- 4 prédios
- 8 salas distribuídas pelos prédios
- 10 matérias
- 10 turmas
- 13 horários de aula
- 2 pré-requisitos entre matérias

## 🛠️ Stack Tecnológica

- **NestJS** - Framework Node.js para aplicações escaláveis
- **TypeORM** - ORM para banco de dados com TypeScript
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Linguagem de programação tipada
- **Docker** - Containerização da aplicação
- **Jest** - Framework de testes unitários e e2e
- **Supertest** - Testes de integração HTTP

## 🧪 Testes

O projeto inclui uma suíte completa de testes:

### Testes Unitários
```bash
yarn test
```
- **17 testes** cobrindo services e controllers
- Mocks para repositórios TypeORM
- Cobertura de casos de sucesso, erro e edge cases

### Testes E2E
```bash
yarn test:e2e
```
- **10 testes** validando endpoints GET
- Testes de integração com banco de dados real
- Validação de estruturas de dados e lógica de negócio

## 🏆 Características Técnicas

- ✅ **Arquitetura limpa** com separação de responsabilidades
- ✅ **TypeScript** para type safety e melhor DX
- ✅ **Docker** para ambiente de desenvolvimento consistente
- ✅ **Testes abrangentes** (unitários + e2e)
- ✅ **Documentação completa** de endpoints
- ✅ **Seed de dados** para demonstração
- ✅ **Configuração de ambiente** flexível
- ✅ **Código bem estruturado** seguindo boas práticas
