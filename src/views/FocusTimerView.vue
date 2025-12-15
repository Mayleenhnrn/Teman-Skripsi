<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useFocusStore } from '../stores/focus'

const focusStore = useFocusStore()

// Timer states
const timerMode = ref('focus') // focus, shortBreak, longBreak
const timeLeft = ref(focusStore.settings.focusDuration)
const isRunning = ref(false)
const sessionsCompleted = ref(0)
let timerInterval = null

// Settings modal
const showSettings = ref(false)
const tempSettings = ref({ ...focusStore.settings })

const timerModes = {
  focus: { label: 'Fokus', duration: () => focusStore.settings.focusDuration, color: '#4F9CF9' },
  shortBreak: { label: 'Istirahat Pendek', duration: () => focusStore.settings.shortBreak, color: '#22C55E' },
  longBreak: { label: 'Istirahat Panjang', duration: () => focusStore.settings.longBreak, color: '#F59E0B' }
}

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progressPercentage = computed(() => {
  const totalTime = timerModes[timerMode.value].duration()
  return ((totalTime - timeLeft.value) / totalTime) * 100
})

const currentModeColor = computed(() => timerModes[timerMode.value].color)

const startTimer = () => {
  if (isRunning.value) return
  isRunning.value = true
  
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      // Simpan setiap detik yang berjalan saat mode focus
      if (timerMode.value === 'focus') {
        focusStore.addFocusTime(1) // tambah 1 detik
      }
    } else {
      completeSession()
    }
  }, 1000)
}

const pauseTimer = () => {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const resetTimer = () => {
  pauseTimer()
  timeLeft.value = timerModes[timerMode.value].duration()
}

const completeSession = () => {
  pauseTimer()
  
  // Play notification sound (optional)
  playNotificationSound()
  
  if (timerMode.value === 'focus') {
    // Record completed session (waktu sudah ditambahkan per detik)
    focusStore.addSession(focusStore.settings.focusDuration, 'focus')
    sessionsCompleted.value++
    
    // Determine next break type
    if (sessionsCompleted.value % focusStore.settings.sessionsBeforeLongBreak === 0) {
      switchMode('longBreak')
    } else {
      switchMode('shortBreak')
    }
    
    showNotification('Fokus Selesai!', 'Waktunya istirahat sebentar 🎉')
  } else {
    switchMode('focus')
    showNotification('Istirahat Selesai!', 'Ayo lanjutkan fokus! 💪')
  }
}

const switchMode = (mode) => {
  pauseTimer()
  timerMode.value = mode
  timeLeft.value = timerModes[mode].duration()
}

const playNotificationSound = () => {
  // Simple beep sound using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 800
  oscillator.type = 'sine'
  gainNode.gain.value = 0.3
  
  oscillator.start()
  setTimeout(() => oscillator.stop(), 200)
}

const showNotification = (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' })
  }
}

const requestNotificationPermission = () => {
  if ('Notification' in window) {
    Notification.requestPermission()
  }
}

// Settings
const openSettings = () => {
  tempSettings.value = { ...focusStore.settings }
  showSettings.value = true
}

const closeSettings = () => {
  showSettings.value = false
}

const saveSettings = () => {
  focusStore.updateSettings({
    focusDuration: tempSettings.value.focusDuration,
    shortBreak: tempSettings.value.shortBreak,
    longBreak: tempSettings.value.longBreak,
    sessionsBeforeLongBreak: tempSettings.value.sessionsBeforeLongBreak
  })
  
  // Reset timer with new duration
  if (!isRunning.value) {
    timeLeft.value = timerModes[timerMode.value].duration()
  }
  
  closeSettings()
}

// Request notification permission on mount
requestNotificationPermission()

