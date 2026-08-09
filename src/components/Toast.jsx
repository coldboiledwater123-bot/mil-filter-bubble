import { useEffect } from 'react'

/**
 * Toast —— 底部弹出一条俏皮话，3.2 秒后自动消失
 */
export default function Toast({ text, onClose }) {
  useEffect(() => {
    if (!text) return
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [text, onClose])

  if (!text) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-4 right-4 z-50 flex justify-center sm:bottom-10 sm:left-1/2 sm:right-auto">
      <div className="w-full max-w-sm rounded-2xl bg-cocoa px-5 py-3 text-center text-sm font-bold leading-snug text-white shadow-xl sm:max-w-xl sm:rounded-full sm:px-8 sm:py-4 sm:text-lg">
        {text}
      </div>
    </div>
  )
}
