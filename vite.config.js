const path = require('path')
const srcPath = path.resolve(__dirname, './src')
/*
  alias 只能配置'/@/'
  同事路径也只能 '/@/'
  原因 尤大解释
  https://github.com/vitejs/vite/issues/279#issuecomment-635646269
  https://github.com/vitejs/vite/issues/279#issuecomment-636110354
*/
module.exports = { alias: { '/@/': path.resolve(__dirname, './src') } }