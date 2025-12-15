<script setup>
import { ref } from 'vue'

const activeTab = ref('quotes') // quotes, music, breathing

// Motivational Quotes
const quotes = [
  { text: 'Skripsi adalah perjalanan, bukan tujuan akhir. Nikmati prosesnya!', author: 'Teman Skripsi' },
  { text: 'Setiap halaman yang kamu tulis membawamu lebih dekat ke wisuda.', author: 'Teman Skripsi' },
  { text: 'Revisi bukan kegagalan, tapi langkah menuju kesempurnaan.', author: 'Teman Skripsi' },
  { text: 'Konsistensi mengalahkan motivasi. Terus menulis walau sedikit.', author: 'Teman Skripsi' },
  { text: 'Kamu tidak sendirian dalam perjalanan ini.', author: 'Teman Skripsi' },
  { text: 'Istirahat adalah bagian dari proses, bukan penghambat.', author: 'Teman Skripsi' },
  { text: 'Satu langkah kecil setiap hari akan membawamu jauh.', author: 'Teman Skripsi' },
  { text: 'Jangan bandingkan progressmu dengan orang lain.', author: 'Teman Skripsi' }
]

const currentQuoteIndex = ref(0)
const currentQuote = ref(quotes[0])

const nextQuote = () => {
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.length
  currentQuote.value = quotes[currentQuoteIndex.value]
}

const prevQuote = () => {
  currentQuoteIndex.value = (currentQuoteIndex.value - 1 + quotes.length) % quotes.length
  currentQuote.value = quotes[currentQuoteIndex.value]
}

// Lofi Music Links (YouTube embeds can be used, or just show suggestions)
const musicSuggestions = [
  { title: 'Lofi Hip Hop Radio', description: 'Beats to relax/study to', icon: '🎵' },
  { title: 'Coffee Shop Ambience', description: 'Suara cafe untuk fokus', icon: '☕' },
  { title: 'Rain Sounds', description: 'Suara hujan yang menenangkan', icon: '🌧️' },
  { title: 'Nature Sounds', description: 'Suara alam untuk relaksasi', icon: '🌿' }
]

// Breathing Exercise
const breathingPhase = ref('idle') // idle, inhale, hold, exhale
const breathingTimer = ref(0)
let breathingInterval = null

const startBreathing = () => {
  if (breathingPhase.value !== 'idle') {
    stopBreathing()
    return
  }
  
  breathingPhase.value = 'inhale'
  breathingTimer.value = 4
  
  breathingInterval = setInterval(() => {
    breathingTimer.value--
    
    if (breathingTimer.value === 0) {
      if (breathingPhase.value === 'inhale') {
        breathingPhase.value = 'hold'
        breathingTimer.value = 7
      } else if (breathingPhase.value === 'hold') {
        breathingPhase.value = 'exhale'
        breathingTimer.value = 8
      } else if (breathingPhase.value === 'exhale') {
        breathingPhase.value = 'inhale'
        breathingTimer.value = 4
      }
    }
  }, 1000)
}

const stopBreathing = () => {
  if (breathingInterval) {
    clearInterval(breathingInterval)
    breathingInterval = null
  }
  breathingPhase.value = 'idle'
  breathingTimer.value = 0
}

const getBreathingInstruction = () => {
  switch (breathingPhase.value) {
    case 'inhale': return 'Tarik napas...'
    case 'hold': return 'Tahan...'
    case 'exhale': return 'Hembuskan...'
    default: return 'Mulai'
  }
}

// Quick Mood Boosters
const quickBoosters = [
  { icon: '🚶', title: 'Jalan Sebentar', desc: 'Keluar dan jalan 5 menit' },
  { icon: '💧', title: 'Minum Air', desc: 'Hidrasi penting untuk otak' },
  { icon: '🧘', title: 'Stretching', desc: 'Regangkan badan sejenak' },
  { icon: '🎵', title: 'Dengar Musik', desc: 'Putar lagu favoritmu' },
  { icon: '😊', title: 'Senyum', desc: 'Senyum bisa tingkatkan mood' },
  { icon: '🌞', title: 'Lihat Cahaya', desc: 'Buka jendela, lihat keluar' }
]
</script>

