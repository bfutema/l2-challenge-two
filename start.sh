#!/bin/sh

echo "⏳ Aguardando banco de dados ficar disponível..."

# Aguardar o banco de dados ficar disponível
until pg_isready -h postgres -p 5432 -U chaves_user -d chaves_db; do
  echo "Aguardando PostgreSQL..."
  sleep 2
done

echo "✅ Banco de dados disponível!"

echo "🌱 Executando seed..."
yarn seed

if [ $? -eq 0 ]; then
  echo "✅ Seed executado com sucesso!"
else
  echo "❌ Erro ao executar seed, mas continuando..."
fi

echo "🚀 Iniciando aplicação..."
yarn start:prod
