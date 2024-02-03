/* eslint-disable no-undef */

const channel = new BroadcastChannel('words');
const channelIframe = new BroadcastChannel('iframe');

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
modal.src = 'https://localhost:3000/extension';
chrome.runtime.onMessage.addListener(function (msg) {
  alert("inside chrome.runtime.onMessage")
  try {
    channelIframe(JSON.parse(msg))
  }
  catch (e) {
    channelIframe(msg)
  }
})

channelIframe.addEventListener('message', () => {
  alert("inside channelIframe.addEventListener outside window")
})
channel.addEventListener('message', event => {
  const main = document.getElementsByTagName('body')[0];
  const video = document.getElementsByTagName('video')[0];

  const events = {
    'sendList': () => {
      modal.contentWindow.postMessage({
        name: 'subtitles_urls', content: event.data,
      }, '*');
    },
    'test': () => {
      alert('teste')
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
    'setCookie': (
      { name, value, days = 10 }
    ) => {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value};${expires};path=/`;
    },
    'deleteCookie': (name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },
    'video_control': ({ action, value }) => {
      video[action](value);
    }
  }

  channelIframe.addEventListener('message', event => {
    alert("inside channelIframe.addEventListener")
    events[event?.data?.name]?.(event.content);
  })

  window?.addEventListener('message', event => {
    alert(
      JSON.stringify(event)
    )
    events[event?.data?.name]?.(event.content);
  })
  video.pause();
  main.prepend(modal)
});


