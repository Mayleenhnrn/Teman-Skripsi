<script setup>
import { computed } from 'vue'

const props = defineProps({
  jadwal: {
    type: Object,
    default: () => ({
      tanggal: '2024-10-24',
      waktu: '10:00',
      dosen: 'Dr. Puji Rahayu, M.Kom'
    })
  }
})

const emit = defineEmits(['viewDetail'])

const formattedDate = computed(() => {
  const date = new Date(props.jadwal.tanggal)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  return `${dayName}, ${day} ${month} ${year} - ${props.jadwal.waktu}`
})
</script>

<template>
  <div class="bimbingan-card">
    <span class="bimbingan-label">Bimbingan Berikutnya</span>
    <h3 class="bimbingan-date">{{ formattedDate }}</h3>
    <p class="bimbingan-dosen">Dengan {{ jadwal.dosen }}</p>
    <button class="bimbingan-btn" @click="$emit('viewDetail')">
      Lihat Detail Bimbingan
    </button>
  </div>
</template>

<style scoped>
.bimbingan-card {
  background: linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 4px solid #1D4ED8;
}

.bimbingan-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bimbingan-date {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 4px 0;
}

.bimbingan-dosen {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

.bimbingan-btn {
  background-color: white;
  color: var(--primary-blue);
  border: none;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;
}

.bimbingan-btn:hover {
  background-color: #F0F9FF;
  transform: translateY(-1px);
}
</style>
