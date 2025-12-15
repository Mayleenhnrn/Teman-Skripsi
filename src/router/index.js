import { createRouter, createWebHistory } from 'vue-router'

// Views
import BerandaView from '../views/BerandaView.vue'

const routes = [
  // Public Routes
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingView.vue'),
    meta: {
      title: 'Teman Skripsi',
      public: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      title: 'Masuk',
      public: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: {
      title: 'Daftar',
      public: true
    }
  },

  // Mahasiswa Routes
  {
    path: '/beranda',
    name: 'beranda',
    component: BerandaView,
    meta: {
      title: 'Beranda',
      subtitle: 'Dashboard utama untuk melihat ringkasan aktivitas',
      requiresAuth: true,
      role: 'mahasiswa'
    }
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../views/ProgressView.vue'),
    meta: {
      title: 'Progress Skripsi',
      subtitle: 'Pantau progress pengerjaan skripsimu',
      requiresAuth: true,
      role: 'mahasiswa'
    }
  },
  {
    path: '/bimbingan',
    name: 'bimbingan',
    component: () => import('../views/BimbinganView.vue'),
    meta: {
      title: 'Bimbingan',
      subtitle: 'Kelola jadwal dan catatan bimbingan',
      requiresAuth: true,
      role: 'mahasiswa'
    }
  },
  {
    path: '/focus-timer',
    name: 'focus-timer',
    component: () => import('../views/FocusTimerView.vue'),
    meta: {
      title: 'Focus Timer',
      subtitle: 'Timer pomodoro untuk fokus mengerjakan skripsi',
      requiresAuth: true,
      role: 'mahasiswa'
    }
  },
  {
    path: '/diary',
    name: 'diary',
    component: () => import('../views/DiaryView.vue'),
    meta: {
      title: 'Diary Curhat',
      subtitle: 'Tulis perasaan dan refleksi harianmu',
      requiresAuth: true,
      role: 'mahasiswa'
    }
  },
  {
    path: '/mood-booster',
    name: 'mood-booster',
    component: () => import('../views/MoodBoosterView.vue'),
    meta: {
      title: 'Mood Booster',
      subtitle: 'Tingkatkan mood dan semangatmu',
      requiresAuth: true,
      role: 'mahasiswa'
    }
  },
  {
    path: '/mini-games',
    name: 'mini-games',
    component: () => import('../views/MiniGamesView.vue'),
    meta: {
      title: 'Mini Games',
      subtitle: 'Istirahat sejenak dengan permainan ringan',
      requiresAuth: true,
      role: 'mahasiswa'
    }
  },

  // Dosen Routes
  {
    path: '/dosen/dashboard',
    name: 'dosen-dashboard',
    component: () => import('../views/dosen/DosenDashboardView.vue'),
    meta: {
      title: 'Dashboard Dosen',
      subtitle: 'Kelola mahasiswa bimbingan',
      requiresAuth: true,
      role: 'dosen'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title ? `${to.meta.title} - Teman Skripsi` : 'Teman Skripsi'
  
  // Get auth state from localStorage
  const authSession = localStorage.getItem('auth_session')
  const isAuthenticated = authSession ? JSON.parse(authSession).isAuthenticated : false
  const currentUser = authSession ? JSON.parse(authSession).user : null
  
  // Public routes - no auth needed
  if (to.meta.public) {
    // If already logged in and trying to access login/register, redirect to dashboard
    if (isAuthenticated && (to.name === 'login' || to.name === 'register')) {
      if (currentUser?.role === 'dosen') {
        next('/dosen/dashboard')
      } else {
        next('/beranda')
      }
      return
    }
    next()
    return
  }
  
  // Protected routes - check auth
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/login')
      return
    }
    
    // Check role if specified
    if (to.meta.role && currentUser?.role !== to.meta.role) {
      // Redirect to correct dashboard based on role
      if (currentUser?.role === 'dosen') {
        next('/dosen/dashboard')
      } else {
        next('/beranda')
      }
      return
    }
  }
  
  next()
})

export default router
