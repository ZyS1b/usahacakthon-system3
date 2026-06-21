import { useState, useCallback } from 'react'
import { checkEligibility, parseAndCheck } from '../utils/api'

export function useEligibility() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const submitForm = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const result = await checkEligibility(formData)
      setData(result)
      return result
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const submitFreeText = useCallback(async (text, language = 'en') => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const result = await parseAndCheck(text, language)
      setData(result)
      return result
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return { loading, error, data, submitForm, submitFreeText, reset }
}