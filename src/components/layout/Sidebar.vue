<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const authStore = useAuthStore()

const menuItems = [
  { id: 'beranda', label: 'Beranda', icon: 'home', route: '/beranda' },
  { id: 'progress', label: 'Progress Skripsi', icon: 'chart', route: '/progress' },
  { id: 'bimbingan', label: 'Bimbingan', icon: 'calendar', route: '/bimbingan' },
  { id: 'focus-timer', label: 'Focus Timer', icon: 'clock', route: '/focus-timer' },
  { id: 'diary', label: 'Diary Curhat', icon: 'book', route: '/diary' },
  { id: 'mood-booster', label: 'Mood Booster', icon: 'sparkle', route: '/mood-booster' },
  { id: 'mini-games', label: 'Mini Games', icon: 'game', route: '/mini-games' }
]

const currentPage = computed(() => route.name)

const navigateTo = (item) => {
  router.push(item.route)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <aside class="sidebar">
    <!-- Logo Section -->
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4L2 10L16 16L30 10L16 4Z" fill="#4F9CF9"/>
            <path d="M6 13V21C6 21 10 25 16 25C22 25 26 21 26 21V13" stroke="#4F9CF9" stroke-width="2" fill="none"/>
            <path d="M28 10V18" stroke="#4F9CF9" stroke-width="2"/>
            <circle cx="28" cy="20" r="2" fill="#4F9CF9"/>
          </svg>
        </div>
        <div class="logo-text">
          <h1>Teman Skripsi</h1>
          <p>Teman setia perjalanan skripsimu ✨</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <ul class="nav-menu">
        <li 
          v-for="item in menuItems" 
          :key="item.id"
          :class="['nav-item', { active: currentPage === item.id }]"
          @click="navigateTo(item)"
        >
          <span class="nav-icon">
            <!-- Home Icon -->
            <svg v-if="item.icon === 'home'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <!-- Chart Icon -->
            <svg v-else-if="item.icon === 'chart'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <!-- Calendar Icon -->
            <svg v-else-if="item.icon === 'calendar'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <!-- Clock Icon -->
            <svg v-else-if="item.icon === 'clock'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <!-- Book Icon -->
            <svg v-else-if="item.icon === 'book'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <!-- Sparkle Icon -->
            <svg v-else-if="item.icon === 'sparkle'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/>
              <path d="M5 3L5.5 5L7 5.5L5.5 6L5 8L4.5 6L3 5.5L4.5 5L5 3Z"/>
              <path d="M19 16L19.5 18L21 18.5L19.5 19L19 21L18.5 19L17 18.5L18.5 18L19 16Z"/>
            </svg>
            <!-- Game Icon -->
            <svg v-else-if="item.icon === 'game'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="6" width="20" height="12" rx="2"/>
              <line x1="6" y1="12" x2="10" y2="12"/>
              <line x1="8" y1="10" x2="8" y2="14"/>
              <circle cx="16" cy="10" r="1" fill="currentColor"/>
              <circle cx="18" cy="13" r="1" fill="currentColor"/>
            </svg>
          </span>
          <span class="nav-label">{{ item.label }}</span>
        </li>
      </ul>
    </nav>

    <!-- Dosen Pembimbing Info -->
    <div class="sidebar-footer">
      <div class="dosen-info">
        <span class="dosen-label">Dosen Pembimbing</span>
        <span class="dosen-name">{{ userStore.dosenName }}</span>
      </div>
      <button class="btn-logout" @click="handleLogout" title="Logout">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 20px;
}

.logo {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.logo-icon {
  flex-shrink: 0;
}

.logo-text h1 {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 2px;
}

.logo-text p {
  font-size: 11px;
  color: var(--text-secondary);
}

.sidebar-nav {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.nav-item:hover {
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
}

.nav-item.active {
  background-color: var(--primary-blue-light);
  color: var(--primary-blue);
  font-weight: 500;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.nav-label {
  font-size: 14px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--primary-blue-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dosen-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dosen-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.dosen-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  color: #dc2626;
  border-color: #dc2626;
  background-color: #fef2f2;
}
</style>
