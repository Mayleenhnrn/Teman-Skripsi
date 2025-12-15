<script setup>
import { ref, computed } from 'vue'

// Diary entries
const entries = ref([
  {
    id: 1,
    date: '2024-12-14',
    mood: 'happy',
    content: 'Hari ini berhasil menyelesaikan BAB 2! Dosen pembimbing juga memberikan feedback positif. Semangat untuk melanjutkan BAB 3 besok!',
    tags: ['produktif', 'skripsi']
  },
  {
    id: 2,
    date: '2024-12-13',
    mood: 'neutral',
    content: 'Revisi yang diminta lumayan banyak, tapi alhamdulillah masih bisa dihandle. Besok fokus menyelesaikan revisi latar belakang.',
    tags: ['revisi', 'skripsi']
  }
])

// Load from localStorage
const loadEntries = () => {
  const saved = localStorage.getItem('diary_entries')
  if (saved) {
    entries.value = JSON.parse(saved)
  }
}

const saveEntries = () => {
  localStorage.setItem('diary_entries', JSON.stringify(entries.value))
}

loadEntries()

// Modal state
const showAddModal = ref(false)
const newEntry = ref({
  mood: 'neutral',
  content: '',
  tags: ''
})

const moods = [
  { id: 'happy', emoji: '😊', label: 'Senang' },
  { id: 'neutral', emoji: '😐', label: 'Biasa' },
  { id: 'sad', emoji: '😢', label: 'Sedih' },
  { id: 'stressed', emoji: '😫', label: 'Stres' },
  { id: 'motivated', emoji: '🔥', label: 'Termotivasi' }
]

const getMoodEmoji = (moodId) => {
  return moods.find(m => m.id === moodId)?.emoji || '😐'
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const openAddModal = () => {
  newEntry.value = { mood: 'neutral', content: '', tags: '' }
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const submitEntry = () => {
  if (newEntry.value.content.trim()) {
    const tagsArray = newEntry.value.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t)
    
    entries.value.unshift({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      mood: newEntry.value.mood,
      content: newEntry.value.content.trim(),
      tags: tagsArray
    })
    
    saveEntries()
    closeAddModal()
  }
}

const deleteEntry = (id) => {
  if (confirm('Apakah kamu yakin ingin menghapus catatan ini?')) {
    entries.value = entries.value.filter(e => e.id !== id)
    saveEntries()
  }
}

// Stats
const totalEntries = computed(() => entries.value.length)
const thisWeekEntries = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return entries.value.filter(e => new Date(e.date) >= oneWeekAgo).length
})
</script>

<template>
  <div class="diary-page">
    <!-- Header Stats -->
    <div class="diary-header">
      <div class="header-left">
        <h2>Diary Curhat 📝</h2>
        <p>Tulis perasaan dan refleksi harianmu</p>
      </div>
      <button class="add-btn" @click="openAddModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tulis Baru
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-emoji">📖</span>
        <div class="stat-info">
          <span class="stat-value">{{ totalEntries }}</span>
          <span class="stat-label">Total Catatan</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-emoji">📅</span>
        <div class="stat-info">
          <span class="stat-value">{{ thisWeekEntries }}</span>
          <span class="stat-label">Minggu Ini</span>
        </div>
      </div>
    </div>

    <!-- Entries List -->
    <div class="entries-list">
      <div v-if="entries.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>Belum ada catatan</h3>
        <p>Mulai tulis curhatanmu hari ini!</p>
      </div>
      
      <div v-for="entry in entries" :key="entry.id" class="entry-card">
        <div class="entry-header">
          <div class="entry-date">
            <span class="mood-emoji">{{ getMoodEmoji(entry.mood) }}</span>
            <span>{{ formatDate(entry.date) }}</span>
          </div>
          <button class="delete-btn" @click="deleteEntry(entry.id)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
        <p class="entry-content">{{ entry.content }}</p>
        <div class="entry-tags" v-if="entry.tags.length > 0">
          <span v-for="tag in entry.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="closeAddModal">
      <div class="modal">
        <div class="modal-header">
          <h3>Tulis Catatan Baru</h3>
          <button class="modal-close" @click="closeAddModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Bagaimana perasaanmu hari ini?</label>
            <div class="mood-selector">
              <button 
                v-for="mood in moods" 
                :key="mood.id"
                :class="['mood-btn', { active: newEntry.mood === mood.id }]"
                @click="newEntry.mood = mood.id"
              >
                <span class="mood-emoji">{{ mood.emoji }}</span>
                <span class="mood-label">{{ mood.label }}</span>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>Ceritakan harimu...</label>
            <textarea 
              v-model="newEntry.content" 
              rows="6" 
              placeholder="Apa yang kamu rasakan hari ini? Ada hal menarik yang terjadi?"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Tags (pisahkan dengan koma)</label>
            <input 
              type="text" 
              v-model="newEntry.tags" 
              placeholder="Contoh: skripsi, produktif, bimbingan"
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeAddModal">Batal</button>
          <button class="btn-submit" @click="submitEntry">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diary-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.diary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h2 {
  font-size: 24px;
  margin-bottom: 4px;
}

.header-left p {
  color: var(--text-secondary);
  font-size: 14px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-emoji {
  font-size: 32px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  display: block;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.entry-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.entry-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.mood-emoji {
  font-size: 20px;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}

.delete-btn:hover {
  color: #EF4444;
}

.entry-content {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.entry-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
  border-radius: 999px;
  font-size: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
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
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.mood-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mood-btn:hover {
  border-color: var(--primary-blue);
}

.mood-btn.active {
  border-color: var(--primary-blue);
  background-color: var(--primary-blue-light);
}

.mood-btn .mood-emoji {
  font-size: 24px;
}

.mood-btn .mood-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.form-group textarea,
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 14px;
}

.form-group textarea:focus,
.form-group input:focus {
  outline: none;
  border-color: var(--primary-blue);
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
  cursor: pointer;
}

.btn-submit {
  padding: 10px 20px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  cursor: pointer;
}
</style>
