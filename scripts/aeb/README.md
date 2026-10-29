# Prints do AEB Transporte (dados fictícios)

Os prints do case saem de uma **cópia local** do AEB rodando com um banco SQLite **temporário** populado só com dados inventados. Nenhum dado real de aluno, motorista ou responsável pode aparecer.

## Por que a cópia exportada

O `database.py` do AEB lê `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` do arquivo `.env` quando as variáveis não estão no ambiente. Rodar a partir do repositório original poderia escrever no banco de produção. O `git archive` exporta só arquivos versionados, então a cópia nunca tem `.env`. O `seed_ficticio.py` ainda aborta se encontrar um `.env`, uma variável `TURSO_*` ou um banco fora da pasta temporária.

## Passo a passo (Git Bash, Windows)

```bash
T="$(cygpath -u "$TEMP")/aeb-capturas"; rm -rf "$T"; mkdir -p "$T/app"
git -C /d/aeb-transporte archive HEAD | tar -x -C "$T/app"
test ! -e "$T/app/.env" || { echo "ABORTAR: .env na cópia"; exit 1; }

cd "$T/app"
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt pymupdf httpx

export ENVIRONMENT=development
export SQLITE_DB_PATH="$(cygpath -w "$T")\aeb.db"
export ADMIN_PASSWORD="Demo-Portfolio-2026!"
export JWT_SECRET="jwt-local-capturas-portfolio-0123456789abcdef"
unset TURSO_DATABASE_URL TURSO_AUTH_TOKEN

.venv/Scripts/python /d/canavez.dev/scripts/aeb/seed_ficticio.py   # popula o banco temporário
.venv/Scripts/python -m uvicorn app:app --port 8765 &               # sobe o AEB local

cd /d/canavez.dev
AEB_PYTHON="$(cygpath -w "$T")\app\.venv\Scripts\python.exe" node scripts/aeb/capturar.mjs
```

Depois, pare o servidor e **abra cada imagem em `public/projetos/aeb-transporte/`** para conferir que só aparecem nomes com o sobrenome "Exemplo".

## O que é gerado

| Arquivo | Tela | Quem está logado |
|---|---|---|
| `capa.webp`, `thumb.webp`, `chamada.webp` | Controle de embarque com as paradas abertas | Representante "Guia Demo" |
| `rotas.webp` | Gerenciamento de rotas | Administrador |
| `pdf.webp` | Página 1 do relatório de embarque (PDF) | Administrador |
| `celular.webp` | Paradas no celular (390px) | Representante "Guia Demo" |