// Cleanup on unmount
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<template>
  <div class="focus-timer-page">
    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ focusStore.todayFocusFormatted }}</span>
          <span class="stat-label">Fokus Hari Ini</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon orange">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ focusStore.streak }}</span>
          <span class="stat-label">Hari Streak 🔥</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon green">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ sessionsCompleted }}</span>
          <span class="stat-label">Sesi Hari Ini</span>
        </div>
      </div>
    </div>

    <!-- Main Timer Card -->
    <div class="timer-card">
      <!-- Mode Tabs -->
      <div class="mode-tabs">
        <button 
          v-for="(mode, key) in timerModes" 
          :key="key"
          :class="['mode-tab', { active: timerMode === key }]"
          :style="timerMode === key ? { backgroundColor: mode.color, color: 'white' } : {}"
          @click="switchMode(key)"
        >
          {{ mode.label }}
        </button>
      </div>

      <!-- Timer Display -->
      <div class="timer-container">
        <div class="timer-ring">
          <svg viewBox="0 0 200 200">
            <circle class="ring-bg" cx="100" cy="100" r="90" />
            <circle 
              class="ring-progress" 
              cx="100" cy="100" r="90"
              :style="{
                strokeDasharray: `${progressPercentage * 5.65} 565`,
                stroke: currentModeColor
              }"
            />
          </svg>
          <div class="timer-display">
            <span class="timer-time">{{ formattedTime }}</span>
            <span class="timer-label">{{ timerModes[timerMode].label }}</span>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="timer-controls">
        <button class="control-btn secondary" @click="resetTimer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
        
        <button 
          class="control-btn primary"
          :style="{ backgroundColor: currentModeColor }"
          @click="isRunning ? pauseTimer() : startTimer()"
        >
          <svg v-if="!isRunning" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        </button>
        
        <button class="control-btn secondary" @click="openSettings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      <!-- Tips -->
      <div class="timer-tips">
        <p v-if="timerMode === 'focus'">💡 Matikan notifikasi dan fokus pada satu tugas saja</p>
        <p v-else-if="timerMode === 'shortBreak'">☕ Regangkan badan, minum air, istirahatkan mata</p>
        <p v-else>🚶 Jalan-jalan sebentar atau lakukan stretching</p>
      </div>
    </div>

    <!-- How It Works -->
    <div class="info-card">
      <h3>Cara Kerja Pomodoro</h3>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Fokus 25 Menit</h4>
            <p>Kerjakan skripsi tanpa gangguan</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Istirahat 5 Menit</h4>
            <p>Istirahat sejenak setelah fokus</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Ulangi 4x</h4>
            <p>Setelah 4 sesi, istirahat panjang 15 menit</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal-overlay" v-if="showSettings" @click.self="closeSettings">
      <div class="modal">
        <div class="modal-header">
          <h3>Pengaturan Timer</h3>
          <button class="modal-close" @click="closeSettings">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Durasi Fokus (menit)</label>
            <input 
              type="number" 
              v-model.number="tempSettings.focusDuration" 
              min="1" 
              max="60"
              @input="tempSettings.focusDuration = tempSettings.focusDuration * 60 > 3600 ? 60 : tempSettings.focusDuration"
            />
            <small>Akan dikonversi ke detik ({{ tempSettings.focusDuration }} menit = {{ tempSettings.focusDuration * 60 }} detik)</small>
          </div>
          <div class="form-group">
            <label>Istirahat Pendek (menit)</label>
            <input 
              type="number" 
              v-model.number="tempSettings.shortBreak" 
              min="1" 
              max="15"
            />
          </div>
          <div class="form-group">
            <label>Istirahat Panjang (menit)</label>
            <input 
              type="number" 
              v-model.number="tempSettings.longBreak" 
              min="1" 
              max="30"
            />
          </div>
          <div class="form-group">
            <label>Sesi sebelum istirahat panjang</label>
            <input 
              type="number" 
              v-model.number="tempSettings.sessionsBeforeLongBreak" 
              min="1" 
              max="10"
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeSettings">Batal</button>
          <button class="btn-submit" @click="saveSettings">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.focus-timer-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.orange {
  background-color: #FEF3C7;
  color: #F59E0B;
}

.stat-icon.green {
  background-color: #DCFCE7;
  color: #22C55E;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Timer Card */
.timer-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 40px;
  text-align: center;
  box-shadow: var(--shadow-md);
}

/* Mode Tabs */
.mode-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
}

.mode-tab {
  padding: 10px 24px;
  border: none;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--bg-sidebar);
  color: var(--text-secondary);
}

.mode-tab:hover {
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
}

.mode-tab.active {
  box-shadow: var(--shadow-md);
}

/* Timer Display */
.timer-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.timer-ring {
  position: relative;
  width: 280px;
  height: 280px;
}

.timer-ring svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.ring-bg {
  fill: none;
  stroke: #E2E8F0;
  stroke-width: 12;
}

.ring-progress {
  fill: none;
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease;
}

.timer-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-time {
  font-size: 56px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.timer-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* Controls */
.timer-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.control-btn {
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn.primary {
  width: 72px;
  height: 72px;
  color: white;
  box-shadow: var(--shadow-md);
}

.control-btn.primary:hover {
  transform: scale(1.05);
}

.control-btn.secondary {
  width: 48px;
  height: 48px;
  background-color: var(--bg-sidebar);
  color: var(--text-secondary);
}

.control-btn.secondary:hover {
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
}

/* Tips */
.timer-tips {
  padding: 16px;
  background-color: var(--bg-sidebar);
  border-radius: var(--radius-md);
}

.timer-tips p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* Info Card */
.info-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.info-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-number {
  width: 32px;
  height: 32px;
  background-color: var(--primary-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.step-content p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.form-group small {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
}

.btn-cancel {
  padding: 10px 20px;
  background-color: var(--bg-main);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-submit {
  padding: 10px 20px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .steps {
    grid-template-columns: 1fr;
  }
  
  .timer-ring {
    width: 240px;
    height: 240px;
  }
  
  .timer-time {
    font-size: 44px;
  }
}
</style>
