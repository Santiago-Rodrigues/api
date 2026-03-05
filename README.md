# Backend - API de Usuários

API RESTful desenvolvida em **Node.js + Express** para gerenciamento de usuários, com autenticação JWT e banco de dados PostgreSQL.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript para backend
- **Express** 5.2.1 - Framework web minimalista
- **Sequelize** 6.37.7 - ORM (Object-Relational Mapping) para Node.js
- **PostgreSQL** - Banco de dados relacional
- **JWT** (jsonwebtoken) 9.0.3 - Autenticação por tokens
- **bcrypt** 6.0.0 - Criptografia de senhas
- **CORS** 2.8.6 - Cross-Origin Resource Sharing
- **dotenv** 17.3.1 - Variáveis de ambiente

## 📋 Pré-requisitos

- Node.js 16.0.0 ou superior
- npm 7.0.0 ou superior
- PostgreSQL 12.0 ou superior
- Sequelize CLI instalado globalmente (opcional)

## 🗄️ Configuração do Banco de Dados

### 1. Criar banco de dados PostgreSQL

```bash
# Acesse o PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE usersdb;

# Confirme a criação
\l
```

### 2. Configurar conexão

O banco de dados está configurado em `src/config/database.js`. Verifique os dados de conexão:

```javascript
{
  dialect: "postgres",
  host: "localhost",
  username: "postgres",      // Seu usuário PostgreSQL
  password: "postgres",       // Sua senha PostgreSQL
  database: "usersdb",       // Nome do banco
}
```

### 3. Executar migrations

Para criar as tabelas no banco:

```bash
# Se tiver sequelize-cli global
sequelize db:migrate

# Ou usando npx
npx sequelize-cli db:migrate
```

## 📦 Instalação

1. Navegue até a pasta do projeto:

```bash
cd api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env` (já fornecido com JWT_SECRET):

```
JWT_SECRET="546f8c1d6a26050040c36fce632a80ec2715bc8adb78f20755899a999d8afd79"
```

## 🎯 Rodando o Projeto

### Desenvolvimento (com auto-reload)

```bash
node --watch src/server.js
```

O servidor iniciará em `http://localhost:3000`

### Produção

```bash
node src/server.js
```

## 📡 Endpoints da API

### Rotas Públicas (sem autenticação)

#### 1. **Cadastro de Usuário**

```
POST /cadastro
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}

Resposta (201):
{
  "id": "uuid-aqui",
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "hash-bcrypt",
  "createdAt": "2026-03-05T10:30:00Z",
  "updatedAt": "2026-03-05T10:30:00Z"
}
```

#### 2. **Login**

```
POST /login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}

Resposta (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Rotas Protegidas (requer token JWT)

Para acessar estas rotas, adicione o header:

```
Authorization: Bearer <seu_token_jwt>
```

#### 3. **Listar Todos os Usuários**

```
GET /usuarios/todos
Authorization: Bearer <token>

Resposta (200):
[
  {
    "email": "joao@email.com",
    "name": "João Silva"
  }
]
```

#### 4. **Deletar Usuário**

```
DELETE /usuarios/deletar/{id}
Authorization: Bearer <token>

Resposta (200):
{
  "message": "Deu bom"
}
```

## 🔐 Autenticação

O projeto utiliza **JWT (JSON Web Tokens)**:

1. Usuário realiza login e recebe um token
2. O token deve ser enviado em todas as requisições protegidas no header:
   ```
   Authorization: Bearer <token>
   ```
3. O middleware `auth.js` valida o token antes de processar a requisição

## 📁 Estrutura do Projeto

```
src/
├── server.js                  # Arquivo principal da aplicação
├── config/
│   └── database.js            # Configuração do Sequelize e PostgreSQL
├── controllers/
│   └── userController.js      # Lógica de negócio (CRUD de usuários)
├── models/
│   └── User.js                # Definição do modelo de usuário
├── routes/
│   ├── publicRoutes.js        # Rotas sem autenticação
│   └── privateRoutes.js       # Rotas protegidas por JWT
├── middlewares/
│   └── auth.js                # Middleware de autenticação JWT
└── database/
    └── migrations/            # Migrations do Sequelize
        └── 20260303133725-create-users-table.js
```

## 🗄️ Modelo de Dados

### Tabela: `users`

| Campo      | Tipo      | Descrição                            |
| ---------- | --------- | ------------------------------------ |
| id         | UUID      | Identificador único (chave primária) |
| name       | STRING    | Nome do usuário                      |
| email      | STRING    | Email único do usuário               |
| password   | STRING    | Senha criptografada com bcrypt       |
| created_at | TIMESTAMP | Data de criação                      |
| updated_at | TIMESTAMP | Data da última atualização           |

## 🔄 Fluxo de Autenticação

1. **Cadastro**: Usuário envia nome, email e senha
   - Senha é criptografada com bcrypt (salt 10)
   - Usuário é salvo no banco de dados

2. **Login**: Usuário envia email e senha
   - Email é verificado no banco
   - Senha é comparada com o hash armazenado
   - JWT é gerado e retornado

3. **Requisições Protegidas**: Cliente envia o token no header
   - Middleware valida o token
   - Requisição prossegue com o ID do usuário disponível

## 🐛 Troubleshooting

### Erro: "Banco não conectado"

- Verifique se PostgreSQL está rodando
- Confirme as credenciais em `src/config/database.js`
- Certifique-se de que o banco `usersdb` existe

### Erro: "Migrations não rodaram"

```bash
npx sequelize-cli db:migrate
```

### Token inválido

- Verifique se o token está sendo enviado corretamente no header
- Tokens expiram? Implemente um sistema de refresh token

### CORS erros

- Certifique-se de que `cors()` está configurado em `server.js`
- Se precisar restringir origem: `cors({ origin: 'http://localhost:5173' })`

## 📝 Exemplo de Uso Completo

### 1. Cadastrar usuário:

```bash
curl -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@test.com","password":"123456"}'
```

### 2. Fazer login:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","password":"123456"}'
```

### 3. Listar usuários (com token):

```bash
curl -X GET http://localhost:3000/usuarios/todos \
  -H "Authorization: Bearer seu_token_aqui"
```

## 🔧 Variáveis de Ambiente

Arquivo `.env`:

```
JWT_SECRET="seu_secret_jwt_aqui"
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=usersdb
```

## 🔄 Próximos Passos

- Implementar refresh tokens
- Adicionar validação de entrada com mais rigor
- Implementar testes unitários e de integração
- Adicionar rate limiting
- Implementar soft delete para usuários
- Adicionar logs estruturados
- Criar documentação Swagger/OpenAPI
