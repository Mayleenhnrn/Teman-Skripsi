<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Branding -->
      <div class="login-branding">
        <div class="branding-content">
          <div class="logo">
            <span class="logo-icon">📚</span>
            <span class="logo-text">Teman Skripsi</span>
          </div>
          <h1>Selamat Datang Kembali!</h1>
          <p>Masuk ke akun Anda untuk melanjutkan perjalanan skripsi.</p>
          <div class="branding-illustration">
            <div class="floating-card card-1">
              <span>📊</span> Progress 75%
            </div>
            <div class="floating-card card-2">
              <span>📅</span> Bimbingan Hari Ini
            </div>
            <div class="floating-card card-3">
              <span>✅</span> BAB 2 Selesai
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-form-section">
        <div class="form-container">
          <div class="form-header">
            <router-link to="/" class="back-to-home">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Kembali ke Beranda
            </router-link>
            <h2>Masuk</h2>
            <p>Pilih role dan masukkan kredensial Anda</p>
          </div>

          <!-- Role Selection -->
          <div class="role-selection">
            <button 
              :class="['role-btn', { active: selectedRole === 'mahasiswa' }]"
              @click="selectedRole = 'mahasiswa'"
            >
              <div class="role-icon">🎓</div>
              <span>Mahasiswa</span>
            </button>
            <button 
              :class="['role-btn', { active: selectedRole === 'dosen' }]"
              @click="selectedRole = 'dosen'"
            >
              <div class="role-icon">👨‍🏫</div>
              <span>Dosen</span>
            </button>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label>{{ selectedRole === 'mahasiswa' ? 'NIM atau Email' : 'NIP atau Email' }}</label>
              <div class="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input 
                  type="text" 
                  v-model="form.identifier" 
                  :placeholder="selectedRole === 'mahasiswa' ? 'Masukkan NIM atau Email' : 'Masukkan NIP atau Email'"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="form.password" 
                  placeholder="Masukkan password"
                  required
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe" />
                <span>Ingat saya</span>
              </label>
              <a href="#" class="forgot-link">Lupa password?</a>
            </div>

            <div v-if="errorMessage" class="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {{ errorMessage }}
            </div>

            <button type="submit" class="btn-login" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-else>Masuk</span>
            </button>
          </form>

          <div class="form-footer">
            <p>Belum punya akun? <router-link :to="`/register?role=${selectedRole}`">Daftar sekarang</router-link></p>
          </div>

          <!-- Demo Credentials -->
          <div class="demo-credentials">
            <p class="demo-title">Demo Login:</p>
            <div class="demo-info">
              <div class="demo-item">
                <strong>Mahasiswa:</strong> 2021001 / password123
              </div>
              <div class="demo-item">
                <strong>Dosen:</strong> 198501012010011001 / dosen123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const selectedRole = ref('mahasiswa')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = ref({
  identifier: '',
  password: ''
})

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const result = authStore.login({
    identifier: form.value.identifier,
    password: form.value.password,
    role: selectedRole.value
  })

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
.login-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* Left Side - Branding */
.login-branding {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.branding-content {
  color: white;
  z-index: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 36px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
}

.branding-content h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.branding-content p {
  font-size: 18px;
  opacity: 0.9;
  max-width: 400px;
}

.branding-illustration {
  margin-top: 60px;
  position: relative;
  height: 200px;
}

.floating-card {
  position: absolute;
  background-color: white;
  color: #1e293b;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: floatCard 4s ease-in-out infinite;
}

.floating-card span {
  font-size: 20px;
}

.card-1 {
  top: 0;
  left: 0;
}

.card-2 {
  top: 60px;
  left: 150px;
  animation-delay: 1s;
}

.card-3 {
  top: 120px;
  left: 50px;
  animation-delay: 2s;
}

@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Right Side - Form */
.login-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.form-container {
  width: 100%;
  max-width: 420px;
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
  gap: 12px;
  margin-bottom: 28px;
}

.role-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background-color: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
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

.role-btn span {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

/* Form */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s;
}

.input-wrapper:focus-within {
  border-color: #3b82f6;
  background-color: white;
}

.input-wrapper svg {
  color: #94a3b8;
  flex-shrink: 0;
}

.input-wrapper input {
  flex: 1;
  padding: 14px 0;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1e293b;
}

.input-wrapper input:focus {
  outline: none;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0;
  display: flex;
}

.toggle-password:hover {
  color: #64748b;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
}

.forgot-link {
  font-size: 14px;
  color: #3b82f6;
  text-decoration: none;
}

.forgot-link:hover {
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

/* Login Button */
.btn-login {
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

.btn-login:hover {
  background-color: #2563eb;
}

.btn-login:disabled {
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

/* Demo Credentials */
.demo-credentials {
  margin-top: 24px;
  padding: 16px;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
}

.demo-title {
  font-size: 13px;
  font-weight: 600;
  color: #16a34a;
  margin-bottom: 8px;
}

.demo-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-item {
  font-size: 12px;
  color: #15803d;
}

/* Responsive */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
  }
  
  .login-branding {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-form-section {
    padding: 24px;
  }
  
  .role-selection {
    grid-template-columns: 1fr;
  }
}
</style>
