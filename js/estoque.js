app.initialize();

// Cria um bando de dados
var db = window.openDatabase("Database", "1.0", "Controle_Estoque", 2000);
db.transaction(createDB, errorDB, successDB);
// Quando o objeto documento "escuta" que est� pronto executa a fun��o onDeviceReady
document.addEventListener("deviceready", onDeviceReady, false);

// Cria a tabela no banco de dados
function onDeviceReady() {
    db.transaction(createDB, errorDB, successDB);
}

// Trata erro de criacao do BD
function errorDB(err) {
    alert("Erro: " + err);
}

// Prepara para ler os registros da tabela Produtos
function listagemView() {
    db.transaction(viewBD, errorDB, successDB);
}

// Função para exibir os produtos
function viewBD(tx) {
    tx.executeSql('SELECT * FROM Produtos', [], listarProdutos, errorDB);
}

// Executa se criou o BD com sucesso
function successDB() { }

// Cria a tabela no BD
function createDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Produtos (id INTEGER PRIMARY KEY, nome VARCHAR(50), qtd INTEGER, preco FLOAT)'); // cria a tabela se não existir 
    tx.executeSql('CREATE TABLE IF NOT EXISTS Compras (id INTEGER PRIMARY KEY, produto VARCHAR(50), qtd INTEGER, valorCompra FLOAT)'); // cria a tabela se não existir
}

// Exibe a tela para inserir produto
function exibirTela(x) {
    if (x == 0) {
        $("#tela_principal").hide(); // Esconde a tela princiapl
        $("#tela_inserir_produto").show(); // Mostra a tela de insercao de produto
        return;
    }
    if (x == 1) {
        $("#tela_principal").hide(); // Esconde a tela princiapl
        $("#tela_listagem_produtos").show(); // Mostra a tela de listagem de produtos
        listagemView();
        return;
    }
    if (x == 2) {
        $("#tela_principal").hide(); // Esconde a tela princiapl
        $("#tela_carrinho").show(); // Mostra a tela do carrinho de compras
        carrinhoView();
        return;
    }

    if (x == 3) {
        $("#tela_listagem_produtos").hide(); // Esconde a tela listagem produts
        $("#tela_qtd_produto").show(); // Exibe a tela de finalizar a compra
        return;
    }

    if(x==4) {
        $("#tela_principal").hide(); // Esconde a tela princiapl
        $("#tela_desenvolvedores").show(); // Esconde a tela princiapl
    }

}

// Fecha a tela de inserir produto e retorna a tela principal
function fecharTela() {
    $("#tela_principal").show(); // Mostra a tela princiapl
    $("#tela_inserir_produto").hide(); // Esconde a tela de insercao de produto
    $("#tela_listagem_produtos").hide(); // Esconde a tela de listagem de produtos
    $("#tela_carrinho").hide(); // Esconde a tela do carrinho de compras
    $("#tela_qtd_produto").hide(); // Esconde a tela do carrinho de compras
    $("#tela_desenvolvedores").hide();  
}

// Prepara para inserir dados na tabela Produtos
function inserirProduto() {
    db.transaction(estoque_inserirProduto_db, errorDB, successDB);
}

// Insere na os dados na tabela Produtos
function estoque_inserirProduto_db(tx) {
    var nome = $("#nome_produto").val();
    var qtd = $("#qtd_estoque").val();
    parseInt(qtd);
    var preco = $("#preco_produto").val();
    parseFloat(preco);

    tx.executeSql('INSERT INTO Produtos (nome, qtd, preco) VALUES ("' + nome + '", ' + qtd + ', ' + preco + ')');
    alert("Produto cadastrado com sucesso!");

    // LIMPA OS CAMPOS
    $("#nome_produto").val("");
    $("#qtd_estoque").val("");
    $("#preco_produto").val("");

    parseFloat(preco);
    fecharTela(0);
}

