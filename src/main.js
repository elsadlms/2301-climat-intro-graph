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
