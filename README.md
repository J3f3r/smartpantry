# SmartPantry

Aplicação web de página única para **planejar refeições, organizar a lista de compras e controlar a despensa**, com foco em reduzir o desperdício de alimentos.

> Projeto de aprendizado, desenvolvido com apoio do **Claude (IA)** para gerar e corrigir o código. Veja a seção [Como o projeto foi feito](#como-o-projeto-foi-feito).

## O que o app faz

- **Painel:** refeições dos próximos dias, alimentos perto de vencer, orçamento disponível e itens pendentes.
- **Planejador semanal:** café da manhã, almoço, lanche e jantar; editar, copiar e excluir refeições; refeições favoritas.
- **Lista de compras:** gerada a partir das refeições planejadas, com soma de ingredientes repetidos, desconto do que já existe na despensa, arquivamento e reutilização de listas.
- **Despensa:** controle de quantidades e validades, com registro de consumo e descarte.
- **Orçamento e histórico:** orçamento semanal ou mensal, gastos estimados e pagos, resumo de descartes.
- **Lembretes:** alertas de validade e de preparo, com notificações do navegador somente se você autorizar.

## Como usar

1. Baixe ou clone o repositório.
2. Abra o arquivo `SmartPantry-APP.html` no navegador. Não precisa instalar nada.
3. Na aba **Lembretes**, use **Carregar** para ver o app com dados de exemplo (e **Remover** para apagá-los).

Demonstração online: [link do GitHub Pages, se você ativar]

## Limitações

- **Sem backend, sem login e sem backup.** Os dados ficam no `localStorage` do navegador: não sincronizam entre aparelhos e são perdidos se você limpar os dados do navegador.
- Os preços e custos são **estimativas informadas por você**; o app não consulta mercados nem serviços de entrega.
- As refeições **não têm validação médica** nem garantem adequação nutricional.
- Leitura de ingredientes: o número precisa vir antes do nome (`500 g arroz` funciona; `arroz 500 g` não). Use `1000 g`, e não `1.000 g`.
- As notificações só aparecem com a página aberta.
- Testado no Chromium. Não foi testado em Firefox, Safari nem em aparelhos reais.

## Estrutura do repositório

```
APPWebSmartPantry/
├─ SmartPantry-APP.html                        (o aplicativo)
├─ SmartPantry-manual-de-uso.html              (manual com entradas, saídas e falhas)
├─ SmartPantry-Checking-casos-de-teste.html    (casos de teste manuais)
├─ SmartPantry-Testing-exploratorio-charters.html (testes exploratórios e defeitos)
├─ source/calcularIgredientes.js               (funções de apoio, testáveis)
├─ test/calcularIgredientes.test.js            (testes unitários com Mocha)
├─ package.json
└─ README.md
```

## Testes

O projeto usa duas abordagens de teste, em arquivos separados:

| Abordagem | Arquivo | O que contém |
|---|---|---|
| **Checking** (verificação) | `SmartPantry-Checking-casos-de-teste.html` | 76 casos de teste manuais com passos, entrada, resultado esperado e obtido, e rastreabilidade dos requisitos |
| **Testing** (exploração) | `SmartPantry-Testing-exploratorio-charters.html` | 10 sessões exploratórias (charters), 16 defeitos registrados com evidência e correção, e aprendizados |
| **Unitários** | `test/calcularIgredientes.test.js` | 15 testes com Mocha das funções de ingredientes |

### Rodar os testes unitários

```bash
npm install
npm test
```

Requisitos no `package.json`: `"type": "module"` e `"scripts": { "test": "mocha" }`.

### O que os testes unitários cobrem (e o que não cobrem)

Cobrem as 4 funções de `source/calcularIgredientes.js`: interpretar uma linha de ingrediente, normalizar nomes, somar ingredientes repetidos e calcular o que falta comprar.

**Não cobrem o `SmartPantry-APP.html` diretamente.** Essas funções são uma versão simplificada, extraída da lógica do app, e o HTML não importa esse arquivo. Se uma das duas versões mudar, a outra precisa ser atualizada. O comportamento do app em si é verificado pelos casos manuais em Checking e Testing.

## Como o projeto foi feito

- O app, os documentos de teste e as funções de `source/` foram escritos e corrigidos **com apoio do Claude (IA)**.
- Meu papel: [definir os requisitos e o escopo; revisar o comportamento do app; estudar os casos de teste e as sessões exploratórias; escrever e executar os testes unitários; ...]. Ajuste esta lista ao que você realmente fez.
- Os testes manuais descritos nos documentos foram elaborados com apoio de IA. Reexecutei [o roteiro de verificação do manual] em [data] e o resultado foi [descreva].
- Meu nível: júnior em backend, em formação na área de testes. Este repositório mostra o que consigo construir e validar com apoio de IA, e não um projeto de produção.

## Próximos passos

- [ ] Fazer o app usar `source/calcularIgredientes.js`, para que os testes unitários cubram o código real.
- [ ] Criar uma API com banco de dados e testá-la.
- [ ] Corrigir a leitura de ingredientes com o número depois do nome.

## Licença

[]