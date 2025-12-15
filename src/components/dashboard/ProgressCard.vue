<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 45
  }
})

const emit = defineEmits(['viewDetail'])

const progressMessage = computed(() => {
  if (props.progress < 25) {
    return 'Semangat! Perjalanan baru dimulai 💪'
  } else if (props.progress < 50) {
    return 'Kamu sudah menyelesaikan hampir setengah perjalanan! 🎉'
  } else if (props.progress < 75) {
    return 'Lebih dari setengah jalan! Terus pertahankan! 🚀'
  } else if (props.progress < 100) {
    return 'Hampir selesai! Sedikit lagi menuju wisuda! 🎓'
  } else {
    return 'Selamat! Kamu sudah menyelesaikan skripsimu! 🎊'
  }
})
</script>

<template>
  <div class="progress-card">
    <div class="progress-header">
      <h3 class="progress-title">Progress Skripsi</h3>
      <button class="view-detail-btn" @click="$emit('viewDetail')">
        Lihat Detail
      </button>
    </div>
    
    <div class="progress-content">
      <div class="progress-info">
        <span class="progress-label">Keseluruhan</span>
        <span class="progress-percentage">{{ progress }}%</span>
      </div>
      
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      
      <p class="progress-message">{{ progressMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.progress-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.progress-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.view-detail-btn {
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.view-detail-btn:hover {
  color: var(--primary-blue-dark);
  text-decoration: underline;
}

.progress-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.progress-percentage {
  font-size: 16px;
  font-weight: 600;
  color: var(--accent-green);
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: #E2E8F0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22C55E 0%, #16A34A 100%);
  border-radius: 999px;
  transition: width 0.5s ease;
}

.progress-message {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}
</style>
