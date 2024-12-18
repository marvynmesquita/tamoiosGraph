const express = require('express');
const neo4j = require('neo4j-driver');
const env = require('dotenv').config();

const driver = neo4j.driver(env.parsed.NEO4J_URI, neo4j.auth.basic(env.parsed.NEO4J_USERNAME, env.parsed.NEO4J_PASSWORD));

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
            'MATCH (p:Ponto)-[:PERTENCE_A]->(b:Bairro) RETURN p,b '
        );
        res.json(result.records.map(record => ({ ponto: record._fields[0].properties, bairro: record._fields[1].properties })));    
    });

    app.get('/pontos/:nome', async (req, res) => {
        const session = driver.session();
        const nome = req.params.nome;
        const result = await session.run(
            'MATCH (l:Linha {nome: $nome})-[:PASSA_POR]->(p:Ponto)-[:PERTENCE_A]->(b:Bairro) RETURN p,b',
            { nome: nome }
        );
        res.json(result.records.map(record => ({ ponto: record._fields[0].properties, bairro: record._fields[1].properties })));
    });

    app.get('/horarios/:nome', async (req, res) => {
        const session = driver.session();
        const nome = req.params.nome;
        const result = await session.run(
            'MATCH(l:Linha) where l.nome = "'+ nome +'"  RETURN l'
        );
        res.json(result.records.map(record => record._fields[0].properties.horarios));
    })

    app.get('/etinerario/:nome', async (req, res) => {
        const session = driver.session();
        const nome = req.params.nome;
        const result = await session.run(
            'MATCH(l:Linha)-[:PERCORRE]->(b:Bairro) where l.nome = "'+ nome +'"  RETURN b'
        );
        res.json(result.records.map(record => record._fields[0].properties));
    })

    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
        return ('Conectado ao banco de dados');
    });
}
init();