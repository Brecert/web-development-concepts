import { h, PickWritable } from './dom'

// templateData = {
//   // Inherit state
//   add: ({ value }) => ({
//     attributes: {
//       onclick: (event) => value += 1
//     }
//   }),
//   value({ value }): {
//     hooks: [
//       [[value], () => selectedElements.value.innerText = value ?? 0]
//     ]
//   },
//   sub: ({ value }) => ({
//     attributes: {
//       onclick: (event) => value -= 1
//     }
//   }),
// }

const template = <template>
  <button data-template="add">+</button>
  <span data-template="value"></span>
  <button data-template="sub">-</button>
</template>

type TemplateData<T> = {
  [k: string]: (props: T) => TemplateStruct
}

type TemplateStruct = {
  attributes?: Partial<PickWritable<HTMLElement>>,
  hooks?: [any, () => void][]
}

const selectedElements: Record<string, HTMLElement> = {}
template.querySelectorAll('[data-template]').forEach(item => {
  let el = item as HTMLElement
  selectedElements[el.dataset.template!] = el
})

const templateData: TemplateData<{ value: any }> = {
  // Inherit state
  add: (state) => ({
    attributes: {
      onclick: (event) => state.value += 1
    }
  }),
  value: (state) => ({
    hooks: [
      [state.value, () => selectedElements.value.innerText = state.value ?? 0]
    ]
  }),
  sub: (state) => ({
    attributes: {
      onclick: (event) => state.value -= 1
    }
  }),
}
