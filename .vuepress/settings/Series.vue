<template>
  <aside class="series-container">
    <SiteBrand />
    <SeriesItem v-for="item in sortedSeries" :item="item" :key="item.link || item.text" />
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client'
import { useSeriesItems, useSortSeries } from '../composables'
import { SeriesItem } from './SeriesItem'
import SiteBrand from './SiteBrand.vue'

const themeLocal = useThemeLocaleData()
const { sortSeries } = useSortSeries()
const seriesItems = useSeriesItems()

const sortedSeries = computed(() => {
  if (!themeLocal.value.autoSetSeries) {
    const temp = sessionStorage.getItem('seriesItems')
    if(!temp || temp === '[]') {
      sessionStorage.setItem('seriesItems', JSON.stringify(seriesItems.value))
      return seriesItems.value
    
    }
    return JSON.parse(temp)
  }

  const series = sortSeries(seriesItems.value)
  return series
})
</script>
