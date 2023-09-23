const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getValues = async () => {
        await sleep(1000);
        var performance = window.performance || window.mozPerformance
                || window.msPerformance || window.webkitPerformance;
        const values = performance.getEntries().map((value) => value?.name?.split('.')).filter((v) => v.includes('ttml2')).map((v) => v.join("."))?.[0]
        if (!values)
                return getValues()
        return values;
}
async function getText(ttml2Url) {
        const values = await fetch(ttml2Url)
        const text = await values.text()
        return text;
}

function ttml2ToJson(ttml2Text) {
        const parser = new DOMParser();
        const ttml2Xml = parser.parseFromString(ttml2Text, "application/xml");
        const json = {};
        json.lang = ttml2Xml.querySelector("tt").getAttribute("xml:lang");
        json.version = ttml2Xml.querySelector("tt").getAttribute("ttp:version");
        json.subtitles = [];

        ttml2Xml.querySelectorAll("p").forEach(p => {
                p.textContent.split(" ").forEach(word => {
                        json.subtitles.push({
                                moment: {
                                        begin: p.getAttribute("begin"),
                                        end: p.getAttribute("end"),
                                },
                                text: p.textContent,
                                word
                        });
                });
        });

        return json;
}

async function orderWords(json) {
        let words = {}
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
        let sortedWords = Object.entries(words).sort((a, b) => b[1].count - a[1].count)
        let result = []
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
        return result
}

window.addEventListener('load', async () => {
        console.log('loaded')
        const link = await getValues();
        const something = await getText(link)
        const json = await ttml2ToJson(something).subtitles
        const words = await orderWords(json)
        const channel = new BroadcastChannel('words');
        console.log({words})
        channel.postMessage(
                words
        )
})
