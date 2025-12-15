<script setup>
import { ref, computed } from 'vue'

const quotes = [
  {
    text: 'Skripsi adalah perjalanan. Nikmati prosesnya, bukan hanya hasilnya.',
    author: 'Teman Skripsi'
  },
  {
    text: 'Setiap langkah kecil membawamu lebih dekat ke wisuda.',
    author: 'Teman Skripsi'
  },
  {
    text: 'Kesuksesan skripsi dimulai dari konsistensi, bukan motivasi.',
    author: 'Teman Skripsi'
  },
  {
    text: 'Kamu tidak harus sempurna, cukup terus maju.',
    author: 'Teman Skripsi'
  },
  {
    text: 'Revisi bukan kegagalan, tapi langkah menuju kesempurnaan.',
    author: 'Teman Skripsi'
  }
]

// Get random quote based on date (consistent per day)
const todayQuote = computed(() => {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  const index = dayOfYear % quotes.length
  return quotes[index]
})
</script>

<template>
  <div class="motivasi-card">
    <div class="motivasi-icon">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4L18 12L26 14L18 16L16 24L14 16L6 14L14 12L16 4Z" fill="#F59E0B"/>
        <path d="M6 6L7 9L10 10L7 11L6 14L5 11L2 10L5 9L6 6Z" fill="#FBBF24"/>
        <path d="M26 20L27 23L30 24L27 25L26 28L25 25L22 24L25 23L26 20Z" fill="#FBBF24"/>
      </svg>
    </div>
    <div class="motivasi-content">
      <span class="motivasi-label">Motivasi Hari Ini</span>
      <p class="motivasi-text">{{ todayQuote.text }}</p>
      <span class="motivasi-author">— {{ todayQuote.author }}</span>
    </div>
  </div>
</template>

<style scoped>
.motivasi-card {
  background: linear-gradient(135deg, #FEF9E7 0%, #FEF3C7 100%);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.motivasi-icon {
  flex-shrink: 0;
}

.motivasi-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.motivasi-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.motivasi-text {
  font-size: 18px;
  font-weight: 500;
  font-style: italic;
  color: var(--text-primary);
  line-height: 1.5;
}

.motivasi-author {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
