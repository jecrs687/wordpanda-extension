/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'


function App() {
  const [size, setSize] = useState({
    height: '600px',
    width: '400px'
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
      if (isLoaded)
        await chrome.storage.local.set({ wordPand_token: token });
    },
    setLocalStorage: async (values: any) => {
      if (isLoaded)
        await chrome.storage.local.set(values);
    },
    getLocalStorage: async (keys: any) => {
      const reference = ref as any
      if (isLoaded)
        reference?.current?.contentWindow?.postMessage({
          name: 'getLocalStorage',
          content: keys
        }, '*')
    }
  }


  const getItems = useCallback(async () => {
    const items = await chrome.storage.local.get(["wordPand_token"]);
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
  return <div
    style={{
      flex: 1,
      display: 'flex',
      ...size,
    }}
  >
    <iframe
      src={'https://lanboost-04a196880f88.herokuapp.com/pop-up' + `/?${url.toString()}`}
      style={{
        flex: 1,
        border: 'none',
      }}
      ref={ref}
    />
  </div>
}

export default App
