<template>
  <div class="dosen-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1>Selamat Datang, {{ authStore.userName }}!</h1>
        <p>Kelola mahasiswa bimbingan Anda</p>
      </div>
      <button class="btn-logout" @click="handleLogout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </div>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ mahasiswaList.length }}</span>
          <span class="stat-label">Mahasiswa Bimbingan</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ upcomingBimbingan.length }}</span>
          <span class="stat-label">Jadwal Bimbingan</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ pendingRevisi }}</span>
          <span class="stat-label">Revisi Pending</span>
        </div>
      </div>
    </div>

    <!-- Upcoming Jadwal Bimbingan -->
    <div class="section-card upcoming-section" v-if="allUpcomingBimbingan.length > 0">
      <div class="section-header">
        <h2>📅 Jadwal Bimbingan Mendatang</h2>
      </div>
      <div class="upcoming-list">
        <div class="upcoming-item" v-for="jadwal in allUpcomingBimbingan" :key="jadwal.id">
          <div class="upcoming-avatar">{{ getInitials(jadwal.mahasiswaNama || 'M') }}</div>
          <div class="upcoming-info">
            <h4>{{ jadwal.mahasiswaNama || 'Mahasiswa' }}</h4>
            <p class="upcoming-topik">{{ jadwal.topik }}</p>
          </div>
          <div class="upcoming-time">
            <span class="upcoming-date">{{ formatDateShort(jadwal.tanggal) }}</span>
            <span class="upcoming-hour">{{ jadwal.waktu }} WIB</span>
          </div>
          <div class="upcoming-lokasi">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {{ jadwal.lokasi || 'TBD' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content">
      <!-- Mahasiswa List -->
      <div class="section-card mahasiswa-section">
        <div class="section-header">
          <h2>Mahasiswa Bimbingan</h2>
        </div>
        
        <div class="mahasiswa-list" v-if="mahasiswaList.length > 0">
          <div 
            class="mahasiswa-card"
            v-for="mhs in mahasiswaList" 
            :key="mhs.id"
            :class="{ active: selectedMahasiswa?.id === mhs.id }"
            @click="selectMahasiswa(mhs)"
          >
            <div class="mhs-avatar">{{ getInitials(mhs.nama) }}</div>
            <div class="mhs-info">
              <h4>{{ mhs.nama }}</h4>
              <span class="mhs-nim">{{ mhs.nim }}</span>
              <span class="mhs-jurusan">{{ mhs.jurusan }}</span>
            </div>
            <div class="mhs-progress">
              <div class="progress-circle" :style="{ '--progress': getMhsProgress(mhs.id) }">
                <span>{{ getMhsProgress(mhs.id) }}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="empty-state" v-else>
          <span class="empty-icon">👨‍🎓</span>
          <p>Belum ada mahasiswa bimbingan</p>
        </div>
      </div>

      <!-- Detail & Feedback -->
      <div class="section-card detail-section">
        <template v-if="selectedMahasiswa">
          <div class="section-header">
            <h2>Detail Mahasiswa</h2>
          </div>
          
          <div class="mhs-detail">
            <div class="detail-header">
              <div class="detail-avatar">{{ getInitials(selectedMahasiswa.nama) }}</div>
              <div class="detail-info">
                <h3>{{ selectedMahasiswa.nama }}</h3>
                <p>{{ selectedMahasiswa.nim }} • {{ selectedMahasiswa.jurusan }}</p>
              </div>
            </div>

            <!-- Tabs -->
            <div class="detail-tabs">
              <button 
                type="button"
                :class="['tab-btn', { active: activeTab === 'progress' }]"
                @click.prevent="setActiveTab('progress')"
              >
                Progress
              </button>
              <button 
                type="button"
                :class="['tab-btn', { active: activeTab === 'bimbingan' }]"
                @click.prevent="setActiveTab('bimbingan')"
              >
                Bimbingan
              </button>
              <button 
                type="button"
                :class="['tab-btn', { active: activeTab === 'feedback' }]"
                @click.prevent="setActiveTab('feedback')"
              >
                Beri Feedback
              </button>
            </div>

            <!-- Tab Content: Progress -->
            <div class="tab-content" v-show="activeTab === 'progress'">
              <div class="progress-list" v-if="babProgress.length > 0">
                <div class="progress-item" v-for="bab in babProgress" :key="bab.id">
                  <div class="bab-header">
                    <span class="bab-name">{{ bab.name }}</span>
                    <span class="bab-percent">{{ bab.progress }}%</span>
                  </div>
                  <div class="bab-bar">
                    <div class="bab-fill" :style="{ width: bab.progress + '%' }"></div>
                  </div>
                </div>
              </div>
              <div class="empty-state small" v-else>
                <p>Belum ada data progress</p>
              </div>
            </div>

            <!-- Tab Content: Bimbingan -->
            <div class="tab-content" v-show="activeTab === 'bimbingan'">
              <div class="bimbingan-list">
                <div class="bimbingan-item" v-for="b in mhsBimbingan" :key="b.id">
                  <div class="bimbingan-date">{{ formatDate(b.tanggal) }}</div>
                  <div class="bimbingan-topik">{{ b.topik }}</div>
                  <span :class="['badge', getStatusClass(b.statusRevisi)]">
                    {{ getStatusText(b.statusRevisi) }}
                  </span>
                </div>
              </div>
              <div class="empty-state small" v-if="mhsBimbingan.length === 0">
                <p>Belum ada riwayat bimbingan</p>
              </div>
            </div>

            <!-- Tab Content: Beri Feedback -->
            <div class="tab-content" v-show="activeTab === 'feedback'">
              <form @submit.prevent="submitFeedback" class="feedback-form">
                <div class="form-group">
                  <label>Pilih Sesi Bimbingan</label>
                  <select v-model="feedbackForm.bimbinganId">
                    <option value="">Pilih sesi bimbingan</option>
                    <option v-for="b in mhsBimbingan" :key="b.id" :value="b.id">
                      {{ formatDate(b.tanggal) }} - {{ b.topik }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>Feedback</label>
                  <textarea 
                    v-model="feedbackForm.feedback"
                    rows="4"
                    placeholder="Tulis feedback untuk mahasiswa..."
                  ></textarea>
                </div>

                <button type="submit" class="btn-submit" :disabled="!feedbackForm.bimbinganId || !feedbackForm.feedback">
                  Kirim Feedback
                </button>
              </form>

              <div v-if="feedbackSuccess" class="success-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Feedback berhasil dikirim!
              </div>
            </div>
          </div>
        </template>

        <div class="empty-state" v-else>
          <span class="empty-icon">👆</span>
          <p>Pilih mahasiswa untuk melihat detail</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBimbinganStore } from '@/stores/bimbingan'
import { useProgressStore } from '@/stores/progress'

const router = useRouter()
const authStore = useAuthStore()
const bimbinganStore = useBimbinganStore()
const progressStore = useProgressStore()

const selectedMahasiswa = ref(null)
const activeTab = ref('progress')
const feedbackSuccess = ref(false)

const feedbackForm = ref({
  bimbinganId: '',
  feedback: ''
})

// Sample mahasiswa data for demo
const mahasiswaList = computed(() => {
  // In real app, this would come from authStore.mahasiswaBimbingan
  return [
    {
      id: 1,
      nim: '2021001',
      nama: 'Andi Pratama',
      jurusan: 'Teknik Informatika',
      email: 'andi@student.ac.id'
    },
    {
      id: 3,
      nim: '2021002',
      nama: 'Siti Nurhaliza',
      jurusan: 'Sistem Informasi',
      email: 'siti@student.ac.id'
    },
    {
      id: 4,
      nim: '2021003',
      nama: 'Budi Setiawan',
      jurusan: 'Teknik Informatika',
      email: 'budi@student.ac.id'
    }
  ]
})

const upcomingBimbingan = computed(() => {
  return bimbinganStore.jadwalList.filter(j => j.status === 'upcoming')
})

// Get all upcoming jadwal from all mahasiswa
const allUpcomingBimbingan = computed(() => {
  return bimbinganStore.jadwalList
    .filter(j => j.status === 'upcoming')
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
})

const pendingRevisi = computed(() => {
  return bimbinganStore.notulensiList.filter(n => n.statusRevisi !== 'completed').length
})

const babProgress = computed(() => {
  // Sample progress data for demo
  if (progressStore.babList && progressStore.babList.length > 0) {
    return progressStore.babList.map(bab => ({
      id: bab.id,
      name: bab.name,
      progress: bab.progress
    }))
  }
  // Default progress data jika store kosong
  return [
    { id: 1, name: 'BAB 1 - Pendahuluan', progress: 100 },
    { id: 2, name: 'BAB 2 - Tinjauan Pustaka', progress: 75 },
    { id: 3, name: 'BAB 3 - Metodologi', progress: 40 },
    { id: 4, name: 'BAB 4 - Hasil & Pembahasan', progress: 10 },
    { id: 5, name: 'BAB 5 - Penutup', progress: 0 }
  ]
})

const mhsBimbingan = computed(() => {
  if (!selectedMahasiswa.value) return []
  return bimbinganStore.notulensiList
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const getMhsProgress = (mhsId) => {
  // Demo: return consistent progress based on mhsId
  const progressMap = { 1: 64, 3: 63, 4: 69 }
  return progressMap[mhsId] || 50
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const selectMahasiswa = (mhs) => {
  selectedMahasiswa.value = mhs
  activeTab.value = 'progress'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusClass = (status) => {
  const classes = {
    'pending': 'badge-pending',
    'in-progress': 'badge-progress',
    'completed': 'badge-completed'
  }
  return classes[status] || 'badge-pending'
}

const getStatusText = (status) => {
  const texts = {
    'pending': 'Belum Dikerjakan',
    'in-progress': 'Sedang Dikerjakan',
    'completed': 'Selesai'
  }
  return texts[status] || 'Pending'
}

const submitFeedback = () => {
  if (!feedbackForm.value.bimbinganId || !feedbackForm.value.feedback) return
  
  const bimbingan = bimbinganStore.notulensiList.find(n => n.id === parseInt(feedbackForm.value.bimbinganId))
  if (bimbingan) {
    bimbingan.feedbackDosen = feedbackForm.value.feedback
    bimbinganStore.saveToLocalStorage?.()
  }
  
  feedbackSuccess.value = true
  feedbackForm.value = { bimbinganId: '', feedback: '' }
  
  setTimeout(() => {
    feedbackSuccess.value = false
  }, 3000)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.dosen-dashboard {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 32px;
  font-family: 'Inter', sans-serif;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.welcome-section h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.welcome-section p {
  color: #64748b;
  font-size: 15px;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  color: #dc2626;
  border-color: #dc2626;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue { background-color: #dbeafe; color: #3b82f6; }
.stat-icon.orange { background-color: #fef3c7; color: #f59e0b; }
.stat-icon.green { background-color: #d1fae5; color: #10b981; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

/* Dashboard Content */
.dashboard-content {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
}

.section-card {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

/* Mahasiswa List */
.mahasiswa-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mahasiswa-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.mahasiswa-card:hover {
  background-color: #eff6ff;
}

.mahasiswa-card.active {
  background-color: #eff6ff;
  border-color: #3b82f6;
}

.mhs-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.mhs-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mhs-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.mhs-nim {
  font-size: 13px;
  color: #64748b;
}

.mhs-jurusan {
  font-size: 12px;
  color: #94a3b8;
}

.mhs-progress {
  flex-shrink: 0;
}

.progress-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: conic-gradient(#3b82f6 calc(var(--progress) * 3.6deg), #e2e8f0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  position: absolute;
  width: 38px;
  height: 38px;
  background: white;
  border-radius: 50%;
}

.progress-circle span {
  position: relative;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

/* Detail Section */
.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.detail-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 24px;
}

.detail-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.detail-info p {
  font-size: 14px;
  color: #64748b;
}

/* Tabs */
.detail-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.tab-btn {
  padding: 10px 20px;
  background-color: #f8fafc;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background-color: #e2e8f0;
}

.tab-btn.active {
  background-color: #3b82f6;
  color: white;
}

/* Tab Content */
.tab-content {
  min-height: 300px;
}

/* Progress List */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-item {
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 12px;
}

.bab-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.bab-name {
  font-weight: 500;
  color: #1e293b;
}

.bab-percent {
  font-weight: 600;
  color: #3b82f6;
}

.bab-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.bab-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  border-radius: 4px;
}

/* Bimbingan List */
.bimbingan-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bimbingan-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 12px;
}

.bimbingan-date {
  font-size: 13px;
  color: #64748b;
  min-width: 150px;
}

.bimbingan-topik {
  flex: 1;
  font-weight: 500;
  color: #1e293b;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.badge-pending { background-color: #fef3c7; color: #d97706; }
.badge-progress { background-color: #dbeafe; color: #2563eb; }
.badge-completed { background-color: #d1fae5; color: #059669; }

/* Feedback Form */
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #1e293b;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: white;
}

.btn-submit {
  padding: 14px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover {
  background-color: #2563eb;
}

.btn-submit:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background-color: #d1fae5;
  color: #059669;
  border-radius: 10px;
  font-weight: 500;
  margin-top: 16px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-state.small {
  padding: 30px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 15px;
}

/* Upcoming Jadwal Section */
.upcoming-section {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.upcoming-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #8b5cf6;
  transition: all 0.2s;
}

.upcoming-item:hover {
  background-color: #f1f5f9;
}

.upcoming-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.upcoming-info {
  flex: 1;
  min-width: 0;
}

.upcoming-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.upcoming-info p {
  font-size: 13px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming-info .upcoming-topik {
  margin-top: 4px;
}

.upcoming-time {
  text-align: right;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.upcoming-time .upcoming-date {
  font-size: 13px;
  font-weight: 600;
  color: #8b5cf6;
}

.upcoming-time .upcoming-hour {
  font-size: 12px;
  color: #64748b;
}

.upcoming-lokasi {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dosen-dashboard {
    padding: 20px;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
