import { Message } from 'element-ui'
import Clipboard from 'clipboard'

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    Message.success(`复制内容：${text}`)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    Message.error(`复制失败`)
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
