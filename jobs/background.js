function doSomething(ttml2Url) {
    console.log({ ttml2Url })
    fetch(ttml2Url)
        .then(response => response.text())
        .then(ttml2 => {
            // Transformando o arquivo em um json
            let json = ttml2ToJson(ttml2).subtitles;
            // criando uma estrutura para armazenar as palavras e momentos
            let words = {}
            //iterando sobre as palavras do json
            for (let i = 0; i < json.length; i++) {
                let word = json[i].word;
                if (!new RegExp(/^[a-zA-Z][a-zA-Z'\-]+[a-zA-Z]$/).test(word)) continue;
                if (!words[word]) {
                    words[word] = { count: 0, moments: [], texts: [] }
                }
                words[word].count += 1
                words[word].texts.push(json[i].text)
                words[word].moments.push(json[i].moment)
            }
            // ordenando as palavras pelo número de vezes que são usadas
            let sortedWords = Object.entries(words).sort((a, b) => b[1].count - a[1].count)
            let result = []
            //iterando sobre as palavras ordenadas e gerando o json final
            for (let i = 0; i < sortedWords.length; i++) {
                result.push({
                    word: sortedWords[i][0],
                    count: sortedWords[i][1].count,
                    moments: sortedWords[i][1].moments,
                    position: i + 1,
                    texts: sortedWords[i][1].texts,
                    percentage: (sortedWords[i][1].count / Object.entries(words)?.length) * 100
                })
            }
            console.log(result);
        });
}

function ttml2ToJson(ttml2Text) {
    // Cria um parser para o arquivo ttml2
    const parser = new DOMParser();
    const ttml2Xml = parser.parseFromString(ttml2Text, "application/xml");

    // Inicializa o objeto json vazio
    const json = {};

    // Adiciona as informações do arquivo ttml2 ao objeto json
    json.lang = ttml2Xml.querySelector("tt").getAttribute("xml:lang");
    json.version = ttml2Xml.querySelector("tt").getAttribute("ttp:version");
    json.subtitles = [];

    // Itera sobre cada elemento "p" (linha de legenda)
    ttml2Xml.querySelectorAll("p").forEach(p => {
        // Adiciona as informações da legenda ao objeto json
        p.textContent.split(" ").forEach(word => {
            json.subtitles.push({
                moment: {
                    begin: p.getAttribute("begin"),
                    end: p.getAttribute("end"),
                },
                text: p.textContent,
                word: word.toLowerCase()
            });
        });
    });

    // Retorna o objeto json
    return json;
}

XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function (...value) {
    if (value?.[1].includes('.ttml2')) doSomething(value?.[1])
    this.realOpen(value);
};
