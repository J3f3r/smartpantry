// Funções para trabalhar com ingredientes de receitas (SmartPantry).
// Cada função faz uma coisa só, para ser fácil de testar.

// Nomes de unidades aceitos (no singular, plural ou por extenso) e o nome padrão de cada uma
const UNIDADES = {
    un: 'un', unidade: 'un', unidades: 'un',
    kg: 'kg', quilo: 'kg', quilos: 'kg',
    g: 'g', grama: 'g', gramas: 'g',
    ml: 'ml',
    l: 'L', litro: 'L', litros: 'L',
    pacote: 'pacote', pacotes: 'pacote',
    caixa: 'caixa', caixas: 'caixa',
    dúzia: 'dúzia', dúzias: 'dúzia', duzia: 'dúzia', duzias: 'dúzia',
    xícara: 'xícara', xícaras: 'xícara', xicara: 'xícara', xicaras: 'xícara',
    colher: 'colher', colheres: 'colher'
};

const FRACOES = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3 };

// número, unidade (opcional), "de" (opcional) e nome. Ex.: "500 g de arroz"
const PADRAO_LINHA = /^(\d+\s+\d+\/\d+|\d+\/\d+|[½¼¾⅓⅔]|\d+[.,]?\d*)\s*(?:(un\.?|unidades?|kg|quilos?|gramas?|g|ml|litros?|l|pacotes?|caixas?|dúzias?|duzias?|xícaras?|xicaras?|colheres?)(?=\s|$))?\s*(?:de\s+)?(.+)$/i;

// Arredonda para 3 casas para evitar resultados como 0.30000000000000004
function arredondar(valor) {
    return Math.round(valor * 1000) / 1000;
}

// Converte "1,5", "1/2", "1 1/2" ou "½" em número
function converterNumero(texto) {
    const limpo = texto.trim();
    if (FRACOES[limpo] !== undefined) {
        return arredondar(FRACOES[limpo]);
    }
    let total = 0;
    limpo.split(/\s+/).forEach(function (parte) {
        const fracao = parte.match(/^(\d+)\/(\d+)$/);
        if (fracao) {
            total += Number(fracao[1]) / Number(fracao[2]);
        } else {
            total += parseFloat(parte.replace(',', '.')) || 0;
        }
    });
    return arredondar(total);
}

// Transforma uma linha como "500 g arroz" em { n: "arroz", q: 500, u: "g" }
export function interpretarIngrediente(linha) {
    const partes = linha.trim().match(PADRAO_LINHA);

    // Sem número no início: a linha inteira vira o nome, com 1 unidade
    if (!partes) {
        return { n: linha.trim(), q: 1, u: 'un' };
    }

    const unidadeDigitada = partes[2] ? partes[2].toLowerCase().replace(/\.$/, '') : null;
    return {
        n: partes[3].trim(),
        q: converterNumero(partes[1]) || 1, // quantidade 0 vira 1
        u: unidadeDigitada ? UNIDADES[unidadeDigitada] : 'un'
    };
}

// Deixa o nome pronto para comparação: sem maiúsculas, acentos, espaços extras e plural simples
export function normalizarNome(nome) {
    const semAcento = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const palavras = semAcento.toLowerCase().replace(/\s+/g, ' ').trim().split(' ');
    const singular = [];
    palavras.forEach(function (palavra) {
        const ehPlural = palavra.length > 3 && palavra.endsWith('s') && !palavra.endsWith('ss');
        singular.push(ehPlural ? palavra.slice(0, -1) : palavra);
    });
    return singular.join(' ');
}

// Junta ingredientes repetidos (mesmo nome e mesma unidade) somando as quantidades
export function somarIngredientes(ingredientes) {
    const resultado = [];
    ingredientes.forEach(function (ingrediente) {
        const existente = resultado.find(function (item) {
            return normalizarNome(item.n) === normalizarNome(ingrediente.n) && item.u === ingrediente.u;
        });
        if (existente) {
            existente.q = arredondar(existente.q + ingrediente.q);
        } else {
            resultado.push({ n: ingrediente.n, q: ingrediente.q, u: ingrediente.u });
        }
    });
    return resultado;
}

// Retorna só o que falta comprar: necessário menos o que já existe na despensa
export function calcularFaltantes(necessarios, despensa) {
    const faltantes = [];
    necessarios.forEach(function (ingrediente) {
        let emEstoque = 0;
        despensa.forEach(function (item) {
            if (normalizarNome(item.n) === normalizarNome(ingrediente.n) && item.u === ingrediente.u) {
                emEstoque += item.q;
            }
        });
        const falta = arredondar(ingrediente.q - emEstoque);
        if (falta > 0) {
            faltantes.push({ n: ingrediente.n, q: falta, u: ingrediente.u });
        }
    });
    return faltantes;
}