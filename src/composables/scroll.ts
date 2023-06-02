import type { Ref } from 'vue'

export function useScrollTo(dom: Ref<HTMLElement | undefined>) {
  const scrollBottom = () => {
    dom.value?.scrollTo({
      left: 0,
      top: dom.value.scrollHeight - dom.value.clientHeight,
      behavior: 'smooth',
    })
  }
  const scrollTop = () => {
    dom.value?.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    })
  }
  const scrollAny = (options: ScrollOptions) => {
    dom.value?.scrollTo({ behavior: 'smooth', ...options })
  }
  return { scrollBottom, scrollTop, scrollAny }
}
