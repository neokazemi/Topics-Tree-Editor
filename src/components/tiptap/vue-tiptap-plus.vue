<template>
  <div dir="rtl" class="tiptap-plus-container">
    <v-card elevation="3" class="tiptap-plus">
      <v-card-title class="tiptap-header">
        <slot name="toolbar">
          <toolbar :editor="editor" />
        </slot>
      </v-card-title>
      <v-card-text class="pa-0">
        <bubble-menu
          v-if="editor"
          class="bubble-menu"
          :tippy-options="{ duration: 100 }"
          :editor="editor"
        >
          <slot-bubble-menu :editor="editor" />
        </bubble-menu>
        <floating-menu
          v-if="editor"
          class="floating-menu"
          :tippy-options="{ duration: 100 }"
          :editor="editor"
        >
          <slot-floafing-menu :editor="editor" />
        </floating-menu>
        <editor-content :editor="editor" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import toolbar from '@/components/tiptap/toolbar/toolbar'
  import SlotBubbleMenu from "@/components/tiptap/SlotBubbleMenu"
  import SlotFloafingMenu from "@/components/tiptap/SlotFloafingMenu"
  import TiptapInteractiveKatex from '@/components/tiptap/formula/extention'
  import TiptapInteractiveImageUpload from "@/components/tiptap/ImageUpload/extension";

  import StarterKit from '@tiptap/starter-kit'
  import Table from '@tiptap/extension-table'
  import TableRow from '@tiptap/extension-table-row'
  import TableCell from '@tiptap/extension-table-cell'
  import TableHeader from '@tiptap/extension-table-header'
  import TextAlign from '@tiptap/extension-text-align'
  import Highlight from '@tiptap/extension-highlight'

  // import Document from '@tiptap/extension-document'
  // import Text from '@tiptap/extension-text'
  // import Paper from './Drawing/Paper.js'

  import {
    Editor,
    EditorContent,
    BubbleMenu,
    FloatingMenu
  } from '@tiptap/vue-2'

  // import {EditorView} from "prosemirror-view";
  // import {EditorState} from "prosemirror-state";
  // import {posToDOMRect} from "@tiptap/core";

  export default {
    name: 'VueTiptapPlus',
    components: {
      EditorContent,
      BubbleMenu,
      FloatingMenu,
      toolbar,
      SlotBubbleMenu,
      SlotFloafingMenu
    },
    props: ['value'],
    data() {
      return {
        editor: null,
      }
    },
    mounted() {

      let that = this

      this.editor = new Editor({
        content: this.value,
        extensions: [
          StarterKit,
          TextAlign,
          Highlight,
          // Document.extend({
          //   content: 'paper',
          // }),
          // Text,
          // Paper,
          Table.configure({
            resizable: true,
          }),
          TableRow,
          TableHeader,
          TableCell,
          TiptapInteractiveKatex,
          TiptapInteractiveImageUpload
        ],
        // triggered on every change
        onUpdate() {
          that.$emit('input', this.getHTML())
            console.log('html', this.getHTML())
          // const json =
          // send the content to an API here
        },
      })

      // this.editor.on('focus', this.focusHandler)
      // this.editor.on('blur', this.blurHandler)
    },
    beforeDestroy() {
      this.editor.destroy()
    },
    methods: {
      // focusHandler() {
      //   console.log('focusHandler -> this.editor.view', this.editor.view)
      //   // we use `setTimeout` to make sure `selection` is already updated
      //   setTimeout(() => this.update(this.editor.view))
      // },
      // blurHandler(data) {
      //   console.log('blurHandler -> data', data)
      //   // if (this.preventHide) {
      //   //   this.preventHide = false
      //   //
      //   //   return
      //   // }
      //   //
      //   // if (
      //   //         event?.relatedTarget
      //   //         && this.element.parentNode?.contains(event.relatedTarget as Node)
      //   // ) {
      //   //   return
      //   // }
      //   //
      //   // this.hide()
      // },
      // update(view, oldState) {
      //   const {state, composing} = view
      //   const {doc, selection} = state
      //   const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection)
      //   if (composing || isSame)
      //   {
      //     return
      //   }
      //   const {empty, $anchor, ranges} = selection
      //   // support for CellSelections
      //   const from = Math.min(...ranges.map(range => range.$from.pos))
      //   const to = Math.max(...ranges.map(range => range.$to.pos))
      //
      //   console.log('report : ', {from, to, empty, $anchor, ranges})
      //   console.log('report222 : ', posToDOMRect(view, from, to))
      //   // Sometime check for `empty` is not enough.
      //   // Doubleclick an empty paragraph returns a node size of 2.
      //   // So we check also for an empty text size.
      //   // if (empty || !$anchor.parent.textContent)
      //   // {
      //   //   this.hide()
      //   //   return
      //   // }
      //   // this.tippy.setProps({
      //   //   getReferenceClientRect: () => posToDOMRect(view, from, to),
      //   // })
      //   // this.show()
      // }
    },
  }
</script>

<style>
  .ProseMirror {
      outline: none;
      padding: 20px;
      border-top: solid 1px #dedede;
  }

  .tiptap-plus-container {
    width: 90%;
    margin: 0 5%;
    border-radius: 10px;

  }

  .tiptap-plus .tiptap-header {
    background-color: #e9ecf4;
      padding: 8px;
  }
</style>

<style lang="scss">
    /* Basic editor styles */
    .ProseMirror {

        > * + * {
            margin-top: 0.75em;
        }

        ul,
        ol {
            padding: 0 1rem;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            line-height: 1.1;
        }

        code {
            background-color: rgba(#616161, 0.1);
            color: #616161;
        }

        pre {
            background: #0D0D0D;
            color: #FFF;
            font-family: 'JetBrainsMono', monospace;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;

            code {
                color: inherit;
                padding: 0;
                background: none;
                font-size: 0.8rem;
            }
        }

        img {
            max-width: 100%;
            height: auto;
        }

        blockquote {
            padding-left: 1rem;
            border-left: 2px solid rgba(#0D0D0D, 0.1);
        }

        hr {
            border: none;
            border-top: 2px solid rgba(#0D0D0D, 0.1);
            margin: 2rem 0;
        }
    }

    /* Table-specific styling */
    .ProseMirror {
        table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            margin: 0;
            overflow: hidden;

            td,
            th {
                min-width: 1em;
                border: 2px solid #ced4da;
                padding: 3px 5px;
                vertical-align: top;
                box-sizing: border-box;
                position: relative;

                > * {
                    margin-bottom: 0;
                }
            }

            th {
                font-weight: bold;
                text-align: left;
                background-color: #f1f3f5;
            }

            .selectedCell:after {
                z-index: 2;
                position: absolute;
                content: "";
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background: rgba(200, 200, 255, 0.4);
                pointer-events: none;
            }

            .column-resize-handle {
                position: absolute;
                right: -2px;
                top: 0;
                bottom: -2px;
                width: 4px;
                background-color: #adf;
                pointer-events: none;
            }
        }
    }

    .tableWrapper {
        overflow-x: auto;
        table {
            float: left;
        }
    }

    .resize-cursor {
        cursor: ew-resize;
        cursor: col-resize;
    }
</style>
