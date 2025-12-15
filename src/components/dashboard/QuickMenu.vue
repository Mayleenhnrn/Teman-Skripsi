<script setup>
const emit = defineEmits(['navigate'])

const quickMenus = [
  { id: 'focus-timer', label: 'Focus Timer', icon: 'clock', color: '#64748B' },
  { id: 'diary', label: 'Curhat', icon: 'book', color: '#EF4444' },
  { id: 'mood-booster', label: 'Mood Booster', icon: 'sparkle', color: '#F59E0B' },
  { id: 'mini-games', label: 'Mini Games', icon: 'game', color: '#64748B' }
]

const handleClick = (menuId) => {
  emit('navigate', menuId)
}
</script>

<template>
  <div class="quick-menu-section">
    <h3 class="section-title">Menu Cepat</h3>
    <div class="quick-menu-grid">
      <div 
        v-for="menu in quickMenus" 
        :key="menu.id"
        class="quick-menu-card"
        @click="handleClick(menu.id)"
      >
        <div class="menu-icon" :style="{ color: menu.color }">
          <!-- Clock Icon -->
          <svg v-if="menu.icon === 'clock'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <!-- Book Icon -->
          <svg v-else-if="menu.icon === 'book'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <!-- Sparkle Icon -->
          <svg v-else-if="menu.icon === 'sparkle'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/>
          </svg>
          <!-- Game Icon -->
          <svg v-else-if="menu.icon === 'game'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12h8"/>
            <path d="M12 8v8"/>
          </svg>
        </div>
        <span class="menu-label">{{ menu.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quick-menu-section {
  margin-top: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.quick-menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.quick-menu-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.quick-menu-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-blue);
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
</style>
