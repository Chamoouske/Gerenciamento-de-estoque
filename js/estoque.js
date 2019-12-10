app.initialize();

// Cria um bando de dados
var db = window.openDatabase("Database", "1.0", "Controle_Estoque", 2000);
db.transaction(createDB, errorDB, successDB);
// Quando o objeto documento "escuta" que est� pronto executa a fun��o onDeviceReady
document.addEventListener("deviceready", onDeviceReady, false);

// Cria a tabela no banco de dados
function onDeviceReady(){
    db.transaction(createDB, errorDB, successDB);
}

// Trata erro de criacao do BD
function errorDB(err){
    alert("Erro: " + err);
}

// Executa se criou o BD com sucesso
function successDB(){}

// Cria a tabela no BD
function createDB(tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS Produtos (id INTEGER PRIMARY KEY, nome VARCHAR(50), qtd INTEGER, preco FLOAT)');
}

// Exibe a tela para inserir produto
function exibirTela(x){
    if(x == 0){
        $("#tela_principal").hide(); // Esconde a tela princiapl
        $("#tela_inserir_produto").show(); // Mostra a tela de insercao de produto
    }else if(x == 1){
        $("#tela_principal").hide(); // Esconde a tela princiapl
    }else if(x == 2){
        $("#tela_principal").hide(); // Esconde a tela princiapl
    }
}

// Fecha a tela de inserir produto e retorna a tela principal
function fecharTela(x){
    if(x == 0){
        $("#tela_principal").show(); // Mostra a tela princiapl
        $("#tela_inserir_produto").hide(); // Esconde a tela de insercao de produto
    }else if(x == 1){
        $("#tela_principal").show(); // Mostra a tela princiapl
    }else if(x == 2){
        $("#tela_principal").show(); // Mostra a tela princiapl
    }
}