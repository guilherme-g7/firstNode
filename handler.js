const fs = require("fs");
const {parse} = require("querystring");

var url = require('url');
var path = require('path');
const Carro = require('./src/models/carro/carro_model');

var list = [];

var listaCarros = [];


var readFile = (file) => {
    let html = fs.readFileSync(__dirname + "/views/html/"+file, "utf8");
    return html;
};

var collectData = (method, rq, cal) => {
    var data = '';
    rq.on('data', (chunk) => {
        data += chunk;
    });
    rq.on ('end', () => {
        var parseData = parse(data);
    
        if(method == '/new_carro'){
            var novo_carro;

            novo_carro = new Carro(
                parseData['codigo'], 
                parseData['nome'], 
                parseData['marca'], 
                parseData['modelo'], 
                parseData['preco'], 
                parseData['valor_locacao'],
            );

            console.log(novo_carro);
            listaCarros.push(novo_carro);
            console.log(listaCarros);

        }
        

        cal(parse(data));
    });
}

module.exports = (request, response) => {
    
    if (request.method === 'GET') {
        
        let url_parsed = url.parse(request.url, true);
        switch (url_parsed.pathname) {
            case '/':
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(readFile("index.html"));
                break;
            case '/carros':
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(readFile("carros.html").replace("@$listaCarros@", listaCarros.length));

                break;
            case '/element':
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end("Elemento: " +url_parsed.query.id + " acessado!");

                break;
            default:
                break;
        }
      } else if (request.method === 'POST') {

        switch (request.url.trim()) {
            case '/action':
                collectData('/action', request, (data) => {
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.end("Elemento: " + data.fname + " cadastrado!");
                });    
                break;
    
            case '/new_carro':
                collectData('/new_carro', request, (data) => {
                    //var novo_carro = new Carro(data.codigo);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(readFile("carros.html").replace("@$listaCarros@", listaCarros.length));
                });    
                break;
            default:
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('Not a post action!');
                break;
            

        }
      }
};