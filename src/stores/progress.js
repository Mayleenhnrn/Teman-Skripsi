import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  // State - Progress per bab
  const chapters = ref([
    {
      id: 1,
      name: 'BAB 1 - Pendahuluan',
      tasks: [
        { id: 1, name: 'Latar Belakang', completed: true },
        { id: 2, name: 'Rumusan Masalah', completed: true },
        { id: 3, name: 'Tujuan Penelitian', completed: true },
        { id: 4, name: 'Manfaat Penelitian', completed: true },
        { id: 5, name: 'Batasan Masalah', completed: true }
      ]
    },
    {
      id: 2,
      name: 'BAB 2 - Tinjauan Pustaka',
      tasks: [
        { id: 1, name: 'Landasan Teori', completed: true },
        { id: 2, name: 'Penelitian Terkait', completed: true },
        { id: 3, name: 'Kerangka Pemikiran', completed: false }
      ]
    },
    {
      id: 3,
      name: 'BAB 3 - Metodologi',
      tasks: [
        { id: 1, name: 'Metode Penelitian', completed: true },
        { id: 2, name: 'Teknik Pengumpulan Data', completed: false },
        { id: 3, name: 'Analisis Kebutuhan', completed: false },
        { id: 4, name: 'Perancangan Sistem', completed: false }
      ]
    },
    {
      id: 4,
      name: 'BAB 4 - Hasil & Pembahasan',
      tasks: [
        { id: 1, name: 'Implementasi', completed: false },
        { id: 2, name: 'Pengujian', completed: false },
        { id: 3, name: 'Analisis Hasil', completed: false }
      ]
    },
    {
      id: 5,
      name: 'BAB 5 - Penutup',
      tasks: [
        { id: 1, name: 'Kesimpulan', completed: false },
        { id: 2, name: 'Saran', completed: false }
      ]
    }
  ])

  // Getters
  const totalTasks = computed(() => {
    return chapters.value.reduce((sum, chapter) => sum + chapter.tasks.length, 0)
  })

  const completedTasks = computed(() => {
    return chapters.value.reduce((sum, chapter) => {
      return sum + chapter.tasks.filter(task => task.completed).length
    }, 0)
  })

  const overallProgress = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  const getChapterProgress = (chapterId) => {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (!chapter) return 0
    const completed = chapter.tasks.filter(t => t.completed).length
    return Math.round((completed / chapter.tasks.length) * 100)
  }

  // Actions
  const toggleTask = (chapterId, taskId) => {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (chapter) {
      const task = chapter.tasks.find(t => t.id === taskId)
      if (task) {
        task.completed = !task.completed
        saveToLocalStorage()
      }
    }
  }

  const addTask = (chapterId, taskName) => {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (chapter) {
      const newId = Math.max(...chapter.tasks.map(t => t.id), 0) + 1
      chapter.tasks.push({
        id: newId,
        name: taskName,
        completed: false
      })
      saveToLocalStorage()
    }
  }

  const removeTask = (chapterId, taskId) => {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (chapter) {
      chapter.tasks = chapter.tasks.filter(t => t.id !== taskId)
      saveToLocalStorage()
    }
  }

  // Local Storage
  const saveToLocalStorage = () => {
    localStorage.setItem('skripsi_progress', JSON.stringify(chapters.value))
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('skripsi_progress')
    if (saved) {
      chapters.value = JSON.parse(saved)
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    chapters,
    totalTasks,
    completedTasks,
    overallProgress,
    getChapterProgress,
    toggleTask,
    addTask,
    removeTask,
    saveToLocalStorage,
    loadFromLocalStorage
  }
})
