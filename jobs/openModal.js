/* eslint-disable no-undef */

const channelWordsConsumer = new BroadcastChannel('wordpanda_words');
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
channelIframe.addEventListener('message', event => {
  console.log("info:" + event.data)
});

const getToken = async () => {
  return await new Promise((res) => {
    chrome?.storage?.local?.get?.(["wordPanda_token"], res);
  }
  );
}

channelWordsConsumer.addEventListener('message', async event => {
  const main = document.getElementsByTagName('body')[0];
  const video = document.getElementsByTagName('video')[0];
  const id = 'wordPand_modal'
  const events = {
    'setToken': (token) => {
      localStorage.setItem('wordPanda_token', token);
      chrome.storage.local.set({ wordPanda_token: token }, function () {
        console.log('Value is set to ' + token);
      });
    },
    'logout': () => {
      localStorage.removeItem('wordPanda_token');
      chrome.storage.local.remove('wordPanda_token', function () {
        console.log('wordPanda_token is removed');
      });
    },
    'sendList': function () {
      modal.contentWindow.window.postMessage({
        name: 'subtitles_urls', content: event.data,
      }, '*');
    },
    'test': () => {
      alert('teste')
    },
    'closeModal': () => {
      main.removeChild(modal);
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
    events[event?.data?.name]?.(event.content);
  })

  window?.addEventListener('message', event => {
    events[event?.data?.name]?.(event?.data?.content);
  })
  video.pause();
  const tokenChrome = (await getToken())?.wordPanda_token;
  localStorage.setItem('wordPanda_token', tokenChrome);
  const token = localStorage.getItem('wordPanda_token') || tokenChrome
  const params = new URLSearchParams(
    {
      from: 'extension',
      modal: true
    }
  );
  if (token != "undefined" && token != null && token != "" && token != undefined) {
    chrome.storage.local.set({ wordPanda_token: token }, function () {
      console.log('Value is set to ' + token);
    });
    params.append('token', token)
  }
  const movieId = event.data.responseBody?.catalogMetadata?.catalog?.id
  if (movieId) params.append('movieId', movieId)

  console.log("open modal", { modal })

  // if (modal.src) {
  //   modal?.contentWindow?.postMessage({
  //     name: 'subtitles_urls', content: event.data,
  //   }, '*');
  //   return;
  // }
  modal.src = `${globalThis.BASE_URL}/extension/?${params.toString()}`;
  modal.id = id;
  main.prepend(modal)
  modal.onload = () => {
    modal.contentWindow.postMessage({
      name: event.data.name, content: event.data,
    }, '*');
  }
});


