import { observe, update, subscribe } from './observer'
import { h } from './dom'

// hi!
// These are just some ideas and tests that I've wanted to make
// As far as I know there's nothing particularly exciting about them, I just wanted to have some fun making them


const count = observe(0)
const addCount = () => update(count, count.value() + 1)
const subCount = () => update(count, count.value() - 1)

subscribe(count, val => console.log(`Updating count to: ${val}`));

const App = (
  <div title={"Hello world"}>
    Hello world!
    <button onclick={addCount}>+</button>
    <span>{count}</span>
    <button onclick={subCount}>-</button>
    Hello world
  </div>
)

console.log(App)

document.body.append(
  App
)

update(count)