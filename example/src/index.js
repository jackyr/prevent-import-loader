// @only-import-in-pc
import renderPc from './pc'
// @only-import-in-mobile
import renderMobile from './mobile'

const isMobile = ['Android', 'iPhone', 'iPad'].some(i => navigator.userAgent.includes(i))

if (isMobile) {
  renderMobile()
} else {
  renderPc()
}