// Lista os produtos cadastrados
function listarProdutos(tx, results) {
    $("#produtos_listagem").empty();
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        $("#produtos_listagem").append
            ("<tr class='produto_item_lista'>" +
                "<td><h3>" + results.rows.item(i).nome + "</h3></td>" +
                "<td><h3>" + results.rows.item(i).qtd + "</h3></td>" +
                "<td><h3>" + results.rows.item(i).preco + "</h3></td>" +
                "<td><input type='button' class='btn btn-primary' value='COMPRAR' onclick='prepFinalizarCompra(" + results.rows.item(i).id + ")'></td>" +
            "</tr>");
    }
}

function prepFinalizarCompra(idCompra){
    idCompra = idCompra - 1;
    $("#id_deCompra").val(idCompra); // Salva o id do item escolhida pra compra em uma variavel escondida no html
    //alert(idCompra);
    db.transaction(efetuarCompra, errorDB, successDB);
}

// Prepara pra ir pra tela de finalizar compra
function efetuarCompra(tx){
    tx.executeSql('SELECT * FROM Produtos', [], finalizarCompra, errorDB, successDB);
}

// Finaliza a compra
function finalizarCompra(tx, results){
    var idProduto = $("#id_deCompra").val();
    var nome = results.rows.item(idProduto).nome;
    var qtd = results.rows.item(idProduto).qtd
    var preco = results.rows.item(idProduto).preco

    exibirTela(3); // exibe a tela de finalizar compra

    $("#nomeProduto").val(nome); // Manda a variavel nome para o campo de nome
    $("#qtdProduto").val(qtd); // Manda a variavel de qtd estoque para o campo referente
    $("#precoProduto").val(preco); // Manda a variavel preco para o campo referente
}

// Prepara para realizar a compra
function comprarProduto(){
    db.transaction(comprarProdutoDB, errorDB, successDB);
}

// Insere na tabela Compras o pedido do cliente e atualiza o estoque da tabela Produtos
function comprarProdutoDB(tx){
    var idProduto = parseInt($("#id_deCompra").val()) + 1; // usa o +1 pois o js trabalha vetor iniciando em 0, e o SQLite inicia os id em 1
    var qtd = $("#qtdProduto").val();
    var nome = $("#nomeProduto").val();
    var pedido = $("#pedido").val();
    var total = $("#precoProduto").val();
    parseInt(idProduto);
    parseInt(pedido);
    parseFloat(total); 
    total *= pedido; // Calcula o montante a pagar na compra 

    tx.executeSql('INSERT INTO Compras (produto, qtd, valorCompra) VALUES ("' + nome + '", ' + pedido + ', ' + total + ')');
    tx.executeSql('UPDATE Produtos SET qtd = ' + (qtd - pedido) + ' WHERE id =' + idProduto); // Atualiza o estoque do produto desejado
    $("#pedido").val("");
    alert("Produto adicionado ao carrinho de compras");
    fecharTela();
}

function carrinhoView(){
    db.transaction(carrinhoCompras, errorDB, successDB);
}

function carrinhoCompras(tx){
    tx.executeSql('SELECT * FROM Compras', [], carrinhoComprasDB, errorDB);
}

function carrinhoComprasDB(tx, results){
    $("#carrinho_compras").empty();
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        $("#carrinho_compras").append
            ("<tr class='produto_item_lista'>" +
                "<td><h3>" + results.rows.item(i).produto + "</h3></td>" +
                "<td><h3>" + results.rows.item(i).qtd + "</h3></td>" +
                "<td><h3>" + results.rows.item(i).valorCompra + "</h3></td>" +
            "</tr>");
    }
}

function compraRealizada(){
    db.transaction(compraRealizadaDB, errorDB, successDB);
}

function compraRealizadaDB(tx){
    tx.executeSql('DELETE FROM Compras');
    alert("Obrigado por comprar conosco!");

    fecharTela();
}