
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [size, setSize] = useState({
    height: '600px',
    width: '400px'
  });

  useEffect(() => {
    window?.addEventListener('message', event => {
      if (event?.data?.name == "resize_pop_up") {
        setSize(event.data.content)
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
      src={'http://localhost:3000/pop-up'}
      style={{
        flex: 1,
        border: 'none',
      }}
    />
  </div>
}

export default App
