import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref(null)
  const isAuthenticated = ref(false)
  
  // Users database (simulated with localStorage)
  const users = ref([
    // Sample mahasiswa
    {
      id: 1,
      role: 'mahasiswa',
      nim: '2021001',
      nama: 'Andi Pratama',
      email: 'andi@student.ac.id',
      password: 'password123',
      jurusan: 'Teknik Informatika',
      dosenPembimbingId: 1,
      createdAt: '2024-01-15'
    },
    // Sample dosen
    {
      id: 2,
      role: 'dosen',
      nip: '198501012010011001',
      nama: 'Dr. Budi Santoso, M.Kom.',
      email: 'budi.santoso@lecturer.ac.id',
      password: 'dosen123',
      bidangKeahlian: 'Artificial Intelligence',
      createdAt: '2024-01-01'
    }
  ])

  // Getters
  const userRole = computed(() => currentUser.value?.role || null)
  const userName = computed(() => currentUser.value?.nama || '')
  const isMahasiswa = computed(() => currentUser.value?.role === 'mahasiswa')
  const isDosen = computed(() => currentUser.value?.role === 'dosen')
  
  const dosenList = computed(() => {
    return users.value.filter(u => u.role === 'dosen')
  })

  const mahasiswaBimbingan = computed(() => {
    if (!isDosen.value) return []
    return users.value.filter(u => 
      u.role === 'mahasiswa' && 
      u.dosenPembimbingId === currentUser.value.id
    )
  })

  // Actions
  const login = (credentials) => {
    const { identifier, password, role } = credentials
    
    let user = null
    
    if (role === 'mahasiswa') {
      user = users.value.find(u => 
        u.role === 'mahasiswa' && 
        (u.nim === identifier || u.email === identifier) && 
        u.password === password
      )
    } else if (role === 'dosen') {
      user = users.value.find(u => 
        u.role === 'dosen' && 
        (u.nip === identifier || u.email === identifier) && 
        u.password === password
      )
    }
    
    if (user) {
      currentUser.value = { ...user }
      delete currentUser.value.password // Don't store password in session
      isAuthenticated.value = true
      saveSession()
      return { success: true, user: currentUser.value }
    }
    
    return { success: false, message: 'NIM/NIP/Email atau password salah' }
  }

  const register = (userData) => {
    const { role, nim, nip, email } = userData
    
    // Check if user already exists
    const existingUser = users.value.find(u => {
      if (role === 'mahasiswa') {
        return u.nim === nim || u.email === email
      } else {
        return u.nip === nip || u.email === email
      }
    })
    
    if (existingUser) {
      return { success: false, message: 'NIM/NIP atau Email sudah terdaftar' }
    }
    
    // Create new user
    const newId = Math.max(...users.value.map(u => u.id), 0) + 1
    const newUser = {
      id: newId,
      ...userData,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    users.value.push(newUser)
    saveToLocalStorage()
    
    // Auto login after register
    currentUser.value = { ...newUser }
    delete currentUser.value.password
    isAuthenticated.value = true
    saveSession()
    
    return { success: true, user: currentUser.value }
  }

  const logout = () => {
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('auth_session')
  }

  const getDosenById = (id) => {
    return users.value.find(u => u.role === 'dosen' && u.id === id)
  }

  const getMahasiswaById = (id) => {
    return users.value.find(u => u.role === 'mahasiswa' && u.id === id)
  }

  // Local Storage
  const saveSession = () => {
    localStorage.setItem('auth_session', JSON.stringify({
      user: currentUser.value,
      isAuthenticated: isAuthenticated.value
    }))
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('auth_users', JSON.stringify(users.value))
  }

  const loadFromLocalStorage = () => {
    // Load users
    const savedUsers = localStorage.getItem('auth_users')
    if (savedUsers) {
      users.value = JSON.parse(savedUsers)
    } else {
      // Save initial users
      saveToLocalStorage()
    }
    
    // Load session
    const savedSession = localStorage.getItem('auth_session')
    if (savedSession) {
      const session = JSON.parse(savedSession)
      currentUser.value = session.user
      isAuthenticated.value = session.isAuthenticated
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    // State
    currentUser,
    isAuthenticated,
    users,
    
    // Getters
    userRole,
    userName,
    isMahasiswa,
    isDosen,
    dosenList,
    mahasiswaBimbingan,
    
    // Actions
    login,
    register,
    logout,
    getDosenById,
    getMahasiswaById,
    loadFromLocalStorage
  }
})
