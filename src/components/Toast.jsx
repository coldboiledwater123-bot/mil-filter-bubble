import { useEffect } from 'react'

/**
 * Toast —— 底部弹出一条俏皮话，3.2 秒后自动消失
 * 用法：
 *   const [toast, setToast] = useState(null)
 *   ...
 *   setToast('俏皮话')
 *   <Toast text={toast} onClose={() => setToast(null)} />
 */
export default function Toast({ text, onClose }) {
  useEffect(() => {
    if (!text) return
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [text, onClose])

  if (!text) return null

  return (
    <div className="pointer-events-none fixed bottom-10 left-1/2 z-50 -translate-x-1/2 animate-toast-in px-6">
      <div className="max-w-xl rounded-full bg-cocoa px-8 py-4 text-center text-lg font-bold text-white shadow-2xl shadow-cocoa/40">
        {text}
      </div>
    </div>
  )
}
