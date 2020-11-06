// Dependencias
const fs = require('fs');
const prompts = require('prompts');
const accents = require('remove-accents');

// Função principal
(async () => {
    // Configuração das instâncias disponíveis para seleção
    const instances_choices = [
        { title: 'Fácil 1' },
        { title: 'Fácil 2' },
        { title: 'Fácil 3' },
        { title: 'Fácil 4' },
        { title: 'Média 1' },
        { title: 'Média 2' },
        { title: 'Média 3' },
        { title: 'Difícil 1' },
        { title: 'Difícil 2' },
        { title: 'Difícil 3' }
    ]
    
    // Configuração dos modelos disponíveis para seleção
    const models_choices = [
        { title: 'Programação Linear' },
        { title: 'Branch-and-Bound' }
    ];
    
    // Configuração das perguntas
    const questions = [
        {
            type: 'select',
            name: 'instance',
            message: 'Escolha a instância desejada:',
            choices: instances_choices
        },
        {
            type: 'select',
            name: 'model',
            message: prev => `Como você quer que a instância ${ instances_choices[prev].title } seja processada?`,
            choices: models_choices
        },
    ];

    // Processa as perguntas
    const { instance, model } = await prompts(questions);

    // Trata o nome da instancia selecionada para poder buscar o arquivo
    const instanceFile = accents.remove(instances_choices[instance].title.replace(" ", "").toLowerCase());
    const instanceFilePath = `./instances/${instanceFile}`;

    // Abre o arquivo para leitura
    fs.readFile(instanceFilePath, 'utf8', (err, data) => {
        // Verifica qualquer erro na leitura do arquivo
        if (err) {
            return console.log(err);
        }
        
        // Inicialização das variáveis
        let totalObjects = 0, capacity = [], weights = [], profits = [];

        // Separa cada linha encontrada no arquivo em um array
        data = data.split("\n");

        // O indice 0 é o total de objetos, há uma conversão de string para int.
        totalObjects = parseInt(data[0]);

        // O indice 1 possui os limites de capacidade de cada dimensão, há uma conversão de string para float.
        capacity = data[1].split(" ").map(parseFloat);

        // Remove os dois primeiros indices do array pois eles não serão mais utilizados
        data = data.slice(2, data.length - 2);

        // Processa as próximas linhas (objetos)
        for (let line in data) {
            // Separa cada espaço encontrado na linha em um array
            let object = data[line].split(" ");
            // O indice 0 possui o valor do objeto em questão
            profits.push(parseFloat(object[0]));
            // Os indices 1, 2 e 3 são referentes às dimensões do objeto em questão
            weights.push([parseFloat(object[1]), parseFloat(object[2]), parseFloat(object[3])]);
        }
        const instanceData = { totalObjects, capacity, weights, profits };
        console.log(`Dados da instância ${instances_choices[instance].title}.`, instanceData);
    });
})();