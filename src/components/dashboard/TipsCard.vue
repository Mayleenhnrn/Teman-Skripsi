<script setup>
const tips = [
  'Gunakan Focus Timer untuk sesi 25 menit',
  'Istirahat setiap 2 jam dengan mini games',
  'Tulis refleksi harian di diary'
]
</script>

<template>
  <div class="tips-card">
    <h3 class="tips-title">Tips Produktif</h3>
    <ul class="tips-list">
      <li v-for="(tip, index) in tips" :key="index" class="tip-item">
        <span class="tip-bullet"></span>
        <span class="tip-text">{{ tip }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tips-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  height: 100%;
}

.tips-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.tip-bullet {
  width: 8px;
  height: 8px;
  background-color: var(--accent-orange);
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.tip-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
