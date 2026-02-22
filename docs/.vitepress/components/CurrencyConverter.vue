<template>
  <div class="converter-container flex items-center justify-center p-4 font-sans mt-4 relative w-full">
    
    <div v-show="isLoading" class="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50 rounded-xl">
        <div class="spinner"></div>
        <p class="mt-4 text-slate-600 font-medium">Memuat data kurs terbaru...</p>
    </div>

    <div v-show="!isLoading" class="w-full max-w-2xl transition-opacity duration-500">

        <div class="space-y-4">
            <!-- From Currency -->
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Jumlah</label>
                <div class="flex relative">
                    <input v-model.number="amount" type="number" class="form-input w-2/3 appearance-none rounded-l-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:z-10 sm:text-sm">
                    
                    <div class="relative w-1/3" v-on-click-outside="closeFromDropdown">
                        <input v-model="fromSearch" @focus="fromDropdownOpen = true" type="text" class="search-input w-full rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 px-3 py-3 text-slate-800 focus:z-10 sm:text-sm font-medium" placeholder="Cari...">
                        <div v-show="fromDropdownOpen" class="search-results absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
                            <div v-if="filteredFromRates.length === 0" class="p-2 text-slate-500 text-sm">Tidak ditemukan.</div>
                            <div v-for="code in filteredFromRates" :key="code" @click="selectFrom(code)" class="p-2 hover:bg-blue-50 cursor-pointer text-sm">
                                {{ code }} - {{ currencyDetails[code]?.name || 'N/A' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Swap Button -->
            <div class="flex items-center justify-center py-2">
                <div class="w-full h-px bg-slate-200"></div>
                <button @click="swapCurrencies" class="mx-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-300 ease-in-out transform hover:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                </button>
                <div class="w-full h-px bg-slate-200"></div>
            </div>

            <!-- To Currency -->
            <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Hasil Konversi</label>
                <div class="flex relative">
                    <input :value="convertedAmountFormatted" readonly type="text" class="form-input w-2/3 bg-slate-100 rounded-l-lg border border-slate-300 px-4 py-3 text-slate-900 sm:text-sm font-semibold">
                    
                    <div class="relative w-1/3" v-on-click-outside="closeToDropdown">
                        <input v-model="toSearch" @focus="toDropdownOpen = true" type="text" class="search-input w-full rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 px-3 py-3 text-slate-800 focus:z-10 sm:text-sm font-medium" placeholder="Cari...">
                        <div v-show="toDropdownOpen" class="search-results absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
                            <div v-if="filteredToRates.length === 0" class="p-2 text-slate-500 text-sm">Tidak ditemukan.</div>
                            <div v-for="code in filteredToRates" :key="code" @click="selectTo(code)" class="p-2 hover:bg-blue-50 cursor-pointer text-sm">
                                {{ code }} - {{ currencyDetails[code]?.name || 'N/A' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-8 bg-transparent p-4 rounded-lg">
            <p v-if="rateError" class="text-sm font-medium text-red-600">{{ rateError }}</p>
            <p v-else class="text-sm font-medium text-slate-600">1 {{ fromCurrency }} = {{ singleUnitRateFormatted }} {{ toCurrency }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ lastUpdatedText }}</p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isLoading = ref(true)
const amount = ref(100)
const fromCurrency = ref('USD')
const toCurrency = ref('IDR')
const fromSearch = ref('USD')
const toSearch = ref('IDR')
const fromDropdownOpen = ref(false)
const toDropdownOpen = ref(false)
const rates = ref({})
const rateError = ref('')
const lastUpdatedUtc = ref('')

const currencyDetails = {
    "USD": { name: "United States Dollar", country: "United States" }, "EUR": { name: "Euro", country: "Euro Area" }, "JPY": { name: "Japanese Yen", country: "Japan" }, "GBP": { name: "British Pound", country: "United Kingdom" }, "AUD": { name: "Australian Dollar", country: "Australia" }, "CAD": { name: "Canadian Dollar", country: "Canada" }, "CHF": { name: "Swiss Franc", country: "Switzerland" }, "CNY": { name: "Chinese Yuan", country: "China" }, "HKD": { name: "Hong Kong Dollar", country: "Hong Kong" }, "NZD": { name: "New Zealand Dollar", country: "New Zealand" }, "SEK": { name: "Swedish Krona", country: "Sweden" }, "KRW": { name: "South Korean Won", country: "South Korea" }, "SGD": { name: "Singapore Dollar", country: "Singapore" }, "NOK": { name: "Norwegian Krone", country: "Norway" }, "MXN": { name: "Mexican Peso", country: "Mexico" }, "INR": { name: "Indian Rupee", country: "India" }, "RUB": { name: "Russian Ruble", country: "Russia" }, "ZAR": { name: "South African Rand", country: "South Africa" }, "TRY": { name: "Turkish Lira", country: "Turkey" }, "BRL": { name: "Brazilian Real", country: "Brazil" }, "IDR": { name: "Indonesian Rupiah", country: "Indonesia" }, "MYR": { name: "Malaysian Ringgit", country: "Malaysia" }, "THB": { name: "Thai Baht", country: "Thailand" }, "PHP": { name: "Philippine Peso", country: "Philippines" }, "VND": { name: "Vietnamese Dong", country: "Vietnam" }, "SAR": { name: "Saudi Riyal", country: "Saudi Arabia" }, "AED": { name: "UAE Dirham", country: "United Arab Emirates" }
}

onMounted(async () => {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD')
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        if (data.result === 'success') {
            rates.value = data.rates
            lastUpdatedUtc.value = data.time_last_update_utc
            isLoading.value = false
        } else {
            throw new Error('API return not success')
        }
    } catch (e) {
        rateError.value = 'Gagal memuat data kurs. Coba lagi nanti.'
        isLoading.value = false
    }
})

const filterRates = (searchCode) => {
    const term = searchCode.toLowerCase()
    return Object.keys(rates.value).filter(code => {
        if (!currencyDetails[code]) return false; // hide unsupported codes from search
        const details = currencyDetails[code]
        return code.toLowerCase().includes(term) ||
                (details && details.name.toLowerCase().includes(term)) ||
                (details && details.country.toLowerCase().includes(term))
    })
}

const filteredFromRates = computed(() => filterRates(fromSearch.value))
const filteredToRates = computed(() => filterRates(toSearch.value))

const convertedAmount = computed(() => {
    if (!rates.value[fromCurrency.value] || !rates.value[toCurrency.value] || isNaN(amount.value)) return 0
    const rateFrom = rates.value[fromCurrency.value]
    const rateTo = rates.value[toCurrency.value]
    return (amount.value / rateFrom) * rateTo
})

const convertedAmountFormatted = computed(() => {
    if (convertedAmount.value === 0) return ''
    return convertedAmount.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const singleUnitRateFormatted = computed(() => {
    if (!rates.value[fromCurrency.value] || !rates.value[toCurrency.value]) return 0
    const rateFrom = rates.value[fromCurrency.value]
    const rateTo = rates.value[toCurrency.value]
    const singleUnitRate = (1 / rateFrom) * rateTo
    return singleUnitRate.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
})

const lastUpdatedText = computed(() => {
    if (!lastUpdatedUtc.value) return 'Terakhir diperbarui: ...'
    const date = new Date(lastUpdatedUtc.value)
    return `Terakhir diperbarui: ${date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB`
})

const selectFrom = (code) => {
    fromCurrency.value = code
    fromSearch.value = code
    fromDropdownOpen.value = false
}

const selectTo = (code) => {
    toCurrency.value = code
    toSearch.value = code
    toDropdownOpen.value = false
}

const closeFromDropdown = () => {
    fromDropdownOpen.value = false
    fromSearch.value = fromCurrency.value
}

const closeToDropdown = () => {
    toDropdownOpen.value = false
    toSearch.value = toCurrency.value
}

const swapCurrencies = () => {
    const temp = fromCurrency.value
    fromCurrency.value = toCurrency.value
    toCurrency.value = temp
    fromSearch.value = fromCurrency.value
    toSearch.value = toCurrency.value
}

const vOnClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.converter-container { font-family: 'Inter', sans-serif; }
.form-input:focus, .search-input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.5);
    border-color: #3b82f6;
}
.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
    animation: spin 1s ease infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.search-results::-webkit-scrollbar { display: none; }
.search-results { -ms-overflow-style: none; scrollbar-width: none; }
</style>
