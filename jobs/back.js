/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const channelWords = new BroadcastChannel('wordpanda_words');
const channelSubtitles = new BroadcastChannel('wordpanda_subtitles');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getPerf = () => window.performance || window.mozPerformance
        || window.msPerformance || window.webkitPerformance;
const getAllSubtitles = async (data) => {
        const {
                className, openAll
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
        };
}



const s = document.createElement('script')
s.src = chrome.runtime.getURL('scripts/injected.js')
s.onload = async function () {
        this.remove()
};
(document.head || document.documentElement).appendChild(s)

channelSubtitles.addEventListener('message', async event => {

        // const { links } = await getAllSubtitles(classToGet.data);
        // const something = await getText(link)
        // const jsonFromTTML = ttml2ToJson(something)
        // const json = jsonFromTTML.subtitles
        return channelWords.postMessage({
                provider: 'PRIME',
                responseBody: event.data.responseBody
        })

        // const words = await orderWords(json)
        // console.log({ words, jsonFromTTML })
        // channel.postMessage({ words, jsonFromTTML })

})





// https://atv-ps.primevideo.com/cdp/catalog/GetPlaybackResources?deviceID=8c74caf4-40cc-4f6e-b982-31fd5b929e30&deviceTypeID=AOAGZA014O5RE&gascEnabled=true&marketplaceID=ART4WZ8MWBX2Y&uxLocale=pt_BR&firmware=1&playerType=xp&operatingSystemName=Mac%20OS%20X&operatingSystemVersion=10.15.7&deviceApplicationName=Chrome&asin=amzn1.dv.gti.46823027-bc86-4148-b6bd-d053b302077c&consumptionType=Streaming&desiredResources=PlaybackUrls%2CCuepointPlaylist%2CSubtitleUrls%2CForcedNarratives%2CTrickplayUrls%2CTransitionTimecodes%2CPlaybackSettings%2CCatalogMetadata%2CXRayMetadata&resourceUsage=CacheResources&videoMaterialType=Feature&clientId=f22dbddb-ef2c-48c5-8876-bed0d47594fd&userWatchSessionId=6be095e0-3587-4abc-8767-4102cf05c0b3&sitePageUrl=https%3A%2F%2Fwww.primevideo.com%2Fdetail%2F0HAQAA7JM43QWX0H6GUD3IOF70%2Fref%3Datv_hm_hom_c_cjm7wb_2_1%3Fjic%3D8%257CEgNhbGw%253D&displayWidth=1080&displayHeight=1920&supportsVariableAspectRatio=true&supportsEmbeddedTimedTextForVod=false&deviceProtocolOverride=Https&vodStreamSupportOverride=Auxiliary&deviceStreamingTechnologyOverride=DASH&deviceDrmOverride=CENC&deviceAdInsertionTypeOverride=SSAI&deviceHdrFormatsOverride=None&deviceVideoCodecOverride=H264&deviceVideoQualityOverride=HD&deviceBitrateAdaptationsOverride=CVBR%2CCBR&audioTrackId=all&languageFeature=MLFv2&liveManifestType=patternTemplate%2Caccumulating%2Clive&supportedDRMKeyScheme=DUAL_KEY&supportsEmbeddedTrickplay=true&daiSupportsEmbeddedTrickplay=true&daiLiveManifestType=patternTemplate%2Caccumulating%2Clive&ssaiSegmentInfoSupport=Base&ssaiStitchType=MultiPeriod&gdprEnabled=false&subtitleFormat=TTMLv2&playbackSettingsFormatVersion=1.0.0&titleDecorationScheme=primary-content&xrayToken=XRAY_WEB_2023_V2&xrayPlaybackMode=playback&xrayDeviceClass=normal&playerAttributes=%7B%22middlewareName%22%3A%22Chrome%22%2C%22middlewareVersion%22%3A%22123.0.0.0%22%2C%22nativeApplicationName%22%3A%22Chrome%22%2C%22nativeApplicationVersion%22%3A%22123.0.0.0%22%2C%22supportedAudioCodecs%22%3A%22AAC%22%2C%22frameRate%22%3A%22SFR%22%2C%22H264.codecLevel%22%3A%223.1%22%2C%22H265.codecLevel%22%3A%220.0%22%2C%22AV1.codecLevel%22%3A%220.0%22%7D
