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
                const TYPE = {
                    "TV Show": "SERIE",
                    "MOVIE": "MOVIE",
                    "SEASON": "SERIE",
                    "SHOW": "SERIE"
                }

                if (url.includes("subtitle"))
                    if (url.includes("CatalogMetadata")) {
                        const body = {
                            links: responseBody?.subtitleUrls?.map(subtitle => ({
                                url: subtitle.url,
                                languageCode: subtitle.languageCode
                            })),
                            platformLink: document.referrer,
                            name: responseBody?.catalogMetadata?.catalog?.title,
                            title: responseBody?.catalogMetadata?.family?.tvAncestors?.find(x => x.catalog.type === "SHOW")?.catalog?.title,
                            platform: "PRIME",
                            episode: responseBody?.catalogMetadata?.catalog?.episodeNumber,
                            season: responseBody?.catalogMetadata?.family?.tvAncestors?.find(x => x.catalog.type === "SEASON")?.catalog?.seasonNumber,
                            image: responseBody?.catalogMetadata?.images?.imageUrls?.title,
                            images: responseBody?.catalogMetadata?.images?.imageUrls,
                            type: TYPE[responseBody?.catalogMetadata?.catalog?.type] || "VIDEO",
                            mediaId: responseBody?.catalogMetadata?.catalog?.id,
                            seasonId: responseBody?.catalogMetadata?.family?.tvAncestors?.find(x => x.catalog.type === "SEASON")?.catalog?.id,
                            serieId: responseBody?.catalogMetadata?.family?.tvAncestors?.find(x => x.catalog.type === "SHOW")?.catalog?.id,
                        }
                        const fetchParams = {
                            method: "POST",
                            body: JSON.stringify(body),
                            headers: { 
                                "Content-Type": "application/json",
                                "Authorization": localStorage.getItem("wordPand_token")
                             }
                        }
                        if(localStorage.getItem("wordpanda_admin") === "true")
                            fetch("https://lanboost-04a196880f88.herokuapp.com//api/extension/prime/subtitle", fetchParams);
                        console.log({ fetchParams },localStorage.getItem("wordpanda_admin") )
                        channel.postMessage(
                            {
                                url,
                                responseHeaders,
                                responseBody
                            }
                        )
                    }

            }


        } catch (err) {
            console.debug("Error reading or processing response.", err)
        }
    })

    return send.apply(this, arguments)
}





