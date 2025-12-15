<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Beranda'
  },
  subtitle: {
    type: String,
    default: ''
  },
  currentPage: {
    type: String,
    default: 'beranda'
  }
})

const emit = defineEmits(['navigate'])

const handleNavigate = (pageId) => {
  emit('navigate', pageId)
}
</script>

<template>
  <div class="layout">
    <Sidebar :currentPage="currentPage" @navigate="handleNavigate" />
    <main class="main-content">
      <Header :title="title" :subtitle="subtitle" />
      <div class="page-content">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
}

.page-content {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}
</style>
