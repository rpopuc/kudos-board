# Todo

## Última ação

- [x] Verificar criação de usuário pelo endpoint
- [-] [CHORE] Ajustar os registros do inversify
- [x] Verificar segurança da senha do usuário
- [>] Login do usuário
    - [x] Montar estrutura do use case, controller e rota
    - [x] Efetuar login
    - [x] Gerar JWT
    - [x] Autorização JWT
    - [x] Configurar o secret por env
    - [x] Configurar o TTL por env
    - [x] Colocar os middlewares em todas as rotas de Panel
    - [ ] Colocar os middlewares em todas as rotas de Kudos
    - [ ] Revisar os testes para esses cenários
- [ ] Revisar arquitetura de UserData entre Controller + UseCase + Repository
- [ ] Revisar testes lentos
- [ ] Melhorar imagem do app para retirar ttty
- [ ] Verificar se o Kudos pertence ao Painel
- [ ] Verificar se o Painel pertence ao usuário

## Tarefas

- [x] Criar repository para User
- [x] Documentar a API
- [x] Adicionar mock da API
    - [x] Criar script para geração da documentação: `npm run build-swagger`
    - [x] Fornecer mock para frontend
- [ ] Adicionar registro de usuários
- [ ] Remover arquivo swagger.json do repositório
- [ ] Criar um arquivo de rotas só para o swagger docs
- [ ] Organizar pastas
    - Application
    - Domain
    - UI
- [ ] Adicionar autenticação via JWT
- [ ] Revisar contrato da API
    - Revisar todos os endpoints e analisar se são suficientes para o frontend montar a aplicação
- [ ] Revisar testes
- [ ] Revisar APIs em face das últimas considerações de como a aplicação deve funcionar
- [ ] Preparar imagem da aplicação para produção
    - [ ] Script para geração da imagem
    - [ ] Script na pipeline para geração da imagem e registro no github
- [ ] Verificar vulnerabilidades das dependências do Node
- [ ] Refatorar uso do inversify
- [ ] Criar rotas de administração
    - [ ] Listagem de usuários
    - [ ] Exclusão de usuários

----

- atualizar controllers Delete e Update para passar user id via header

- MongoRepository

- chore: Fazer testes para Mongo

- Listagem de Kudos
- Criacão de Kudos
- Edicão de Kudos
- Exclusão de Kudos
- Visualizacão de Kudos

- Frontend

- Exportar para arquivo PDF
- Exportar para arquivo jpeg
- Exportar para arquivo csv

- Exportar para arquivo PDF
- Exportar para arquivo jpeg
- Exportar para arquivo csv
