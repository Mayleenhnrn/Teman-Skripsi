<script setup>
import { ref, computed } from 'vue'
import { useBimbinganStore } from '../stores/bimbingan'
import { useUserStore } from '../stores/user'
import { useAuthStore } from '../stores/auth'

const bimbinganStore = useBimbinganStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const activeTab = ref('jadwal') // jadwal, notulensi, history
const showAddModal = ref(false)
const showNotulensiModal = ref(false)
const selectedJadwal = ref(null)

// Form data for new jadwal
const newJadwal = ref({
  tanggal: '',
  waktu: '',
  lokasi: '',
  topik: ''
})

// Form data for notulensi
const newNotulensi = ref({
  hasilBimbingan: '',
  revisiDiminta: '',
  deadline: ''
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const openAddModal = () => {
  newJadwal.value = { tanggal: '', waktu: '', lokasi: '', topik: '' }
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const submitJadwal = () => {
  if (newJadwal.value.tanggal && newJadwal.value.waktu && newJadwal.value.topik) {
    // Tambahkan mahasiswaId dan nama dari user yang login
    const currentUser = authStore.currentUser
    bimbinganStore.addJadwal({
      ...newJadwal.value,
      mahasiswaId: currentUser?.id || 1,
      mahasiswaNama: currentUser?.nama || 'Mahasiswa'
    })
    closeAddModal()
  }
}

const openNotulensiModal = (jadwal) => {
  selectedJadwal.value = jadwal
  newNotulensi.value = { hasilBimbingan: '', revisiDiminta: '', deadline: '' }
  showNotulensiModal.value = true
}

const closeNotulensiModal = () => {
  showNotulensiModal.value = false
  selectedJadwal.value = null
}

const submitNotulensi = () => {
  if (newNotulensi.value.hasilBimbingan && selectedJadwal.value) {
    const revisiArray = newNotulensi.value.revisiDiminta
      .split('\n')
      .filter(r => r.trim())
    
    const currentUser = authStore.currentUser
    bimbinganStore.addNotulensi({
      jadwalId: selectedJadwal.value.id,
      mahasiswaId: currentUser?.id || selectedJadwal.value.mahasiswaId || 1,
      mahasiswaNama: currentUser?.nama || selectedJadwal.value.mahasiswaNama || 'Mahasiswa',
      tanggal: selectedJadwal.value.tanggal,
      waktu: selectedJadwal.value.waktu,
      topik: selectedJadwal.value.topik,
      hasilBimbingan: newNotulensi.value.hasilBimbingan,
      feedbackDosen: '', // Akan diisi oleh dosen
      revisiDiminta: revisiArray,
      deadline: newNotulensi.value.deadline
    })
    
    bimbinganStore.updateJadwalStatus(selectedJadwal.value.id, 'done')
    closeNotulensiModal()
  }
}

const markAsDone = (jadwal) => {
  openNotulensiModal(jadwal)
}

const getStatusBadge = (status) => {
  const badges = {
    'upcoming': { text: 'Akan Datang', class: 'badge-upcoming' },
    'done': { text: 'Selesai', class: 'badge-done' },
    'cancelled': { text: 'Dibatalkan', class: 'badge-cancelled' }
  }
  return badges[status] || badges.upcoming
}

const getRevisiStatusBadge = (status) => {
  const badges = {
    'pending': { text: 'Belum Dikerjakan', class: 'badge-pending' },
    'in-progress': { text: 'Sedang Dikerjakan', class: 'badge-progress' },
    'completed': { text: 'Selesai', class: 'badge-completed' }
  }
  return badges[status] || badges.pending
}
</script>

<template>
  <div class="bimbingan-page">
    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ bimbinganStore.totalBimbingan }}</span>
          <span class="stat-label">Total Bimbingan</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ bimbinganStore.pendingRevisi }}</span>
          <span class="stat-label">Revisi Pending</span>
        </div>
      </div>
      
      <div class="stat-card highlight" v-if="bimbinganStore.upcomingBimbingan">
        <div class="upcoming-label">Bimbingan Berikutnya</div>
        <div class="upcoming-date">{{ formatDate(bimbinganStore.upcomingBimbingan.tanggal) }}</div>
        <div class="upcoming-time">{{ bimbinganStore.upcomingBimbingan.waktu }} - {{ bimbinganStore.upcomingBimbingan.lokasi }}</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <div class="tabs">
        <button 
          :class="['tab', { active: activeTab === 'jadwal' }]"
          @click="activeTab = 'jadwal'"
        >
          Jadwal Bimbingan
        </button>
        <button 
          :class="['tab', { active: activeTab === 'notulensi' }]"
          @click="activeTab = 'notulensi'"
        >
          Notulensi & Revisi
        </button>
        <button 
          :class="['tab', { active: activeTab === 'history' }]"
          @click="activeTab = 'history'"
        >
          Riwayat
        </button>
      </div>
      
      <button class="add-btn" @click="openAddModal" v-if="activeTab === 'jadwal'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah Jadwal
      </button>
    </div>

    <!-- Tab Content: Jadwal -->
    <div v-if="activeTab === 'jadwal'" class="tab-content">
      <div v-if="bimbinganStore.jadwalList.filter(j => j.status === 'upcoming').length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>Belum ada jadwal bimbingan</h3>
        <p>Tambahkan jadwal bimbingan baru untuk memulai</p>
      </div>
      
      <div v-else class="jadwal-list">
        <div 
          v-for="jadwal in bimbinganStore.jadwalList.filter(j => j.status === 'upcoming')" 
          :key="jadwal.id"
          class="jadwal-card"
        >
          <div class="jadwal-date-badge">
            <span class="date-day">{{ new Date(jadwal.tanggal).getDate() }}</span>
            <span class="date-month">{{ ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][new Date(jadwal.tanggal).getMonth()] }}</span>
          </div>
          
          <div class="jadwal-info">
            <h4 class="jadwal-topik">{{ jadwal.topik }}</h4>
            <div class="jadwal-meta">
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ jadwal.waktu }}
              </span>
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ jadwal.lokasi }}
              </span>
            </div>
            <p class="jadwal-dosen">Dengan {{ userStore.dosenName }}</p>
          </div>
          
          <div class="jadwal-actions">
            <span :class="['badge', getStatusBadge(jadwal.status).class]">
              {{ getStatusBadge(jadwal.status).text }}
            </span>
            <button class="btn-done" @click="markAsDone(jadwal)">
              Tandai Selesai
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Notulensi -->
    <div v-if="activeTab === 'notulensi'" class="tab-content">
      <div v-if="bimbinganStore.notulensiList.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>Belum ada notulensi</h3>
        <p>Notulensi akan muncul setelah bimbingan selesai</p>
      </div>
      
      <div v-else class="notulensi-list">
        <div 
          v-for="notulensi in bimbinganStore.notulensiList" 
          :key="notulensi.id"
          class="notulensi-card"
        >
          <div class="notulensi-header">
            <div class="notulensi-header-left">
              <div class="notulensi-status-row">
                <span class="status-icon completed">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span class="notulensi-date">{{ formatDate(notulensi.tanggal) }}</span>
              </div>
              <div class="notulensi-time" v-if="notulensi.waktu">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ notulensi.waktu }} WIB
              </div>
            </div>
            <span :class="['badge', getRevisiStatusBadge(notulensi.statusRevisi).class]">
              {{ getRevisiStatusBadge(notulensi.statusRevisi).text }}
            </span>
          </div>

          <!-- Topik -->
          <div class="notulensi-topik" v-if="notulensi.topik">
            <span class="topik-label">Topik:</span>
            <h4 class="topik-title">{{ notulensi.topik }}</h4>
          </div>
          
          <div class="notulensi-body">
            <!-- Feedback Dosen -->
            <div class="notulensi-section feedback-section" v-if="notulensi.feedbackDosen">
              <h5>Feedback Dosen:</h5>
              <p class="feedback-text">{{ notulensi.feedbackDosen }}</p>
            </div>

            <!-- Yang Harus Direvisi -->
            <div class="notulensi-section revisi-section" v-if="notulensi.revisiDiminta && notulensi.revisiDiminta.length > 0">
              <h5>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Yang Harus Direvisi:
              </h5>
              <ul class="revisi-list">
                <li v-for="(revisi, idx) in notulensi.revisiDiminta" :key="idx">
                  {{ revisi }}
                </li>
              </ul>
            </div>
            
            <div class="notulensi-footer" v-if="notulensi.deadline">
              <span class="deadline-label">Deadline:</span>
              <span class="deadline-date">{{ formatDate(notulensi.deadline) }}</span>
            </div>
          </div>
          
          <div class="notulensi-actions" v-if="notulensi.statusRevisi !== 'completed'">
            <button 
              class="btn-status"
              @click="bimbinganStore.updateRevisiStatus(notulensi.id, 'in-progress')"
              v-if="notulensi.statusRevisi === 'pending'"
            >
              Mulai Kerjakan
            </button>
            <button 
              class="btn-status success"
              @click="bimbinganStore.updateRevisiStatus(notulensi.id, 'completed')"
              v-if="notulensi.statusRevisi === 'in-progress'"
            >
              Tandai Selesai
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: History -->
    <div v-if="activeTab === 'history'" class="tab-content">
      <div v-if="bimbinganStore.historyBimbingan.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>Belum ada riwayat</h3>
        <p>Riwayat bimbingan akan muncul di sini</p>
      </div>
      
      <div v-else class="history-list">
        <div 
          v-for="jadwal in bimbinganStore.historyBimbingan" 
          :key="jadwal.id"
          class="history-card"
        >
          <div class="history-date">{{ formatDate(jadwal.tanggal) }}</div>
          <div class="history-info">
            <h4>{{ jadwal.topik }}</h4>
            <p>{{ jadwal.waktu }} - {{ jadwal.lokasi }}</p>
            <p class="history-catatan" v-if="jadwal.catatan">{{ jadwal.catatan }}</p>
          </div>
          <span class="badge badge-done">Selesai</span>
        </div>
      </div>
    </div>

    <!-- Add Jadwal Modal -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="closeAddModal">
      <div class="modal">
        <div class="modal-header">
          <h3>Tambah Jadwal Bimbingan</h3>
          <button class="modal-close" @click="closeAddModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Tanggal</label>
            <input type="date" v-model="newJadwal.tanggal" />
          </div>
          <div class="form-group">
            <label>Waktu</label>
            <input type="time" v-model="newJadwal.waktu" />
          </div>
          <div class="form-group">
            <label>Lokasi</label>
            <input type="text" v-model="newJadwal.lokasi" placeholder="Contoh: Ruang Dosen Lt. 3" />
          </div>
          <div class="form-group">
            <label>Topik Bimbingan</label>
            <input type="text" v-model="newJadwal.topik" placeholder="Contoh: Review BAB 2" />
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeAddModal">Batal</button>
          <button class="btn-submit" @click="submitJadwal">Simpan</button>
        </div>
      </div>
    </div>

    <!-- Notulensi Modal -->
    <div class="modal-overlay" v-if="showNotulensiModal" @click.self="closeNotulensiModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Tambah Notulensi Bimbingan</h3>
          <button class="modal-close" @click="closeNotulensiModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Hasil Bimbingan</label>
            <textarea v-model="newNotulensi.hasilBimbingan" rows="3" placeholder="Tuliskan hasil dari bimbingan..."></textarea>
          </div>
          <div class="form-group">
            <label>Yang Harus Direvisi (satu per baris)</label>
            <textarea v-model="newNotulensi.revisiDiminta" rows="4" placeholder="Contoh:&#10;Tambah penelitian terdahulu&#10;Perbaiki format referensi APA 7th"></textarea>
          </div>
          <div class="form-group">
            <label>Deadline Revisi</label>
            <input type="date" v-model="newNotulensi.deadline" />
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeNotulensiModal">Batal</button>
          <button class="btn-submit" @click="submitNotulensi">Simpan Notulensi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bimbingan-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
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

