<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Left Side - Branding -->
      <div class="register-branding">
        <div class="branding-content">
          <router-link to="/" class="logo">
            <span class="logo-icon">📚</span>
            <span class="logo-text">Teman Skripsi</span>
          </router-link>
          <h1>Bergabung Sekarang!</h1>
          <p>Daftar dan mulai kelola skripsimu dengan lebih terorganisir.</p>
          
          <div class="benefits-list">
            <div class="benefit-item">
              <span class="benefit-icon">✅</span>
              <span>Tracking progress skripsi per BAB</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✅</span>
              <span>Jadwal dan notulensi bimbingan</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✅</span>
              <span>Focus timer untuk produktivitas</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✅</span>
              <span>Mood booster saat jenuh</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Register Form -->
      <div class="register-form-section">
        <div class="form-container">
          <div class="form-header">
            <router-link to="/" class="back-to-home">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Kembali ke Beranda
            </router-link>
            <h2>Daftar Akun</h2>
            <p>Isi data diri Anda untuk membuat akun</p>
          </div>

          <!-- Role Selection -->
          <div class="role-selection">
            <button 
              :class="['role-btn', { active: selectedRole === 'mahasiswa' }]"
              @click="selectedRole = 'mahasiswa'"
            >
              <div class="role-icon">🎓</div>
              <div class="role-info">
                <span class="role-name">Mahasiswa</span>
                <span class="role-desc">Untuk mahasiswa yang sedang skripsi</span>
              </div>
            </button>
            <button 
              :class="['role-btn', { active: selectedRole === 'dosen' }]"
              @click="selectedRole = 'dosen'"
            >
              <div class="role-icon">👨‍🏫</div>
              <div class="role-info">
                <span class="role-name">Dosen</span>
                <span class="role-desc">Untuk dosen pembimbing skripsi</span>
              </div>
            </button>
          </div>

          <!-- Register Form -->
          <form @submit.prevent="handleRegister" class="register-form">
            <!-- Common Fields -->
            <div class="form-row">
              <div class="form-group">
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  v-model="form.nama" 
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>{{ selectedRole === 'mahasiswa' ? 'NIM' : 'NIP/NIDN' }}</label>
                <input 
                  type="text" 
                  v-model="form.identifier" 
                  :placeholder="selectedRole === 'mahasiswa' ? 'Contoh: 2021001' : 'Contoh: 198501012010011001'"
                  required
                />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  v-model="form.email" 
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <!-- Role Specific Fields -->
            <div class="form-row" v-if="selectedRole === 'mahasiswa'">
              <div class="form-group">
                <label>Jurusan/Prodi</label>
                <input 
                  type="text" 
                  v-model="form.jurusan" 
                  placeholder="Contoh: Teknik Informatika"
                  required
                />
              </div>
              <div class="form-group">
                <label>Dosen Pembimbing</label>
                <select v-model="form.dosenPembimbingId" required>
                  <option value="">Pilih Dosen Pembimbing</option>
                  <option v-for="dosen in dosenList" :key="dosen.id" :value="dosen.id">
                    {{ dosen.nama }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row" v-if="selectedRole === 'dosen'">
              <div class="form-group full-width">
                <label>Bidang Keahlian</label>
                <input 
                  type="text" 
                  v-model="form.bidangKeahlian" 
                  placeholder="Contoh: Artificial Intelligence, Data Science"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Password</label>
                <div class="input-wrapper">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    v-model="form.password" 
                    placeholder="Minimal 8 karakter"
                    required
                    minlength="8"
                  />
                  <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                    <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label>Konfirmasi Password</label>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="form.confirmPassword" 
                  placeholder="Ulangi password"
                  required
                />
              </div>
            </div>

            <div class="form-checkbox">
              <label class="checkbox-label">
                <input type="checkbox" v-model="agreeTerms" required />
                <span>Saya setuju dengan <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a></span>
              </label>
            </div>

            <div v-if="errorMessage" class="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {{ errorMessage }}
            </div>

            <button type="submit" class="btn-register" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-else>Daftar Sekarang</span>
            </button>
          </form>

          <div class="form-footer">
            <p>Sudah punya akun? <router-link to="/login">Masuk</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const selectedRole = ref('mahasiswa')
const showPassword = ref(false)
const agreeTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = ref({
  nama: '',
  identifier: '',
  email: '',
  password: '',
  confirmPassword: '',
  jurusan: '',
  dosenPembimbingId: '',
  bidangKeahlian: ''
})

const dosenList = computed(() => authStore.dosenList)

onMounted(() => {
  // Check for role query param
  if (route.query.role === 'dosen') {
    selectedRole.value = 'dosen'
  }
})

const handleRegister = async () => {
  errorMessage.value = ''
  
  // Validate password match
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'Password dan konfirmasi password tidak cocok'
    return
  }

  isLoading.value = true

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Prepare user data based on role
  let userData = {
    role: selectedRole.value,
    nama: form.value.nama,
    email: form.value.email,
    password: form.value.password
  }

  if (selectedRole.value === 'mahasiswa') {
    userData.nim = form.value.identifier
    userData.jurusan = form.value.jurusan
    userData.dosenPembimbingId = parseInt(form.value.dosenPembimbingId)
  } else {
    userData.nip = form.value.identifier
    userData.bidangKeahlian = form.value.bidangKeahlian
  }

  const result = authStore.register(userData)
  isLoading.value = false

  if (result.success) {
    // Redirect based on role
    if (result.user.role === 'dosen') {
      router.push('/dosen/dashboard')
    } else {
      router.push('/beranda')
    }
  } else {
    errorMessage.value = result.message
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  min-height: 100vh;
}

/* Left Side - Branding */
.register-branding {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  height: 100vh;
}

.branding-content {
  color: white;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  text-decoration: none;
}

.logo-icon {
  font-size: 36px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.branding-content h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.branding-content > p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.benefit-icon {
  font-size: 20px;
}

/* Right Side - Form */
.register-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 560px;
}

.form-header {
  margin-bottom: 32px;
}

.back-to-home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 16px;
  transition: color 0.2s;
}

