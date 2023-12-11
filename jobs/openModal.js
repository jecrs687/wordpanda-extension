
const channel = new BroadcastChannel('words');
const modal = document.createElement('iframe');
modal.check = 'modal';
modal.style = `
position: fixed;
flex: 1;
height: 60%;
width: 80%;
max-width: 1200px;
border-radius: 10px;
z-index: 2147483648;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`
modal.src = 'http://localhost:3000/';


channel.addEventListener('message', event => {
  const main = document.getElementsByTagName('body')[0];
  const video = document.getElementsByTagName('video')[0];
  const events = {
    'sendWords': () => {
      modal.contentWindow.postMessage({
        name: 'words', content: {
          words: event.data.words,
          jsonFromTTML: event.data.jsonFromTTML
        }
      }, '*');
    },
    'closeModal': () => {
      modal.remove();
      video.play();
    },
    'openModal': () => {
      main.prepend(modal)
    },
    'style_modal': (style) => {
      modal.style = {
        ...modal.style,
        ...style
      }
    },
    'video_control': ({ action, value }) => {
      video[action](value);
    }
  }
  window?.addEventListener('message', event => {
    events[event?.data?.name]?.(event.content);
  })
  video.pause();
  main.prepend(modal)
});


