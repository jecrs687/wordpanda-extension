/* eslint-disable no-undef */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllSubtitles = async ({
        className, openAll
}) => {
        await sleep(1000);
        const list = document.getElementsByClassName(openAll)
        if (!list?.length) return getAllSubtitles({
                className, openAll
        })
        Array(...list).forEach((x) => {
                console.log({ x })
                x.click()
        })
        await sleep(1000);
        const checkeds = [...document.getElementsByClassName(className)].map(x => x.children[0].checked)
        const allSubtitles = document.getElementsByClassName(className)
        if (!allSubtitles?.length)
                return getAllSubtitles({
                        className, openAll
                })
        Array(...allSubtitles).forEach(x => x.click())
        await sleep(1000);
        Array(...allSubtitles).forEach((x, index) => {
                if (checkeds[index])
                        x.click()
        })

        var performance = window.performance || window.mozPerformance
                || window.msPerformance || window.webkitPerformance;

        const values = performance.getEntries().map((value) => value?.name?.split('.')).filter((v) => v.includes('ttml2')).map((v) => v.join("."))
        if (!values)
                return getAllSubtitles({
                        className, openAll
                })
        return values;
}




window.addEventListener('load', async () => {
        const classToGet = await (await fetch('https://localhost:3000/api/extension/prime/class')).json()
        // getUrlsSubtitle()
        const links = await getAllSubtitles(classToGet.data);
        // const something = await getText(link)
        // const jsonFromTTML = ttml2ToJson(something)
        // const json = jsonFromTTML.subtitles
        channel.postMessage({ links })

        // const words = await orderWords(json)
        // const channel = new BroadcastChannel('words');
        // console.log({ words, jsonFromTTML })
        // channel.postMessage({ words, jsonFromTTML })

})
