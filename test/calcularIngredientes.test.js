import assert from 'node:assert';
import {
    interpretarIngrediente,
    normalizarNome,
    somarIngredientes,
    calcularFaltantes
} from '../source/calcularIngredientes.js';

describe('Ingredientes do SmartPantry (com forEach e Mocha)', function () {

    // ---------- interpretarIngrediente ----------

    it('Caso 1: Deve ler quantidade, unidade e nome de "500 g arroz"', function () {
        const linha = "500 g arroz";

        const resultadoObtido = interpretarIngrediente(linha);

        assert.equal(resultadoObtido.q, 500);
        assert.equal(resultadoObtido.u, "g");
        assert.equal(resultadoObtido.n, "arroz");
    });

    it('Caso 2: Deve aceitar vírgula como separador decimal em "1,5 kg batata"', function () {
        const linha = "1,5 kg batata";

        const resultadoObtido = interpretarIngrediente(linha);

        assert.equal(resultadoObtido.q, 1.5);
        assert.equal(resultadoObtido.u, "kg");
    });

    it('Caso 3: Deve converter a fração de "1/2 kg arroz" em 0.5', function () {
        const linha = "1/2 kg arroz";
        const quantidadeEsperada = 1 / 2; // 0.5

        const resultadoObtido = interpretarIngrediente(linha);

        assert.equal(resultadoObtido.q, quantidadeEsperada);
        assert.equal(resultadoObtido.n, "arroz");
    });

    it('Caso 4: Deve usar a unidade "un" quando a linha não tem unidade, como em "2 ovos"', function () {
        const linha = "2 ovos";

        const resultadoObtido = interpretarIngrediente(linha);

        assert.equal(resultadoObtido.q, 2);
        assert.equal(resultadoObtido.u, "un");
        assert.equal(resultadoObtido.n, "ovos");
    });

    it('Caso 5: Deve reconhecer a unidade no plural em "2 colheres açúcar"', function () {
        const linha = "2 colheres açúcar";
        const unidadeEsperada = "colher";

        const resultadoObtido = interpretarIngrediente(linha);

        assert.equal(resultadoObtido.u, unidadeEsperada);
        assert.equal(resultadoObtido.n, "açúcar");
    });

    it('Caso 6: Deve usar a linha inteira como nome, com 1 un, quando não há número ("sal a gosto")', function () {
        const linha = "sal a gosto";

        const resultadoObtido = interpretarIngrediente(linha);

        assert.equal(resultadoObtido.n, "sal a gosto");
        assert.equal(resultadoObtido.q, 1);
        assert.equal(resultadoObtido.u, "un");
    });

    // ---------- normalizarNome ----------

    it('Caso 7: Deve ignorar maiúsculas e espaços extras em "  Tomate "', function () {
        const nomeEsperado = "tomate";

        const resultadoObtido = normalizarNome("  Tomate ");

        assert.equal(resultadoObtido, nomeEsperado);
    });

    it('Caso 8: Deve ignorar acentos em "Maçã"', function () {
        const nomeEsperado = "maca";

        const resultadoObtido = normalizarNome("Maçã");

        assert.equal(resultadoObtido, nomeEsperado);
    });

    it('Caso 9: Deve tratar "ovos" e "ovo" como o mesmo nome', function () {
        const nomePlural = normalizarNome("ovos");
        const nomeSingular = normalizarNome("ovo");

        assert.equal(nomePlural, "ovo");
        assert.equal(nomePlural, nomeSingular);
    });

    // ---------- somarIngredientes ----------

    it('Caso 10: Deve somar a quantidade de ingredientes com mesmo nome e unidade', function () {
        const ingredientes = [
            { n: "arroz", q: 200, u: "g" },
            { n: "Arroz", q: 300, u: "g" }
        ];
        const quantidadeEsperada = 200 + 300; // 500

        const resultadoObtido = somarIngredientes(ingredientes);

        assert.equal(resultadoObtido.length, 1);
        assert.equal(resultadoObtido[0].q, quantidadeEsperada);
    });

    it('Caso 11: Não deve somar ingredientes com unidades diferentes (500 g e 1 kg de arroz)', function () {
        const ingredientes = [
            { n: "arroz", q: 500, u: "g" },
            { n: "arroz", q: 1, u: "kg" }
        ];

        const resultadoObtido = somarIngredientes(ingredientes);

        assert.equal(resultadoObtido.length, 2);
    });

    it('Caso 12: Deve evitar erro de arredondamento ao somar 0.1 + 0.2', function () {
        const ingredientes = [
            { n: "farinha", q: 0.1, u: "kg" },
            { n: "farinha", q: 0.2, u: "kg" }
        ];
        const quantidadeEsperada = 0.3; // sem arredondar, o JavaScript daria 0.30000000000000004

        const resultadoObtido = somarIngredientes(ingredientes);

        assert.equal(resultadoObtido[0].q, quantidadeEsperada);
    });

    // ---------- calcularFaltantes ----------

    it('Caso 13: Não deve listar o ingrediente quando a despensa cobre toda a necessidade', function () {
        const necessarios = [{ n: "arroz", q: 500, u: "g" }];
        const despensa = [{ n: "arroz", q: 1000, u: "g" }];

        const resultadoObtido = calcularFaltantes(necessarios, despensa);

        assert.equal(resultadoObtido.length, 0);
    });

    it('Caso 14: Deve listar só a diferença quando a despensa cobre parte da necessidade', function () {
        const necessarios = [{ n: "tomate", q: 4, u: "un" }];
        const despensa = [{ n: "tomate", q: 1, u: "un" }];
        const quantidadeEsperada = 4 - 1; // 3

        const resultadoObtido = calcularFaltantes(necessarios, despensa);

        assert.equal(resultadoObtido.length, 1);
        assert.equal(resultadoObtido[0].q, quantidadeEsperada);
    });

    it('Caso 15: Não deve descontar o estoque quando a unidade é diferente (1 kg x 1000 g)', function () {
        const necessarios = [{ n: "arroz", q: 1, u: "kg" }];
        const despensa = [{ n: "arroz", q: 1000, u: "g" }];

        const resultadoObtido = calcularFaltantes(necessarios, despensa);

        assert.equal(resultadoObtido.length, 1);
        assert.equal(resultadoObtido[0].q, 1);
    });

});