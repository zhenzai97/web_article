import mitt from "mitt"

const emitter = mitt()

const key = Symbol("ROUTE_CHANGE")

let latestRoute

export function setRouteChange(to) {
  emitter.emit(key, to)
  latestRoute = to
}

export function useRouteListener() {
  const callbackList = []

  const listenerRouteChange = (callback, immediate = false) => {
    callbackList.push(callback)
    emitter.on(key, callback)
    immediate && latestRoute && callback(latestRoute)
  }

  const removeRouteListener = (callback) => {
    emitter.off(key, callback)
  }

  onBeforeUnmount(() => {
    callbackList.forEach(removeRouteListener)
  })

  return { listenerRouteChange, removeRouteListener }
}
