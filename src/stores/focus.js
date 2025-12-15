import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFocusStore = defineStore('focus', () => {
  // State
  const todayFocusTime = ref(0) // dalam detik
  const streak = ref(5)
  const lastActiveDate = ref(new Date().toDateString())
  
  const sessions = ref([])
  
  const settings = ref({
    focusDuration: 25 * 60, // 25 menit dalam detik
    shortBreak: 5 * 60, // 5 menit
    longBreak: 15 * 60, // 15 menit
    sessionsBeforeLongBreak: 4
  })

  // Getters
  const todayFocusHours = computed(() => {
    return (todayFocusTime.value / 3600).toFixed(1)
  })

  const todayFocusMinutes = computed(() => {
    return Math.floor(todayFocusTime.value / 60)
  })

  const todayFocusFormatted = computed(() => {
    const hours = Math.floor(todayFocusTime.value / 3600)
    const minutes = Math.floor((todayFocusTime.value % 3600) / 60)
    if (hours > 0) {
      return `${hours}j ${minutes}m`
    }
    return `${minutes} menit`
  })

  const totalSessions = computed(() => {
    return sessions.value.length
  })

  const todaySessions = computed(() => {
    const today = new Date().toDateString()
    return sessions.value.filter(s => 
      new Date(s.date).toDateString() === today
    ).length
  })

  // Actions
  const addFocusTime = (seconds) => {
    const today = new Date().toDateString()
    
    // Check if new day
    if (lastActiveDate.value !== today) {
      // Check streak
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastActiveDate.value === yesterday.toDateString()) {
        streak.value++
      } else {
        streak.value = 1
      }
      
      todayFocusTime.value = 0
      lastActiveDate.value = today
    }
    
    todayFocusTime.value += seconds
    saveToLocalStorage()
  }

  const addSession = (duration, type = 'focus') => {
    sessions.value.push({
      id: Date.now(),
      date: new Date().toISOString(),
      duration,
      type
    })
    saveToLocalStorage()
  }

  const updateSettings = (newSettings) => {
    settings.value = { ...settings.value, ...newSettings }
    saveToLocalStorage()
  }

  // Local Storage
  const saveToLocalStorage = () => {
    localStorage.setItem('focus_data', JSON.stringify({
      todayFocusTime: todayFocusTime.value,
      streak: streak.value,
      lastActiveDate: lastActiveDate.value,
      sessions: sessions.value,
      settings: settings.value
    }))
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('focus_data')
    if (saved) {
      const data = JSON.parse(saved)
      todayFocusTime.value = data.todayFocusTime || 0
      streak.value = data.streak || 0
      lastActiveDate.value = data.lastActiveDate || new Date().toDateString()
      sessions.value = data.sessions || []
      if (data.settings) settings.value = data.settings
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    todayFocusTime,
    streak,
    sessions,
    settings,
    todayFocusHours,
    todayFocusMinutes,
    todayFocusFormatted,
    totalSessions,
    todaySessions,
    addFocusTime,
    addSession,
    updateSettings
  }
})
