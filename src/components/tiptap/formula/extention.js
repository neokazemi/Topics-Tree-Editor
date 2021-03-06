import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import TiptapInteractiveKatex from './TiptapInteractiveKatex'

export default Node.create({
  name: 'TiptapInteractiveKatex',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      katex: {
        default: 'x=\\frac{-2b\\pm \\sqrt{b^2-4ac}}{2a}',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'tiptap-interactive-katex',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['tiptap-interactive-katex', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(TiptapInteractiveKatex)
  },
})
