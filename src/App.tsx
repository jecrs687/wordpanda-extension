
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

  return <iframe
    src={'http://localhost:3000/pop-up'}
    style={{
      flex: 1,
      ...size,
      border: 'none',
    }}
  />
}

export default App
