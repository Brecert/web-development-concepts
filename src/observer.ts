const observable: unique symbol = Symbol("observable");
const completed: unique symbol = Symbol.for("complete observable")

// This whole API is not performant, simply because it uses iterators but also adding new `once` listeners and whatnot...
// Seriously, this is going to be inefficient
// It looks "clean" to me though, even if inefficient

export type Fn<T> = (val: T) => unknown

export interface Observer<T> {
  readonly value: () => T
  readonly [observable]: MessageChannel;
  // [Symbol.iterator](): IterableIterator<T>
  [Symbol.asyncIterator](): AsyncIterableIterator<T>
}

const awaitEvent = <T>(channel: MessageChannel): Promise<T> => {
  return new Promise((res, rej) => {
    channel.port2.addEventListener('message', event => res(event.data), { once: true })
    channel.port2.addEventListener('messageerror', event => rej(event.data), { once: true })
  })
}

export async function* asyncIterEvents<T>(channel: MessageChannel) {
  while(true) {
    yield await awaitEvent<T>(channel)
  }
}

export const isObserver = (val: unknown): val is Observer<unknown> => 
  typeof val === 'object' 
    && val != null 
    && observable in val

export const subscribe = async <T>(o: Observer<T> | T, fn: Fn<T>) => {
  if(!isObserver(o)) return fn(o)
  
  for await (const val of o) {
    fn(val)
  }
}

export const observe = <T>(val: T): Observer<T> => {
  let channel = new MessageChannel();
  channel.port2.start();

  channel.port2.addEventListener('message', (event: MessageEvent<T | typeof completed>) => {
    if(event.data === completed) {
      channel.port1.close()
      channel.port2.close()
    } else {
      val = event.data
    }
  })

  return {
    value: () => val,
    [observable]: channel,
    // [Symbol.iterator]: () => iterEvents<T>(channel),
    [Symbol.asyncIterator]: () => asyncIterEvents<T>(channel)
  };
};

export const update = <T>(o: Observer<T>, val?: T) => {
  o[observable].port1.postMessage(val !== undefined ? val : o.value())
}

export const symbols = {
  observable,
  completed
}