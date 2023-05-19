// @prevent-import-in-mobile
import renderPc from './pc'
// @prevent-import-in-pc
import renderMobile from './mobile'

const isMobile: boolean = ['Android', 'iPhone', 'iPad'].some(i => navigator.userAgent.includes(i))

if (isMobile) {
  renderMobile()
} else {
  renderPc()
}