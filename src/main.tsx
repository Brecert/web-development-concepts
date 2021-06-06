import * as fumi from './threads'
import { h } from './dom'

// hi!
// These are just some ideas and tests that I've wanted to make
// As far as I know there's nothing particularly exciting about them, I just wanted to have some fun making them


const count = fumi.channel(0)
const addCount = () => count.set(count.get() + 1)
const subCount = () => count.set(count.get() - 1)

fumi.subscribe(count.thread, val => console.log(`Updating count to: ${val}`));


const App = (
  <div title={"Hello world"}>
    Hello world!
    <button onclick={addCount}>+</button>
    <span>{count.thread}</span>
    <button onclick={subCount}>-</button>
    Hello world
  </div>
)

console.log(App)

document.body.append(
  App
)