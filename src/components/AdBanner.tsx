'use client'

import { useEffect, useRef } from 'react'

export default function AdBanner() {
  const adRef = useRef<HTMLModElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    try {
      // @ts-expect-error adsbygoogle is injected by Google
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-3 py-2">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9776060338423324"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
