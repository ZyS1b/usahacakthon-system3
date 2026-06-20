const API_BASE = '/api'

export async function checkEligibility(formData) {
  const body = {
    age: Number(formData.age ?? formData.monthlyIncome ?? 0),
    monthly_income: Number(formData.monthly_income ?? formData.monthlyIncome ?? 0),
    household_size: Number(formData.household_size ?? formData.householdSize ?? 1),
    employment_status: formData.employment_status ?? formData.employmentStatus ?? 'unemployed',
    is_pwd: formData.is_pwd ?? formData.isPwd ?? false,
    is_senior: formData.is_senior ?? formData.isSenior ?? (formData.age >= 60),
    has_philhealth: formData.has_philhealth ?? formData.hasPhilhealth ?? false,
    has_sss: formData.has_sss ?? formData.hasSss ?? false,
    location_type: formData.location_type ?? formData.locationType ?? 'urban',
    barangay: formData.barangay ?? null,
    city: formData.city ?? '',
    province: formData.province ?? '',
    language: formData.language ?? 'en',
  }

  const res = await fetch(`${API_BASE}/eligibility/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Server error: ${res.status}`)
  }

  return res.json()
}

export async function parseAndCheck(freeText, language = 'en') {
  const res = await fetch(`${API_BASE}/eligibility/parse-and-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: freeText, language }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Server error: ${res.status}`)
  }

  return res.json()
}

export async function chatWithAI(message, history = [], language = 'en') {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, language }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Server error: ${res.status}`)
  }

  return res.json()
}