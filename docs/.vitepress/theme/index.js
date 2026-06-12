import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './tailwind.css'
import './custom.css'
import BrainWar from '../components/BrainWar.vue'
import CurrencyConverter from '../components/CurrencyConverter.vue'
import AppList from '../components/AppList.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('BrainWar', BrainWar)
    app.component('CurrencyConverter', CurrencyConverter)
    app.component('AppList', AppList)
  }
}
