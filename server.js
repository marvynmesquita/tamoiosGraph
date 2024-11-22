const express = require('express');
const neo4j = require('neo4j-driver');
const env = require('dotenv').config();

const uri = env.parsed.NEO4J_URI;
const username = env.parsed.NEO4J_USERNAME;
const password = env.parsed.NEO4J_PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

const init = async () => {
    
    const app = express();

    app.get('/linhas', async (req, res) => {
        const session = driver.session();
        const result = await session.run(
            'MATCH (n:Linha) RETURN n '
        );
        res.json(result.records.map(record => record._fields[0].properties));
    });

    app.get('/linhas/:id', async (req, res) => {
        const session = driver.session();
        const result = await session.run(
            'MATCH (n:Linha {id: $id}) RETURN n',
            { id: req.params.id }
        );
        res.json(result.records.map(record => record._fields[0].properties));
    });

    app.get('/bairros', async (req, res) => {
        const session = driver.session();
        const result = await session.run(
            'MATCH (n:Bairro) RETURN n '
        );
        res.json(result.records.map(record => record._fields[0].properties));
    });

    app.get('/pontos', async (req, res) => {
        const session = driver.session();
        const result = await session.run(
            'MATCH (n:Ponto) RETURN n '
        );
        res.json(result.records.map(record => record._fields[0].properties));
    });

    app.get('/horarios/:nome', async (req, res) => {
        const session = driver.session();
        const nome = req.params.nome;
        const result = await session.run(
            'MATCH(l:Linha) where l.nome = "'+ nome +'"  RETURN l'
        );
        console.log(result.records.map(record => record._fields[0].properties.horarios), req.params.nome);
        res.json(result.records.map(record => record._fields[0].properties.horarios));
    })

    app.listen(80, () => {
        console.log('Servidor rodando na porta 3000');
        return ('Conectado ao banco de dados');
    });
}
init();