<template>
  <div class="mood-page">
    <div class="page-header">
      <h2>Mood Booster ✨</h2>
      <p>Tingkatkan semangat dan mood-mu</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        :class="['tab', { active: activeTab === 'quotes' }]"
        @click="activeTab = 'quotes'"
      >
        💭 Quotes
      </button>
      <button 
        :class="['tab', { active: activeTab === 'quick' }]"
        @click="activeTab = 'quick'"
      >
        ⚡ Quick Boost
      </button>
    </div>

    <!-- Quotes Tab -->
    <div v-if="activeTab === 'quotes'" class="tab-content">
      <div class="quote-card">
        <button class="quote-nav prev" @click="prevQuote">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        
        <div class="quote-content">
          <div class="quote-icon">💫</div>
          <p class="quote-text">"{{ currentQuote.text }}"</p>
          <span class="quote-author">— {{ currentQuote.author }}</span>
        </div>
        
        <button class="quote-nav next" @click="nextQuote">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
      
      <div class="quote-dots">
        <span 
          v-for="(_, index) in quotes" 
          :key="index"
          :class="['dot', { active: currentQuoteIndex === index }]"
          @click="currentQuoteIndex = index; currentQuote = quotes[index]"
        ></span>
      </div>
    </div>

    <!-- Quick Boost Tab -->
    <div v-if="activeTab === 'quick'" class="tab-content">
      <div class="boosters-grid">
        <div v-for="booster in quickBoosters" :key="booster.title" class="booster-card">
          <span class="booster-icon">{{ booster.icon }}</span>
          <h4>{{ booster.title }}</h4>
          <p>{{ booster.desc }}</p>
        </div>
      </div>
      
      <div class="music-section">
        <h3>🎧 Rekomendasi Musik</h3>
        <div class="music-grid">
          <div v-for="music in musicSuggestions" :key="music.title" class="music-card">
            <span class="music-icon">{{ music.icon }}</span>
            <div class="music-info">
              <h4>{{ music.title }}</h4>
              <p>{{ music.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mood-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header h2 {
  font-size: 24px;
  margin-bottom: 4px;
}

.page-header p {
  color: var(--text-secondary);
}

.tabs {
  display: flex;
  gap: 8px;
  background-color: var(--bg-card);
  padding: 8px;
  border-radius: var(--radius-lg);
}

.tab {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: var(--radius-md);
  background: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.tab:hover {
  background-color: var(--bg-sidebar);
}

.tab.active {
  background-color: var(--primary-blue);
  color: white;
}

/* Quotes */
.quote-card {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: var(--radius-xl);
  padding: 48px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
}

.quote-nav {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  color: white;
  flex-shrink: 0;
}

.quote-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

.quote-content {
  flex: 1;
  text-align: center;
}

.quote-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.quote-text {
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: 16px;
}

.quote-author {
  font-size: 14px;
  opacity: 0.8;
}

.quote-dots {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dot.active {
  background-color: var(--primary-blue);
  width: 28px;
  border-radius: 5px;
}

/* Breathing */
.breathing-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 40px;
  text-align: center;
}

.breathing-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.breathing-desc {
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.breathing-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%);
  margin: 0 auto 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 4s ease;
}

.breathing-circle.inhale {
  transform: scale(1.2);
  transition: transform 4s ease;
}

.breathing-circle.hold {
  transform: scale(1.2);
  transition: none;
}

.breathing-circle.exhale {
  transform: scale(1);
  transition: transform 8s ease;
}

.breathing-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.breathing-timer {
  font-size: 48px;
  font-weight: 700;
}

.breathing-instruction {
  font-size: 16px;
  opacity: 0.9;
}

.breathing-btn {
  padding: 14px 32px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 32px;
}

.breathing-btn.stop {
  background-color: #EF4444;
}

.breathing-steps {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.step-num {
  width: 24px;
  height: 24px;
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
}

/* Quick Boosters */
.boosters-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.booster-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.booster-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-blue);
}

.booster-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
}

.booster-card h4 {
  font-size: 15px;
  margin-bottom: 4px;
}

.booster-card p {
  font-size: 12px;
  color: var(--text-secondary);
}

.music-section {
  margin-top: 32px;
}

.music-section h3 {
  font-size: 18px;
  margin-bottom: 16px;
}

.music-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.music-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.music-card:hover {
  background-color: var(--primary-blue-light);
}

.music-icon {
  font-size: 32px;
}

.music-info h4 {
  font-size: 14px;
  margin-bottom: 2px;
}

.music-info p {
  font-size: 12px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .boosters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .music-grid {
    grid-template-columns: 1fr;
  }
  
  .breathing-steps {
    flex-direction: column;
    align-items: center;
  }
}
</style>
