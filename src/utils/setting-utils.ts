import type { LIGHT_DARK_MODE } from '@/types/config'
import {
  AUTO_MODE,
  DARK_MODE,
  DEFAULT_THEME,
  LIGHT_MODE,
} from '@constants/constants.ts'

export function getDefaultHue(): number {
  const fallback = '250'
  const configCarrier = document.getElementById('config-carrier')
  return Number.parseInt(configCarrier?.dataset.hue || fallback)
}

export function getHue(): number {
  const stored = localStorage.getItem('hue')
  return stored ? Number.parseInt(stored) : getDefaultHue()
}

export function setHue(hue: number): void {
  localStorage.setItem('hue', String(hue))
  const r = document.querySelector(':root') as HTMLElement
  if (!r) {
    return
  }
  r.style.setProperty('--hue', String(hue))
}

type msgForGiscus = {
  setConfig: {
    theme: string
  }
}

function changeGiscusTheme(themeMode: LIGHT_DARK_MODE) {
  const theme = themeMode === DARK_MODE ? 'dark' : 'light'
  function sendMessage(message: msgForGiscus) {
    const iframe = document.querySelector(
      'iframe.giscus-frame',
    ) as HTMLIFrameElement
    if (!iframe) return
    iframe.contentWindow?.postMessage({ giscus: message }, 'https://giscus.app')
  }

  sendMessage({
    setConfig: {
      theme: theme,
    },
  })
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
  let currentTheme = theme
  switch (theme) {
    case LIGHT_MODE:
      document.documentElement.classList.remove('dark')
      break
    case DARK_MODE:
      document.documentElement.classList.add('dark')
      break
    case AUTO_MODE:
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
        currentTheme = DARK_MODE
      } else {
        document.documentElement.classList.remove('dark')
        currentTheme = LIGHT_MODE
      }
      break
  }
  changeGiscusTheme(currentTheme)
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
  localStorage.setItem('theme', theme)
  applyThemeToDocument(theme)
}

export function getStoredTheme(): LIGHT_DARK_MODE {
  try {
    return (localStorage.getItem('theme') as LIGHT_DARK_MODE) || DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}
