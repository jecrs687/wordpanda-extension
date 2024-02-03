/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import './App.css'


function App() {
  const [size, setSize] = useState({
    height: '600px',
    width: '400px'
  });
  const events: any = {
    resizePopUp: ({
      height,
      width
    }: any) => {
      setSize({
        height,
        width
      })
    }
  }
  useEffect(() => {

    window?.addEventListener('message', event => {
      events[event?.data?.name]?.(event?.data?.content)
      alert("inside event listener on pop up")
      try {
        chrome.runtime.sendMessage(event)
      } catch (e) {
        alert(JSON.stringify(e))
        console.log(e)
      }
    })
  }, [])

  return <div
    style={{
      flex: 1,
      display: 'flex',
      ...size,
    }}
  >
    <iframe
      src={'https://localhost:3000/pop-up'}
      style={{
        flex: 1,
        border: 'none',
      }}
    />
  </div>
}

export default App
