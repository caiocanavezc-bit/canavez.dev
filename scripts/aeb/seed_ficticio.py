"""Popula um banco SQLite TEMPORÁRIO do AEB Transporte com dados fictícios para os prints do portfólio.

Rodar com o Python do venv da cópia exportada (sem .env), de dentro dela:
    .venv/Scripts/python <canavez.dev>/scripts/aeb/seed_ficticio.py

Usa a própria API do AEB via TestClient, então as validações do app valem.
Nenhum nome, CPF ou coordenada real: todos os alunos têm o sobrenome "Exemplo".
"""
import os
import sys
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path


sys.path.insert(0, os.getcwd())

if Path(".env").exists():
    sys.exit("ABORTAR: existe .env nesta pasta; rode a partir da cópia exportada com git archive.")
for var in ("TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"):
    if os.environ.get(var):
        sys.exit(f"ABORTAR: {var} definida no ambiente.")

import database  # noqa: E402

database._get_turso_config = lambda: (None, None)  # mesma blindagem do conftest.py do AEB

tmp = Path(tempfile.gettempdir()).resolve()
if tmp not in Path(database.DB_PATH).resolve().parents:
    sys.exit(f"ABORTAR: banco fora da pasta temporária: {database.DB_PATH}")

from fastapi.testclient import TestClient  # noqa: E402

import app as aeb  # noqa: E402

ADMIN_SENHA = os.environ["ADMIN_PASSWORD"]
SENHA_DEMO = "Demo-Portfolio-2026!"


def cpf_com_digitos(base9: str) -> str:
    """Completa 9 dígitos inventados com os dígitos verificadores, para passar no is_valid_cpf."""
    nums = [int(c) for c in base9]
    for peso_inicial in (10, 11):
        soma = sum(n * p for n, p in zip(nums, range(peso_inicial, 1, -1)))
        resto = (soma * 10) % 11
        nums.append(0 if resto == 10 else resto)
    return "".join(map(str, nums))


ALUNOS = [
    ("Ana Exemplo", "FACEX"), ("Bruno Exemplo", "UNIDEMO"), ("Carla Exemplo", "FACEX"),
    ("Diego Exemplo", "FACEX"), ("Elisa Exemplo", "UNIDEMO"), ("Felipe Exemplo", "FACEX"),
    ("Gabriela Exemplo", "UNIDEMO"), ("Henrique Exemplo", "FACEX"), ("Isabela Exemplo", "FACEX"),
    ("João Exemplo", "UNIDEMO"), ("Larissa Exemplo", "FACEX"), ("Marcos Exemplo", "UNIDEMO"),
    ("Natália Exemplo", "FACEX"), ("Otávio Exemplo", "FACEX"), ("Paula Exemplo", "UNIDEMO"),
    ("Rafael Exemplo", "FACEX"), ("Sofia Exemplo", "UNIDEMO"), ("Tiago Exemplo", "FACEX"),
]
PONTOS = ["Praça Central", "Rodoviária", "Avenida Principal", "Escola Estadual", "Terminal Norte"]


def ok(resp):
    if resp.status_code >= 400:
        sys.exit(f"Falha {resp.request.method} {resp.request.url}: {resp.status_code} {resp.text[:300]}")
    return resp.json()


def main():
    database.init_db()
    with TestClient(aeb.app) as c:
        token = ok(c.post("/api/auth/login", json={"login": "admin", "senha": ADMIN_SENHA}))["access_token"]
        c.headers["Authorization"] = f"Bearer {token}"

        ok(c.post("/api/faculdades", json={"id": "FACEX", "nome": "Faculdade Exemplo", "cor": "#1D9BF0"}))
        ok(c.post("/api/faculdades", json={"id": "UNIDEMO", "nome": "Universidade Demo", "cor": "#7856FF"}))

        guia = ok(c.post("/api/auth/usuarios", json={
            "cpf": cpf_com_digitos("900000001"), "nome": "Guia Demo", "senha": SENHA_DEMO, "papel": "guia"}))
        motorista = ok(c.post("/api/auth/usuarios", json={
            "cpf": cpf_com_digitos("900000002"), "nome": "Motorista Demo", "senha": SENHA_DEMO, "papel": "motorista"}))

        rota = ok(c.post("/api/rotas", json={
            "nome": "Rota Demo · Noite",
            "representante_id": guia.get("id"),
            "motorista_id": motorista.get("id"),
            "faculdade_ids": ["FACEX", "UNIDEMO"],
        }))
        rota_id = rota.get("id")

        hoje = datetime.now(timezone(timedelta(hours=-3))).date().isoformat()
        idx = 0
        for sentido in ("ida", "volta"):
            for nome_ponto in PONTOS:
                ponto = ok(c.post("/api/stops", json={"rota": sentido, "rota_id": rota_id, "nome": nome_ponto}))
                for _ in range(2 if sentido == "ida" else 1):
                    nome, fac = ALUNOS[idx % len(ALUNOS)]
                    idx += 1
                    aluno = ok(c.post("/api/students", json={"ponto_id": ponto["id"], "nome": nome, "faculdade_id": fac}))
                    if sentido == "ida" and idx % 5 != 0:  # ~80% marcados na ida, para a tela parecer em uso
                        ok(c.post("/api/attendance/toggle", json={
                            "data": hoje, "rota": sentido, "rota_id": rota_id, "aluno_id": aluno["id"], "presente": True}))
    print(f"ok: banco fictício em {database.DB_PATH} (rota_id={rota_id})")


if __name__ == "__main__":
    main()
