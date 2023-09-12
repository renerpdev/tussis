import React, { useState } from 'react'
import streamSaver from 'streamsaver'

export const apiURL = import.meta.env.VITE_API_URL

export function App() {
  const [loading, setLoading] = useState(false)

  const handleClick = React.useCallback(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const response = await fetch(`${apiURL}/issues/report`)
        if (!response.ok || !response.body) {
          throw response.statusText
        }

        const fileStream = streamSaver.createWriteStream(`tussis-report.pdf`)
        await response.body.pipeTo(fileStream)

        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <button onClick={handleClick}>test download</button>
      <div>
        <b>Request Response: {loading && <i>Fetching data...</i>}</b>
      </div>
    </div>
  )
}

export default App
