module.exports = class EnderecoModel{

    constructor(rua, complemento, cep, cidade, estado){
        this.rua = rua;
        this.complemento = complemento;
        this.cep = cep;
        this.cidade = cidade;
        this.estado = estado;
    }
}