import Resize from './resize'
export default function registerDirective (vueInstance: any): void {
  vueInstance.directive('resize', Resize)
}