.back-to-home:hover {
  color: #4F9CF9;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-header p {
  color: #64748b;
  font-size: 15px;
}

/* Role Selection */
.role-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

.role-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background-color: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.role-btn:hover {
  border-color: #3b82f6;
}

.role-btn.active {
  background-color: #eff6ff;
  border-color: #3b82f6;
}

.role-icon {
  font-size: 32px;
}

.role-info {
  display: flex;
  flex-direction: column;
}

.role-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.role-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

/* Form */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  padding: 12px 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  color: #1e293b;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: white;
}

.form-group input::placeholder {
  color: #94a3b8;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.input-wrapper:focus-within {
  border-color: #3b82f6;
  background-color: white;
}

.input-wrapper input {
  flex: 1;
  padding: 12px 14px;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1e293b;
}

.input-wrapper input:focus {
  outline: none;
}

.toggle-password {
  background: none;
  border: none;
  padding: 12px;
  cursor: pointer;
  color: #94a3b8;
}

.toggle-password:hover {
  color: #64748b;
}

/* Checkbox */
.form-checkbox {
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: #3b82f6;
}

.checkbox-label a {
  color: #3b82f6;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #fef2f2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Register Button */
.btn-register {
  width: 100%;
  padding: 14px;
  background-color: #3b82f6;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-register:hover {
  background-color: #2563eb;
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Form Footer */
.form-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.form-footer p {
  font-size: 14px;
  color: #64748b;
}

.form-footer a {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 1024px) {
  .register-container {
    grid-template-columns: 1fr;
  }
  
  .register-branding {
    display: none;
  }
}

@media (max-width: 640px) {
  .register-form-section {
    padding: 40px 24px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .role-selection {
    grid-template-columns: 1fr;
  }
}
</style>
