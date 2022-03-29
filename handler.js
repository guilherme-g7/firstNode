const fs = require("fs");
const { parse } = require("querystring");

var url = require('url');
var path = require('path');
const Carro = require('./src/models/carro/carro_model');
const CnhModel = require("./src/models/cnh/cnh_model");
const TelefoneModel = require("./src/models/telefone/telefone_model");
const EnderecoModel = require("./src/models/endereco/endereco_model");
const UsuarioModel = require("./src/models/usuario/usuario_model");

var listaCarros = [];
var listaUsuarios = [];

var listaLocacao = [];

const encode = (object) => JSON.stringify(Object.entries(object))
const decode = (string, T) => {
    const object = new T()
    JSON.parse(string).map(([key, value]) => (object[key] = value))
    return object
}

var readFile = (file) => {
    let html = fs.readFileSync(__dirname + "/views/html/" + file, "utf8");
    return html;
};


var collectData = (method, rq, cal) => {
    var data = '';
    rq.on('data', (chunk) => {
        data += chunk;
    });
    rq.on('end', () => {
        var parseData = parse(data);

        if (method === '/new_carro') {
            var novo_carro;

            novo_carro = new Carro(
                parseData['codigo'],
                parseData['nome'],
                parseData['marca'],
                parseData['modelo'],
                parseData['preco'],
                parseData['valor_locacao'],
            );

            listaCarros.push(novo_carro);           

        }

        if (method === '/new_usuario') {
            var novo_usuario;
            var novo_endereco;
            var novo_telefone;
            var nova_cnh;

            nova_cnh = new CnhModel(
                parseData['numero_cnh'], 
                parseData['classe_cnh']
            );

            novo_telefone = new TelefoneModel(
                parseData['ddd_telefone'], 
                parseData['num_telefone']
            );

            novo_endereco = new EnderecoModel(
                parseData['rua_endereco'], 
                parseData['complemento_endereco'], 
                parseData['cep_endereco'],
                parseData['cidade_endereco'],
                parseData['estado_endereco']
            );

    
            novo_usuario = new UsuarioModel(
                parseData['nome'],
                parseData['sobrenome'],
                decode(encode(nova_cnh), CnhModel),
                parseData['data_nascimento'],
                decode(encode(novo_telefone), TelefoneModel),
                parseData['email'],
                decode(encode(novo_endereco), EnderecoModel)
            );

            listaUsuarios.push(novo_usuario);
        }


        cal(parse(data));
    });
}

module.exports = (request, response) => {

    if (request.method === 'GET') {

        let url_parsed = url.parse(request.url, true);
        switch (url_parsed.pathname) {
            case '/':
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(readFile("index.html"));
                break;
            case '/carros':
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(readFile("carros/carros.html").replace("@$listaCarros@", listaCarros.length));

                break;

            case '/usuarios':
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(readFile("usuarios/usuarios.html").replace("@$listaUsuarios@", listaUsuarios.length));

                break;

            case '/locacao':
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(readFile("locacao/locacao.html").replace("@$listaLocacao@", listaLocacao.length));

                break;
            case '/element':
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end("Elemento: " + url_parsed.query.id + " acessado!");

                break;
            default:
                break;
        }
    } else if (request.method === 'POST') {

        switch (request.url.trim()) {
            case '/action':
                collectData('/action', request, (data) => {
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.end("Elemento: " + data.fname + " cadastrado!");
                });
                break;

            case '/new_carro':
                collectData('/new_carro', request, (data) => {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(readFile("carros/new_carro.html").replace("@$listaCarros@", listaCarros.length).replace("@$nome@", listaCarros.nome));
                });
                break;

            case '/new_usuario':
                collectData('/new_usuario', request, (data) => {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(readFile("usuarios/new_usuario.html").replace("@$listaUsuarios@", listaUsuarios.length));
                });
                break;
            default:
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('Not a post action!');
                break;


        }
    }
};