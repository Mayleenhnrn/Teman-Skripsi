<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { useBimbinganStore } from '../stores/bimbingan'
import { useFocusStore } from '../stores/focus'
import MotivasiCard from '../components/dashboard/MotivasiCard.vue'
import ProgressCard from '../components/dashboard/ProgressCard.vue'
import BimbinganCard from '../components/dashboard/BimbinganCard.vue'
import StatsCard from '../components/dashboard/StatsCard.vue'
import TipsCard from '../components/dashboard/TipsCard.vue'
import QuickMenu from '../components/dashboard/QuickMenu.vue'

const router = useRouter()
const progressStore = useProgressStore()
const bimbinganStore = useBimbinganStore()
const focusStore = useFocusStore()

// Computed data from stores
const progress = computed(() => progressStore.overallProgress)
const focusTime = computed(() => parseFloat(focusStore.todayFocusHours))
const streak = computed(() => focusStore.streak)

const nextBimbingan = computed(() => {
  if (bimbinganStore.upcomingBimbingan) {
    return {
      tanggal: bimbinganStore.upcomingBimbingan.tanggal,
      waktu: bimbinganStore.upcomingBimbingan.waktu,
      dosen: 'Dr. Puji Rahayu, M.Kom'
    }
  }
  return {
    tanggal: '2024-10-24',
    waktu: '10:00',
    dosen: 'Dr. Puji Rahayu, M.Kom'
  }
})

const handleViewProgressDetail = () => {
  router.push('/progress')
}

const handleViewBimbinganDetail = () => {
  router.push('/bimbingan')
}

const handleQuickMenuNavigate = (menuId) => {
  router.push({ name: menuId })
}
</script>

<template>
  <div class="beranda-page">
    <!-- Motivasi Hari Ini -->
    <MotivasiCard />
    
    <!-- Main Content Grid -->
    <div class="main-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Progress Skripsi -->
        <ProgressCard 
          :progress="progress" 
          @viewDetail="handleViewProgressDetail"
        />
        
        <!-- Stats Row -->
        <StatsCard 
          :focusTime="focusTime"
          :streak="streak"
        />
      </div>
      
      <!-- Right Column -->
      <div class="right-column">
        <!-- Bimbingan Berikutnya -->
        <BimbinganCard 
          :jadwal="nextBimbingan"
          @viewDetail="handleViewBimbinganDetail"
        />
        
        <!-- Tips Produktif -->
        <TipsCard />
      </div>
    </div>
    
    <!-- Quick Menu -->
    <QuickMenu @navigate="handleQuickMenuNavigate" />
  </div>
</template>

<style scoped>
.beranda-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
</style>
