import App from './App.svelte';

const wrapperToAppMap = new Map()

const init = (context) => {
  const wrapper = document.createElement('div')
  const app = new App({
    target: wrapper,
    props: { context, pContext: undefined }
  })
  wrapperToAppMap.set(wrapper, app)
  return wrapper
}

const update = (wrapper, context, pContext) => {
  const app = wrapperToAppMap.get(wrapper)
  if (app !== undefined) app.$set({ context, pContext })
}

window.__intro_module_for_scrllgngn = {
  init,
  update
}

/* pour dév */

const defaultContext = {
  height: window.innerHeight,
  width: window.innerWidth,
  page: 0,
  progression: 0,
  pageProgression: 0
}

let prevContext = defaultContext

const devWrapper = init(defaultContext)
document.body.appendChild(devWrapper)

const handleScroll = (e) => {
  const scrollMax = document.documentElement.scrollHeight - document.documentElement.offsetHeight
  const scrollValue = document.documentElement.scrollTop

  const updatedContext = { ...defaultContext }
  updatedContext.progression = scrollValue / scrollMax

  update(devWrapper, updatedContext, prevContext)

  prevContext = updatedContext
}

window.addEventListener('scroll', handleScroll)