.stat-card.highlight {
  background: linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%);
  color: white;
  flex-direction: column;
  align-items: flex-start;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue {
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
}

.stat-icon.orange {
  background-color: #FEF3C7;
  color: #F59E0B;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.upcoming-label {
  font-size: 12px;
  opacity: 0.8;
}

.upcoming-date {
  font-size: 18px;
  font-weight: 600;
  margin: 4px 0;
}

.upcoming-time {
  font-size: 13px;
  opacity: 0.9;
}

/* Tabs */
.tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0;
}

.tabs {
  display: flex;
  gap: 0;
}

.tab {
  background: none;
  border: none;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--primary-blue);
}

.tab.active {
  color: var(--primary-blue);
  border-bottom-color: var(--primary-blue);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background-color: var(--primary-blue-dark);
}

/* Tab Content */
.tab-content {
  min-height: 300px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: var(--text-secondary);
}

/* Jadwal List */
.jadwal-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.jadwal-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.jadwal-date-badge {
  width: 60px;
  height: 70px;
  background: linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.date-day {
  font-size: 24px;
  font-weight: 700;
}

.date-month {
  font-size: 12px;
  text-transform: uppercase;
}

.jadwal-info {
  flex: 1;
}

.jadwal-topik {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.jadwal-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.jadwal-dosen {
  font-size: 13px;
  color: var(--text-muted);
}

.jadwal-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* Badges */
.badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.badge-upcoming {
  background-color: #DBEAFE;
  color: #2563EB;
}

.badge-done {
  background-color: #DCFCE7;
  color: #16A34A;
}

.badge-cancelled {
  background-color: #FEE2E2;
  color: #DC2626;
}

.badge-pending {
  background-color: #FEF3C7;
  color: #D97706;
}

.badge-progress {
  background-color: #DBEAFE;
  color: #2563EB;
}

.badge-completed {
  background-color: #DCFCE7;
  color: #16A34A;
}

.btn-done {
  padding: 8px 16px;
  background-color: var(--accent-green);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

/* Notulensi List */
.notulensi-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notulensi-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.notulensi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.notulensi-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notulensi-status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon.completed {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: var(--accent-green);
  color: white;
  border-radius: 50%;
}

.notulensi-date {
  font-weight: 600;
  color: var(--text-primary);
}

.notulensi-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

/* Topik Section */
.notulensi-topik {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.topik-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 500;
}

.topik-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 4px;
}

.notulensi-section {
  margin-bottom: 16px;
}

.notulensi-section h5 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.notulensi-section p {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
}

/* Feedback Dosen */
.feedback-section h5 {
  color: var(--accent-green);
}

.feedback-text {
  font-style: italic;
  color: var(--accent-green) !important;
  padding: 12px 16px;
  background-color: rgba(16, 185, 129, 0.08);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--accent-green);
}

/* Revisi Section */
.revisi-section h5 {
  color: var(--accent-orange);
}

.revisi-list {
  list-style: none;
  background-color: rgba(245, 158, 11, 0.05);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
}

.revisi-list li {
  font-size: 14px;
  color: var(--text-primary);
  padding: 8px 0 8px 20px;
  position: relative;
}

.revisi-list li:not(:last-child) {
  border-bottom: 1px solid var(--border-color);
}

.revisi-list li::before {
  content: '•';
  position: absolute;
  left: 8px;
  color: var(--accent-orange);
}

.notulensi-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.deadline-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.deadline-date {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-orange);
}

.notulensi-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.btn-status {
  padding: 8px 16px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.btn-status.success {
  background-color: var(--accent-green);
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
}

.history-date {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-blue);
  min-width: 140px;
}

.history-info {
  flex: 1;
}

.history-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.history-info p {
  font-size: 13px;
  color: var(--text-secondary);
}

.history-catatan {
  font-style: italic;
  margin-top: 4px;
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
  max-width: 480px;
  box-shadow: var(--shadow-lg);
}

.modal.modal-lg {
  max-width: 600px;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
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
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .jadwal-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .jadwal-actions {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
