#!/bin/bash

# Script para testar os endpoints da API da Escola do Chaves
# Porta padrão: 3000 (pode ser alterada via variável de ambiente PORT)

# Configurações
BASE_URL="http://localhost:3000"
API_BASE="${BASE_URL}/school"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testando endpoints da API da Escola do Chaves${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Função para testar endpoint
test_endpoint() {
    local endpoint_name="$1"
    local endpoint_url="$2"
    local description="$3"

    echo -e "${YELLOW}📋 Testando: ${endpoint_name}${NC}"
    echo -e "${YELLOW}   Descrição: ${description}${NC}"
    echo -e "${YELLOW}   URL: ${endpoint_url}${NC}"
    echo ""

    # Executar curl com formatação JSON
    response=$(curl -s -w "\n%{http_code}" "${endpoint_url}")

    # Separar resposta e código HTTP
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')

    # Verificar se a requisição foi bem-sucedida
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ Status: ${http_code} (OK)${NC}"
        echo -e "${GREEN}📄 Resposta:${NC}"
        # Tentar formatar com jq se disponível, senão mostrar como está
        if command -v jq >/dev/null 2>&1; then
            echo "$response_body" | jq . 2>/dev/null || echo "$response_body"
        else
            echo "$response_body"
        fi
    else
        echo -e "${RED}❌ Status: ${http_code} (Erro)${NC}"
        echo -e "${RED}📄 Resposta:${NC}"
        echo "$response_body"
    fi

    echo ""
    echo -e "${BLUE}----------------------------------------${NC}"
    echo ""
}

# Verificar se o servidor está rodando
echo -e "${YELLOW}🔍 Verificando se o servidor está rodando...${NC}"
if curl -s --connect-timeout 5 "${BASE_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor está rodando em ${BASE_URL}${NC}"
    echo ""
else
    echo -e "${RED}❌ Servidor não está rodando em ${BASE_URL}${NC}"
    echo -e "${YELLOW}💡 Certifique-se de que a aplicação está rodando antes de executar os testes${NC}"
    echo -e "${YELLOW}   Execute: npm run start:dev ou yarn start:dev${NC}"
    exit 1
fi

# Testar endpoint 1: Teacher Hours
test_endpoint \
    "Teacher Hours" \
    "${API_BASE}/teacher-hours" \
    "Retorna as horas de trabalho dos professores"

# Testar endpoint 2: Room Schedules
test_endpoint \
    "Room Schedules" \
    "${API_BASE}/room-schedules" \
    "Retorna os horários das salas de aula"

echo -e "${GREEN}🎉 Testes concluídos!${NC}"
echo ""
echo -e "${BLUE}📚 Documentação da API disponível em: ${BASE_URL}/api${NC}"
echo -e "${BLUE}🔗 Swagger UI: ${BASE_URL}/api${NC}"
