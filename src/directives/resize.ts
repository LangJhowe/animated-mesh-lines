import { addResizeListener } from '@/utils/js/resize-handler.js'
export default {
  mounted (el: HTMLElement, arg: any) {
    if (!arg.arg) {
      addResizeListener(el, () => {
        arg.value(el)
      })
    }
  }
}
