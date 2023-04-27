
const injector = document.createElement('script')
injector.content = "script-src 'self' 'unsafe-inline''./background.js'"
const getValues = async () => {
        const values = window.performance.getEntries().map((value)=>value?.name?.split('.')).filter((v)=> v.includes('ttml2')).map((v)=>v.join("."))
        if(!values.length)
        setTimeout(()=> {getValues()}, 1000)
        console.log({values})
}
window.addEventListener('load', ()=> {
        console.log('loaded')
        getValues()
})
