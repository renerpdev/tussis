import { TussisApi } from 'api'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { downloadBlobFile } from 'shared/utils'

export function App() {
  const [loading, setLoading] = useState(false)

  const handleClick = React.useCallback(async () => {
    try {
      setLoading(true)

      const blob = await TussisApi.getPDF(
        'issues/report',
        {
          range: `${format(new Date(), 'yyyy-mm-dd')}:${format(new Date(), 'yyyy-mm-dd')}`,
        },
        undefined,
      )
      downloadBlobFile(blob)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
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
