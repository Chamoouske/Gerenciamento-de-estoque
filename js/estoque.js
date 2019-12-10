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

// Prepara para ler os registros da tabela Produtos
function listagemView(){
	db.transaction(viewBD, errorDB, successDB);
}

// Função para exibir os produtos
function viewBD(tx){
    tx.executeSql('SELECT * FROM Produtos', [], listarProdutos, errorDB);
}

// Executa se criou o BD com sucesso
function successDB(){}

// Cria a tabela no BD
function createDB(tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS Produtos (id INTEGER PRIMARY KEY, nome VARCHAR(50), qtd INTEGER, preco FLOAT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Compras (id INTEGER PRIMARY KEY, produto VARCHAR(50), valorCompra FLOAT)');
}

// Exibe a tela para inserir produto
function exibirTela(x){
    if(x == 0){
        $("#tela_principal").hide(); // Esconde a tela princiapl
        $("#tela_inserir_produto").show(); // Mostra a tela de insercao de produto
        return;
    }
    if(x == 1){
        $("#tela_principal").hide(); // Esconde a tela princiapl
        $("#tela_listagem_produtos").show(); // Mostra a tela de listagem de produtos
        listagemView();
        return;
    }
    if(x == 2){
        $("#tela_principal").hide(); // Esconde a tela princiapl
        $("#tela_carrinho").show(); // Mostra a tela do carrinho de compras
        return;
    }

    if(x == 3){
        $("#tela_listagem_produtos").hide(); // Esconde a tela listagem produts
        $("#tela_qtd_produto").show();
    }

}

// Fecha a tela de inserir produto e retorna a tela principal
function fecharTela(x){
    if(x == 0){
        $("#tela_principal").show(); // Mostra a tela princiapl
        $("#tela_inserir_produto").hide(); // Esconde a tela de insercao de produto
        return;
    }
    if(x == 1){
        $("#tela_principal").show(); // Mostra a tela princiapl
        $("#tela_listagem_produtos").hide(); // Esconde a tela de listagem de produtos
        return;
    }
    if(x == 2){
        $("#tela_principal").show(); // Mostra a tela princiapl
        $("#tela_carrinho").hide(); // Esconde a tela do carrinho de compras
        return;
    }
}

// Prepara para inserir dados na tabela Produtos
function inserirProduto(){
    db.transaction(estoque_inserirProduto_db, errorDB, successDB);
}

// Insere na os dados na tabela Produtos
function estoque_inserirProduto_db(tx){
    var nome = $("#nome_produto").val();
    var qtd = $("#qtd_estoque").val();
    parseInt(qtd);
    var preco = $("#preco_produto").val();
    parseFloat(preco);

    tx.executeSql('INSERT INTO Produtos (nome, qtd, preco) VALUES ("' + nome + '", ' + qtd + ', ' + preco + ')');
    alert("Produto cadastrado com sucesso!");
    alert( nome + " " + qtd + " " + preco);
    fecharTela(0);
}

// Lista os produtos cadastrados
function listarProdutos(tx, results){
	$("#produtos_listagem").empty();
	var len = results.rows.length;
	for(var i=0;i<len;i++){
		$("#produtos_listagem").append
		("<tr class='produto_item_lista'>" +
		"<td><h3>" + results.rows.item(i).nome + "</h3></td>" +
        "<td><h3>" + results.rows.item(i).qtd + "</h3></td>" +
        "<td><h3>" + results.rows.item(i).preco + "</h3></td>" +
        "<td><input type='button' class='btn btn-lg btn-primary' value='COMPRAR' onclick='exibirTela(3)'></td>"+
        "</tr>");
	}
}

