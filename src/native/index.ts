import event from '@/utils/event-bus'
let errorLog = console.error
let SDE_ERROR_TAG = ''
event.on('sde__error_tag', (tag) => {
  SDE_ERROR_TAG = tag
  console.log(2, tag)

})

console.error = (...params:any) => {
  if(typeof params[0] == 'string' && params[0].indexOf('THREE.WebGLProgram:') > -1) {
    event.emit('sde__error', {
      tag: SDE_ERROR_TAG,
      errorData: [...params]
    })
  }
  errorLog(...params)
}