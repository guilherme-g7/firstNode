module.exports = class UsuarioModel{

    constructor(nome, sobrenome, cnh, data_nascimento, telefone, email, endereco){
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cnh = cnh;
        this.data_nascimento = data_nascimento;
        this.telefone = telefone;
        this.email = email;
        this.endereco = endereco;
    }
}