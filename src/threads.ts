// TODO: use better names

// This is really poorly designed, one of the goals was to have it based on MessageChannels 
// so it could be a shared observer thread across states, 
// but it doesn't really work like that at the moment.

// The idea is that a thread is a "thread" of events (maybe it should be called chain)
// The thread would get passed around between actual threads (workers, realms) so that it'd be easy to handle state
// I'm actually unsure if this would work really, thus the idea of testing it
// I'm also unsure if you should really mix state and workers like that, keeping thems separate to some degree seems to be a good practice.

// I would like the experiment more with proxies, as the perforance of them matched my naive MessageChannel performance,
// however proxies don't work across contexts.

/*
# some ideas
const value = proxy(0)

<pre>
  <button onclick=${() => value += 1}>+</button>
  {value}
  <button onclick=${() => value -= 1}>-</button>
</pre>

becomes

dynamicValues = [
  createComputedNode(
    value, 
    updatedValue => dynamicValues[0].nodeValue = updatedValue
  )
]

h "pre", {}, [
  h "button", { onclick = ... }, '+';
  dynamicValues[0] ;
  h "button", { onclick = ... }, '-';
]

(This is feeling pretty much like solid but at runtime)
*/

export const Thread: unique symbol = Symbol("thread");

export type Fn<T> = (val: T) => void;

export type Thread<T> = {
  channel: MessageChannel;
  [Thread]: true;
} & Fn<T>;

export const isThread = <T>(val: T | Fn<T>): val is Thread<T> =>
  typeof val === "function" &&
  ((val as unknown) as Thread<T>)?.[Thread] != null;

export function createThread<T>(fn: Fn<T> | Thread<T>): Thread<T> {
  const thread = fn as Thread<T>;
  thread[Thread] = true;
  thread.channel ??= new MessageChannel();
  thread.channel.port2.start();
  return thread;
}

export function subscribe<T>(value: Thread<T> | T, fn: Fn<T>): void {
  if (isThread(value)) {
    value.channel.port2.addEventListener("message", (e) => fn(e.data), false);
  } else {
    fn(value);
  }
}

export function channel<T>(
  init: T,
  thread: Thread<T> = createThread(() => {})
) {
  let sendChannel = thread.channel.port1;
  let value = init;

  subscribe(thread, thread);

  const setData = (val: T) => {
    value = val;
    sendChannel.postMessage(value);
  };

  return {
    get: () => value,
    set: setData,
    thread: thread,
  } as const;
}
