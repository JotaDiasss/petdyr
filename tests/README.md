# Testes do backend

Execute com MongoDB local disponível em 127.0.0.1:27017:

```powershell
docker start petdyr-mongo
npm test
npm run test:coverage
npx tsc --noEmit
```

O relatório HTML fica em coverage/index.html.

- routes.test.ts: contrato HTTP e erros de infraestrutura simulados nos services.
- app.e2e.test.ts: Express, controllers, services, models e MongoDB reais; CRUD, validação, duplicidade, relacionamentos e persistência após rejeição de alterações.
- date.test.ts: cálculo de idade e limites de datas com relógio controlado.
- database.test.ts: configuração e falhas de conexão, simulando mongoose.connect.
- server.test.ts: ordem de inicialização e encerramento em falha, simulando conexão, porta HTTP e process.exit.

Cada execução de integração usa um banco local petdyr_<UUID>_test exclusivo.
Os índices são inicializados antes dos cenários de duplicidade. Somente os dados
desse banco são limpos entre cenários, e o banco é removido ao final. O .env da
aplicação não é utilizado para escolher o banco de integração.

Falhas de infraestrutura são injetadas para exercitar respostas e encerramento;
esses testes não desligam o Docker e não representam uma simulação de pane de rede.
A cobertura informa os caminhos executados, não prova ausência de todos os bugs.
