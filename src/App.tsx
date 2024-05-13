/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import '../jobs/constants';

function App() {
  const [size, setSize] = useState({
    height: '00px',
    width: '00px'
  });
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState()
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef(null)
  const events: any = {
    resizePopUp: ({
      height,
      width
    }: any) => {
      setSize({
        height,
        width
      })
    },

    setToken: async (token: any) => {
      try {
        if (isLoaded)
          await chrome.storage.local.set({ wordPanda_token: token });
      } catch (e) {
        console.log(e)
      }
    },
    setLocalStorage: async (values: any) => {
      try {
        if (isLoaded)
          await chrome.storage.local.set(values);
      }
      catch (e) {
        console.log(e)
      }
    },
    getLocalStorage: async (keys: any) => {
      const reference = ref as any
      if (isLoaded)
        reference?.current?.contentWindow?.postMessage({
          name: 'getLocalStorage',
          content: await chrome.storage.local.get(keys)
        }, '*')
    }
  }


  const getItems = useCallback(async () => {
    const items = await chrome.storage.local.get(["wordPanda_token"]);
    setLoading(false)
    setToken(items.token)
  }, [])

  useEffect(() => {
    if (typeof chrome !== 'undefined') {
      getItems()
    }
    const handle = (event: any) => {
      console.log({ popUp: event.data })
      events[event?.data?.name]?.(event?.data?.content)
      try {
        chrome.runtime.sendMessage(event)
      } catch (e) {
        alert(JSON.stringify(e))
        console.log(e)
      }
    }
    window?.addEventListener('message', handle)
    return () => {
      window?.removeEventListener('message', handle)
    }
  }, [
    getItems, isLoaded
  ])
  useEffect(() => {
    const handle = () => { setIsLoaded(true) }
    document.addEventListener('DOMContentLoaded', handle);
    return () => {
      document.removeEventListener('DOMContentLoaded', handle);
    }
  }, [])
  if (loading) return <div>Loading...</div>
  const url = new URLSearchParams()
  if (token) url.append('token', token)
  window.open(BASE_URL, '_blank')
  const sendData = async (data: any) => {
    chrome.runtime.sendMessage({
      count: 12,
      data
    }, function (response) {
      console.log({ response });
    });
  }

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.scripting.executeScript({
      target: {
        tabId: tabs[0].id as number
      },
      /* @ts-expect-error */
      function: sendData,
    });
  });


  return <div

    style={{
      flex: 1,
      display: 'flex',
      ...size,
    }}
  >
    <button onClick={async () => {
      sendData({ test: '123' })
    }}>

    </button>
    <iframe
      src={BASE_URL + '/pop-up' + `/? ${url.toString()}`}
      style={{
        flex: 1,
        border: 'none',
      }}
      ref={ref}
    />
  </div>
}

export default App
