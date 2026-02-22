import DefaultTheme from 'vitepress/theme'
import './tailwind.css'
import BrainWar from '../components/BrainWar.vue'
import CurrencyConverter from '../components/CurrencyConverter.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('BrainWar', BrainWar)
    app.component('CurrencyConverter', CurrencyConverter)
  }
}
