function sendMessage(message) {
        const mainEl = document.querySelector('#main')
        const textareaEl = mainEl.querySelector('div[contenteditable="true"]')

        if (!textareaEl) {
                throw new Error('There is no opened conversation')
        }

        textareaEl.focus()
        document.execCommand('insertText', false, message)
        textareaEl.dispatchEvent(new Event('change', { bubbles: true }))

        setTimeout(() => {
                (mainEl.querySelector('[data-testid="send"]') || mainEl.querySelector('[data-icon="send"]')).click()
        }, 100)
}
var flag = true;
const messages = {}
async function callGpt({ message, role = "user" }) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [
                        {
                                role,
                                "content": `
                                ${message}
                                `
                        },
                ]
        });

        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
        };
        const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        const responseText = await response.text()
        const json = JSON.parse(responseText);
        const messageResponse = json.choices[0].message.content
        return messageResponse
}
async function main() {
        const value = await callGpt({ message: "Hello, how are you?" })
        console.log(value);
}
var config = {
        attributes: true,
        childList: true,
        subtree: true
};
var callback = async function (mutationsList) {
        for (var mutation of mutationsList) {
                // const text = [...item.getElementsByTagName('span')]?.filter(v => v.className.includes('selectable'))?.[0]?.innerText

                if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
                        const className = "_11JPr selectable-text copyable-text"
                        const item = [...mutation.addedNodes].map(v => [...v.getElementsByClassName(className)]).filter(v => v.length > 0).flat()
                        if (item.length > 0) {
                                const message = item.flatMap(v => v.innerText).join("\n")
                                if (!message) continue;
                                messages
                                if (!flag) continue;
                                const response = await callGpt({ message })
                                await sendMessage(response)
                                flag = false;
                                setTimeout(async () => {
                                        flag = true;
                                }, 1000)

                                console.log(message, { messages });
                        }
                }
        }
};
var observer = new MutationObserver(callback);
const findMessages = async () => {
        const messagesBox = document.getElementsByClassName("n5hs2j7m oq31bsqd gx1rr48f qh5tioqs")[0]
        if (messagesBox)
                observer.observe(messagesBox, config)
        else
                setTimeout(findMessages, 1000)
}
findMessages();
console.log("gpt.js loaded");

