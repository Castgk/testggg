import { API_URL } from '../../config.json'

export const API = {
  getRecommendedFonts: data => fetchJson('get-recommended-fonts', data),
  getColors: () => fetchJson('get-colors'),
  getIcons: () => fetchJson('get-icons'),
  generateLogos: data => fetchJson('generate-logos', data),
}

async function fetchJson (url, data = null) {
  console.log(`- ${url.slice(0, 90)}${url.length > 90 ? '...' : ''}`, data || '')

  const options = {
    method: 'POST'
  }
  options.headers = {}

  // Variants of data send - use one
  if (data) {
    // options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // const searchParams = new URLSearchParams();
    // Object.entries(data).forEach(([key, value]) => {
    //   searchParams.set(key, value as string)
    // })
    // options.body = searchParams

    // Multipart - only for flat data
    // const formData = new FormData()
    // Object.entries(data).forEach(([key, value]) => {
    //   formData.append(key, value as string)
    // })
    // options.body = formData

    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(data)
  }

  const response = await fetch(API_URL + url, options)

  let json
  try {
    json = await response.json()
  } catch {/* */}

  if (response.ok) {
    return Promise.resolve(json)
  } else {

    let msg = 'Error. '
    if (json && json.message) {
      msg += json.message
    } else {
      // todo only for debug. For production remove it
      msg = `Unexpected Error ${response.status}`
    }

    requestErrorHandler(msg)

    return Promise.reject()
  }
}

let requestErrorHandler
requestErrorHandler = message => alert(message)

export function setRequestErrorHandler (handler) {
  requestErrorHandler = handler
}
