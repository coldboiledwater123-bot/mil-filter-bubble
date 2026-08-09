import { useEffect, useRef } from 'react'

/**
 * Toast —— 底部居中弹出俏皮话，3.2 秒后自动消失
 */
export default function Toast({ text, onClose }) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!text) return
    const t = setTimeout(() => onCloseRef.current(), 3200)
    return () => clearTimeout(t)
  }, [text])

  if (!text) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4 sm:bottom-10">
      <div className="w-full max-w-sm rounded-2xl bg-cocoa px-5 py-3 text-center text-sm font-bold leading-snug text-white shadow-xl sm:max-w-xl sm:rounded-full sm:px-8 sm:py-4 sm:text-lg">
        {text}
      </div>
    </div>
  )
}
