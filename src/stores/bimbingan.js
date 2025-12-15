import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBimbinganStore = defineStore('bimbingan', () => {
  // State
  const jadwalList = ref([
    {
      id: 1,
      mahasiswaId: 1, // Andi Pratama
      mahasiswaNama: 'Andi Pratama',
      tanggal: '2024-10-24',
      waktu: '10:00',
      lokasi: 'Ruang Dosen Lt. 3',
      topik: 'Review BAB 2 - Tinjauan Pustaka',
      status: 'upcoming', // upcoming, done, cancelled
      catatan: ''
    },
    {
      id: 2,
      mahasiswaId: 1,
      mahasiswaNama: 'Andi Pratama',
      tanggal: '2024-10-17',
      waktu: '14:00',
      lokasi: 'Ruang Dosen Lt. 3',
      topik: 'Pembahasan BAB 1 - Pendahuluan',
      status: 'done',
      catatan: 'Revisi latar belakang, tambahkan data statistik terbaru'
    },
    {
      id: 3,
      mahasiswaId: 1,
      mahasiswaNama: 'Andi Pratama',
      tanggal: '2024-10-10',
      waktu: '09:00',
      lokasi: 'Online - Zoom',
      topik: 'Konsultasi Judul Skripsi',
      status: 'done',
      catatan: 'Judul disetujui, mulai pengerjaan BAB 1'
    }
  ])

  const notulensiList = ref([
    {
      id: 1,
      jadwalId: 2,
      mahasiswaId: 1,
      mahasiswaNama: 'Andi Pratama',
      tanggal: '2024-10-17',
      waktu: '14:00',
      topik: 'Review BAB II - Tinjauan Pustaka',
      hasilBimbingan: 'Pembahasan struktur BAB 2. Dosen menyetujui outline yang dibuat.',
      feedbackDosen: 'Sudah bagus, tambahkan 2-3 penelitian terdahulu yang lebih relevan dengan topik.',
      revisiDiminta: [
        'Tambah penelitian terdahulu tahun 2022-2024',
        'Perbaiki penulisan referensi mengikuti format APA 7th',
        'Perjelas kerangka pemikiran dengan diagram'
      ],
      deadline: '2024-10-24',
      statusRevisi: 'completed' // pending, in-progress, completed
    },
    {
      id: 2,
      jadwalId: 3,
      mahasiswaId: 1,
      mahasiswaNama: 'Andi Pratama',
      tanggal: '2024-10-10',
      waktu: '10:00',
      topik: 'Konsultasi Judul Skripsi',
      hasilBimbingan: 'Diskusi awal mengenai topik dan judul skripsi.',
      feedbackDosen: 'Judul sudah cukup baik, perlu dipersempit scope-nya agar lebih fokus.',
      revisiDiminta: [
        'Siapkan proposal singkat',
        'Buat outline BAB 1'
      ],
      deadline: '2024-10-17',
      statusRevisi: 'completed'
    }
  ])
  // Getters
  const upcomingBimbingan = computed(() => {
    return jadwalList.value
      .filter(j => j.status === 'upcoming')
      .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))[0]
  })

  const historyBimbingan = computed(() => {
    return jadwalList.value
      .filter(j => j.status === 'done')
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
  })

  const totalBimbingan = computed(() => {
    return jadwalList.value.filter(j => j.status === 'done').length
  })

  const pendingRevisi = computed(() => {
    return notulensiList.value.filter(n => n.statusRevisi !== 'completed').length
  })

  // Actions
  const addJadwal = (jadwal) => {
    const newId = Math.max(...jadwalList.value.map(j => j.id), 0) + 1
    jadwalList.value.push({
      id: newId,
      ...jadwal,
      status: 'upcoming'
    })
    saveToLocalStorage()
  }

  const updateJadwalStatus = (jadwalId, status) => {
    const jadwal = jadwalList.value.find(j => j.id === jadwalId)
    if (jadwal) {
      jadwal.status = status
      saveToLocalStorage()
    }
  }

  const addNotulensi = (notulensi) => {
    const newId = Math.max(...notulensiList.value.map(n => n.id), 0) + 1
    notulensiList.value.push({
      id: newId,
      ...notulensi,
      statusRevisi: 'pending'
    })
    saveToLocalStorage()
  }

  const updateRevisiStatus = (notulensiId, status) => {
    const notulensi = notulensiList.value.find(n => n.id === notulensiId)
    if (notulensi) {
      notulensi.statusRevisi = status
      saveToLocalStorage()
    }
  }

  // Local Storage
  const saveToLocalStorage = () => {
    localStorage.setItem('bimbingan_jadwal', JSON.stringify(jadwalList.value))
    localStorage.setItem('bimbingan_notulensi', JSON.stringify(notulensiList.value))
  }

  const loadFromLocalStorage = () => {
    const savedJadwal = localStorage.getItem('bimbingan_jadwal')
    const savedNotulensi = localStorage.getItem('bimbingan_notulensi')
    if (savedJadwal) jadwalList.value = JSON.parse(savedJadwal)
    if (savedNotulensi) notulensiList.value = JSON.parse(savedNotulensi)
  }

  // Initialize
  loadFromLocalStorage()

  return {
    jadwalList,
    notulensiList,
    upcomingBimbingan,
    historyBimbingan,
    totalBimbingan,
    pendingRevisi,
    addJadwal,
    updateJadwalStatus,
    addNotulensi,
    updateRevisiStatus,
    saveToLocalStorage
  }
})
