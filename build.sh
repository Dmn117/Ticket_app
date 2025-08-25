#!/bin/bash

#! Activate Desktop Mode: Fails if there are errors and displays commands
set -e

#? Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[1;34m'
NC='\033[0m'

#? Error handler
trap 'echo -e "${RED}❌ Error during execution. Review previous messages.${NC}"' ERR


#? Steps

echo -e "${BLUE}🧹 Deleting dist folder...${NC}"
rm -rf ./dist


echo -e "${BLUE}📦 Transpiling Typescript to Javascript...${NC}"
tsc


echo -e "${BLUE}🔑 Copying keys...${NC}"
cp ./src/private.pem ./dist
cp ./src/public.pem ./dist


echo -e "${BLUE}📚 Copying documentation...${NC}"
cp -r ./src/documentation ./dist


echo -e "${BLUE}🗂️ Copying assets folder...${NC}"
cp -r ./src/shared/assets ./dist/shared/


echo -e "${BLUE}🌐 Copying public folder...${NC}"
cp -r ./src/shared/public ./dist/shared/


echo -e "${BLUE}📝 Copying templates folder...${NC}"
cp -r ./src/shared/templates ./dist/shared/


echo -e "${GREEN}✅ Build was successfully completed.${NC}"