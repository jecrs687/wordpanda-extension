
const injector = document.createElement('script')
injector.content = "script-src 'self' 'unsafe-inline''./background.js'"
(document.head || document.documentElement).appendChild(injector)