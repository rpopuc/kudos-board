# Kudos Board

Node application for creating and displaying Kudos card panels.

## Setup

Primeiro, é necessário definir os arquivos de configuração a partir dos arquivos de exemplo:

```bash
cp .env.example .env
cp docker-compose.override.example.yml docker-compose.override.yml
```

Para rodar aplicação docker rode:

```bash
docker compose up -d
```

Para desenvolvimento entre no container app e rode:

```bash
docker compose exec app bash
```

```bash
npm install
```

```bash
npm run dev
```

Para buildar a aplicação entre no container e rode:

```bash
docker compose exec app bash
```

```bash
npm run build
```
