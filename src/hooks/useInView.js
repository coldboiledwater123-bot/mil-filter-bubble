import { useEffect, useRef, useState } from 'react'

/**
 * useInView —— Intersection Observer 封装
 * 元素进入视口时触发 isVisible=true，只触发一次（unobserve 后不再变回 false）
 *
 * @param {{ threshold?: number, rootMargin?: string, once?: boolean }} options
 * @returns {[React.Ref, boolean]} ref 绑定到目标元素，isVisible 是否已进入视口
 */
export default function useInView({ threshold = 0.15, rootMargin = '0px', once = true } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, isVisible]
}
