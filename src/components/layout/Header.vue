<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const props = defineProps({
  title: {
    type: String,
    default: 'Beranda'
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const userName = computed(() => authStore.userName || 'Mahasiswa')
const userInitials = computed(() => {
  const name = authStore.userName || 'M'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
})

const currentDate = computed(() => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  
  const now = new Date()
  const dayName = days[now.getDay()]
  const date = now.getDate()
  const month = months[now.getMonth()]
  const year = now.getFullYear()
  
  return `${dayName}, ${date} ${month} ${year}`
})
</script>

<template>
  <header class="header">
    <div class="header-left">
      <h1 class="header-title">{{ title }}</h1>
      <p v-if="subtitle" class="header-subtitle">{{ subtitle }}</p>
    </div>
    <div class="header-right">
      <div class="user-info">
        <div class="user-avatar">{{ userInitials }}</div>
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="date-value">{{ currentDate }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.date-label {
  font-size: 12px;
  color: var(--text-muted);
}

.date-value {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
