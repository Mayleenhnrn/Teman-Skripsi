<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from './components/layout/MainLayout.vue'

const route = useRoute()
const router = useRouter()

// Check if current route is a public page (no layout needed)
const isPublicPage = computed(() => {
  const publicRoutes = ['landing', 'login', 'register']
  return publicRoutes.includes(route.name)
})

// Check if current route is dosen dashboard
const isDosenPage = computed(() => {
  return route.path.startsWith('/dosen')
})

// Get page config from route meta
const pageConfig = computed(() => ({
  title: route.meta.title || 'Beranda',
  subtitle: route.meta.subtitle || ''
}))

// Get current page name for sidebar active state
const currentPage = computed(() => route.name || 'beranda')

const handleNavigate = (pageId) => {
  router.push({ name: pageId })
}
</script>

<template>
  <!-- Public Pages (Landing, Login, Register) - No layout -->
  <router-view v-if="isPublicPage || isDosenPage" />
  
  <!-- Mahasiswa Pages - With MainLayout -->
  <MainLayout 
    v-else
    :title="pageConfig.title" 
    :subtitle="pageConfig.subtitle"
    :currentPage="currentPage"
    @navigate="handleNavigate"
  >
    <router-view />
  </MainLayout>
</template>

<style>
/* Import main styles */
@import './assets/styles/main.css';
</style>
