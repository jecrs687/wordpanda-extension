import { BASE_URL } from "./constants.json";

/* eslint-disable no-undef */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getPerf = () => window.performance || window.mozPerformance
        || window.msPerformance || window.webkitPerformance;
const getAllSubtitles = async (data) => {
        const {
                className, openAll, image, name
        } = data
        await sleep(1000);
        if (!document.getElementsByClassName(className).length) {
                const list = document.getElementsByClassName(openAll)
                if (!list?.length) return getAllSubtitles(data)
                Array(...list).forEach((x) => {
                        x.click()
                })
                await sleep(3000);
        }
        const checkeds = [...document.getElementsByClassName(className)].map(x => x.children[0].checked)
        const allSubtitles = document.getElementsByClassName(className)
        if (!allSubtitles?.length) return getAllSubtitles(data)
        Array(...allSubtitles).forEach(x => x.click())
        await sleep(1000);
        Array(...allSubtitles).forEach((x, index) => {
                if (checkeds[index])
                        x.click()
        })
        var performance = getPerf()
        const values = performance.getEntries().map((value) => value?.name?.split('.')).filter((v) => v.includes('ttml2')).map((v) => v.join("."))
        console.log({ values })
        if (!values?.length) return getAllSubtitles(data)
        return {
                links: values,
                image: document.getElementsByClassName(image)[0].src,
                name: document.getElementsByClassName(name)[0].innerText,
        };
}




window.addEventListener('load', async () => {
        const classToGet = await (await fetch(BASE_URL + '/api/extension/prime/class')).json()
        // getUrlsSubtitle()
        const { links, image, name } = await getAllSubtitles(classToGet.data);
        // const something = await getText(link)
        // const jsonFromTTML = ttml2ToJson(something)
        // const json = jsonFromTTML.subtitles
        const channel = new BroadcastChannel('words');
        channel.postMessage({ links, image, name })

        // const words = await orderWords(json)
        // console.log({ words, jsonFromTTML })
        // channel.postMessage({ words, jsonFromTTML })

})
