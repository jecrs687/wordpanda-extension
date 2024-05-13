/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const channelWords = new BroadcastChannel('wordpanda_words');
const channelSubtitles = new BroadcastChannel('wordpanda_subtitles');

const s = document.createElement('script')
s.src = chrome.runtime.getURL('scripts/injected.js');
s.onload = async function () {
        this.remove()
};
(document.head || document.documentElement).appendChild(s)

const img = document.createElement('img')
const src = chrome.runtime.getURL('icons/icon-48.png');
img.src = src;
img.style.width = '20px'
img.style.height = '20px'
img.style.cursor = 'pointer'
img.style.marginLeft = '10px'
img.id = 'wordpanda-icon'
const allEvents = []
let interval = null
channelSubtitles.addEventListener('message', async event => {
        const subtitles = document.getElementsByClassName('atvwebplayersdk-subtitle-text')?.[0]?.childNodes
        const titles = document.getElementsByClassName('atvwebplayersdk-title-text')?.[0]?.childNodes
        const title = subtitles[2]?.nodeValue || titles[0]?.nodeValue
        allEvents.push(event)
        console.log({ title, event, allEvents })
        const selectEvent = allEvents.find(e => e.data.responseBody?.catalogMetadata?.catalog?.title === title)
        if (!selectEvent) return
        img.addEventListener('click', () => {
                channelWords.postMessage({
                        provider: 'PRIME',
                        name: 'PRIME',
                        responseBody: selectEvent.data.responseBody,
                        link: document.location.href
                })
        })
        if (interval) clearInterval(interval)
        interval = setInterval(() => {
                const icon = document.getElementsByClassName('f1qd5172 f7mv6lt')?.[0]
                const video = document.getElementsByTagName('video')[0];
                console.log({ icon, video })
                if (icon && video) {
                        insertIcon(icon)
                        clearInterval(interval)
                }
        }, 1000)
        const insertIcon = (icon) => {
                const alreadyIcon = document.getElementById('wordpanda-icon')
                if (alreadyIcon) return;
                console.log({ event: event.data })
                const copyIcon = icon.cloneNode(true);
                copyIcon.childNodes[0].remove()
                copyIcon.appendChild(img)
                icon.parentNode.prepend(copyIcon)
        };

})
const pushUrl = (href) => {
        history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
};

