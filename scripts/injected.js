/* eslint-disable @typescript-eslint/no-unused-vars */
const XHR = XMLHttpRequest.prototype

const open = XHR.open
const send = XHR.send
const setRequestHeader = XHR.setRequestHeader
const channel = new BroadcastChannel('wordpanda_subtitles');

XHR.open = function () {
    this._requestHeaders = {}

    return open.apply(this, arguments)
}

XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value
    return setRequestHeader.apply(this, arguments)
}

XHR.send = function () {

    this.addEventListener('load', function () {
        const url = this.responseURL
        const responseHeaders = this.getAllResponseHeaders()
        try {
            if (this.responseType != 'blob') {
                let responseBody
                if (this.responseType === '' || this.responseType === 'text') {
                    responseBody = JSON.parse(this.responseText)
                } else /* if (this.responseType === 'json') */ {
                    responseBody = this.response
                }
                // Do your stuff HERE.
                if (url.includes("subtitle"))
                    if (url.includes("CatalogMetadata"))
                        channel.postMessage(
                            {
                                url,
                                responseHeaders,
                                responseBody
                            }
                        )

            }


        } catch (err) {
            console.debug("Error reading or processing response.", err)
        }
    })

    return send.apply(this, arguments)
}



