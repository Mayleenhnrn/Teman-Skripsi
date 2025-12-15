<script setup>
const props = defineProps({
  focusTime: {
    type: Number,
    default: 2.5 // dalam jam
  },
  streak: {
    type: Number,
    default: 5
  }
})

const formatTime = (hours) => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} menit`
  }
  return `${hours} jam`
}
</script>

<template>
  <div class="stats-row">
    <!-- Fokus Hari Ini -->
    <div class="stat-card focus-card">
      <div class="stat-header">
        <span class="stat-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </span>
        <span class="stat-label">Fokus Hari Ini</span>
      </div>
      <div class="stat-value">{{ formatTime(focusTime) }}</div>
    </div>
    
    <!-- Streak -->
    <div class="stat-card streak-card">
      <div class="stat-header">
        <span class="stat-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
        </span>
        <span class="stat-label">Streak</span>
      </div>
      <div class="stat-value streak-value">{{ streak }} hari 🔥</div>
    </div>
  </div>
</template>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.focus-card {
  background-color: var(--bg-card);
  box-shadow: var(--shadow-sm);
}

.streak-card {
  background: linear-gradient(135deg, #FEF9E7 0%, #FEF3C7 100%);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.streak-value {
  color: var(--text-primary);
}
</style>
