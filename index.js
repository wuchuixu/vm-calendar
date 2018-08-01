import VmCalendar from './src/main.vue'
 
export default VmCalendar;
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('vm-calendar', VmCalendar);
}