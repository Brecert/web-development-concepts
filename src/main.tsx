import { observe, update, subscribe } from './observer'
import { h } from './dom'
import { callRoute, Route } from './routes'

// hi!
// These are just some ideas and tests that I've wanted to make
// As far as I know there's nothing particularly exciting about them, I just wanted to have some fun making them


const count = observe(0)
const addCount = () => update(count, count.value() + 1)
const subCount = () => update(count, count.value() - 1)

subscribe(count, val => console.log(`Updating count to: ${val}`));

const DefaultView = () => {
  return (
    <div>
      <a href="#test" >Goto #test</a>
    Hello world!
      <button onclick={addCount}>+</button>
      <span>{count}</span>
      <button onclick={subCount}>-</button>
    Hello world
    </div>
  )
}

const TestingView = () => {
  return (
    <h1>
      Test!
    </h1>
  )
}

// const currentView = observe(<DefaultView />)

// console.log(currentView)

// const routes: Route[] = [
//   [
//     /#test/,
//     () => {
//       update(currentView, <TestingView />)
//     },
//   ],
//   [
//     /#?/,
//     () => {
//       update(currentView, <DefaultView />)
//     }
//   ]
// ]

// window.addEventListener('hashchange', _ => {
//   callRoute(location.hash, routes)
// })

const App = (
  <DefaultView />
)

document.body.append(
  App
)