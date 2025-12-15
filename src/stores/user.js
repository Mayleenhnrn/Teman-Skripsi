import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref({
    id: 'mhs_001',
    nama: 'Ahmad Fauzan',
    nim: '2024001234',
    email: 'ahmad@univ.ac.id',
    jurusan: 'Teknik Informatika',
    judulSkripsi: 'Pengembangan Aplikasi Web Teman Skripsi untuk Membantu Mahasiswa dalam Proses Pengerjaan Tugas Akhir'
  })

  const dosenPembimbing = ref({
    id: 'dosen_001',
    nama: 'Dr. Puji Rahayu, M.Kom',
    nip: '198501012010011001'
  })

  // Getters
  const userName = computed(() => user.value.nama)
  const dosenName = computed(() => dosenPembimbing.value.nama)

  return {
    user,
    dosenPembimbing,
    userName,
    dosenName
  }
})
