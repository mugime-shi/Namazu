import { useEffect, useState } from 'react'

export function useCheapHours(date, duration) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!date || !duration) return
    setLoading(true)
    setData(null)
    fetch(`/api/v1/prices/cheapest-hours?date=${date}&duration=${duration}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d) => { setData(d); setLoading(false) })
      .catch((e) => { setError(e); setLoading(false) })
  }, [date, duration])

  return { data, loading, error }
}
