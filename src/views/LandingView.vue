<template>
  <div class="landing-page">
    <!-- Navbar -->
    <nav class="landing-nav">
      <div class="nav-container">
        <div class="nav-logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">Teman Skripsi</span>
        </div>
        <div class="nav-links">
          <router-link to="/login" class="btn-login">Masuk</router-link>
          <router-link to="/register" class="btn-register">Daftar</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1>Kelola Skripsimu dengan <span class="highlight">Lebih Mudah</span></h1>
          <p class="hero-subtitle">
            Platform all-in-one untuk membantu mahasiswa mengelola progres skripsi, 
            jadwal bimbingan, dan tetap produktif hingga wisuda.
          </p>
          <div class="hero-buttons">
            <router-link to="/register" class="btn-primary">
              Mulai Sekarang
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
            <router-link to="/login" class="btn-secondary">
              Sudah Punya Akun?
            </router-link>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">500+</span>
              <span class="stat-label">Mahasiswa Terbantu</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">50+</span>
              <span class="stat-label">Dosen Pembimbing</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">95%</span>
              <span class="stat-label">Tingkat Kepuasan</span>
            </div>
          </div>
        </div>
        <div class="hero-illustration">
          <div class="illustration-card main">
            <div class="card-header">
              <span class="dot green"></span>
              <span class="card-title">Progress Skripsi</span>
            </div>
            <div class="progress-bars">
              <div class="progress-item">
                <span>BAB 1</span>
                <div class="progress-track"><div class="progress-fill" style="width: 100%"></div></div>
              </div>
              <div class="progress-item">
                <span>BAB 2</span>
                <div class="progress-track"><div class="progress-fill" style="width: 75%"></div></div>
              </div>
              <div class="progress-item">
                <span>BAB 3</span>
                <div class="progress-track"><div class="progress-fill" style="width: 40%"></div></div>
              </div>
            </div>
          </div>
          <div class="illustration-card floating timer">
            <span class="timer-icon">⏱️</span>
            <span class="timer-text">Focus: 25:00</span>
          </div>
          <div class="illustration-card floating schedule">
            <span class="schedule-icon">📅</span>
            <span class="schedule-text">Bimbingan Besok</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="features">
      <div class="features-container">
        <div class="section-header">
          <span class="section-badge">Fitur Unggulan</span>
          <h2>Semua yang Kamu Butuhkan untuk Sukses Skripsi</h2>
          <p>Fitur lengkap untuk mahasiswa dan dosen pembimbing</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>Tracking Progress</h3>
            <p>Pantau progres setiap BAB skripsi dengan checklist tugas yang detail dan visual progress bar.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon orange">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>Jadwal Bimbingan</h3>
            <p>Atur jadwal bimbingan dengan dosen, catat notulensi, dan lacak revisi yang diminta.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3>Focus Timer</h3>
            <p>Tingkatkan produktivitas dengan teknik Pomodoro dan latihan pernapasan 4-7-8.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3>Feedback Langsung</h3>
            <p>Dosen bisa memberikan feedback langsung pada setiap sesi bimbingan mahasiswa.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon pink">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3>Mood Booster</h3>
            <p>Tetap semangat dengan quotes motivasi, mini games, dan diary untuk curhat.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon teal">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Multi-User</h3>
            <p>Sistem terpisah untuk mahasiswa dan dosen dengan fitur yang sesuai kebutuhan.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <div class="cta-content">
          <h2>Siap Menyelesaikan Skripsimu?</h2>
          <p>Bergabung dengan ratusan mahasiswa lainnya dan mulai perjalanan skripsimu dengan lebih terorganisir.</p>
          <div class="cta-buttons">
            <router-link to="/register" class="btn-cta-primary">
              Daftar Sebagai Mahasiswa
            </router-link>
            <router-link to="/register?role=dosen" class="btn-cta-secondary">
              Daftar Sebagai Dosen
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-container">
        <div class="footer-brand">
          <span class="logo-icon">📚</span>
          <span class="logo-text">Teman Skripsi</span>
        </div>
        <p class="footer-text">© 2025 Teman Skripsi. Dibuat untuk membantu mahasiswa Indonesia.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No logic needed for landing page
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
}

/* Navbar */
.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid #e2e8f0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-login {
  padding: 10px 20px;
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background-color: #eff6ff;
}

.btn-register {
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.btn-register:hover {
  background-color: #2563eb;
}

/* Hero Section */
.hero-section {
  padding: 140px 24px 80px;
  background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #fef3c7 100%);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 20px;
}

.highlight {
  color: #3b82f6;
}

.hero-subtitle {
  font-size: 18px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 32px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 14px 28px;
  background-color: white;
  color: #64748b;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background-color: #e2e8f0;
}

/* Hero Illustration */
.hero-illustration {
  position: relative;
  height: 400px;
}

.illustration-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.illustration-card.main {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.green {
  background-color: #10b981;
}

.card-title {
  font-weight: 600;
  color: #1e293b;
}

.progress-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-item span {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  min-width: 50px;
}

.progress-track {
  flex: 1;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  border-radius: 4px;
}

.illustration-card.floating {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  animation: float 3s ease-in-out infinite;
}

.illustration-card.timer {
  bottom: 80px;
  left: 0;
}

.illustration-card.schedule {
  bottom: 20px;
  right: 0;
  animation-delay: 1.5s;
}

.timer-icon, .schedule-icon {
  font-size: 20px;
}

.timer-text, .schedule-text {
  font-weight: 500;
  color: #1e293b;
  font-size: 14px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Features Section */
.features-section {
  padding: 100px 24px;
  background-color: white;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-badge {
  display: inline-block;
  padding: 6px 16px;
  background-color: #eff6ff;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.section-header p {
  font-size: 18px;
  color: #64748b;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-card {
  padding: 32px;
  background-color: #f8fafc;
  border-radius: 16px;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-icon.blue { background-color: #dbeafe; color: #3b82f6; }
.feature-icon.orange { background-color: #fef3c7; color: #f59e0b; }
.feature-icon.green { background-color: #d1fae5; color: #10b981; }
.feature-icon.purple { background-color: #ede9fe; color: #8b5cf6; }
.feature-icon.pink { background-color: #fce7f3; color: #ec4899; }
.feature-icon.teal { background-color: #ccfbf1; color: #14b8a6; }

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  padding: 100px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.cta-content h2 {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
}

.cta-content p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-cta-primary {
  padding: 16px 32px;
  background-color: white;
  color: #3b82f6;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s;
}

.btn-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-cta-secondary {
  padding: 16px 32px;
  background-color: transparent;
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
}

.btn-cta-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
}

/* Footer */
.landing-footer {
  padding: 40px 24px;
  background-color: #1e293b;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-brand .logo-text {
  color: white;
}

.footer-text {
  color: #94a3b8;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-illustration {
    display: none;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 32px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-container {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>
