const BASE_URL = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    let detail = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      detail = body.detail || detail
    } catch {
      // ignore parse errors, use default detail
    }
    throw new Error(`${res.status}: ${detail}`)
  }
  return res.json()
}

export async function chatWithAI(message, history = [], language = 'en') {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, language }),
  })
  return handleResponse(res)
}

export async function checkEligibility(payload) {
  const res = await fetch(`${BASE_URL}/eligibility/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export async function parseAndCheck(text, language = 'en') {
  const res = await fetch(`${BASE_URL}/eligibility/parse-and-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  })
  return handleResponse(res)
}