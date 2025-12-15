# 📚 Teman Skripsi

**Teman Skripsi** adalah aplikasi web yang dirancang untuk membantu mahasiswa dan dosen dalam mengelola proses pengerjaan skripsi. Aplikasi ini menyediakan berbagai fitur untuk tracking progress, manajemen bimbingan, dan tools produktivitas.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite)
![Pinia](https://img.shields.io/badge/Pinia-State%20Management-yellow?style=flat-square)

## ✨ Fitur Utama

### Untuk Mahasiswa
- **📊 Progress Skripsi** - Tracking progress per BAB dengan visualisasi persentase
- **📅 Bimbingan** - Manajemen jadwal bimbingan dan notulensi
- **⏱️ Focus Timer** - Timer pomodoro untuk fokus mengerjakan skripsi
- **📝 Diary Curhat** - Tempat mencurahkan perasaan selama proses skripsi
- **🎮 Mini Games** - Game ringan untuk refreshing (Memory Game, Word Scramble, Tic Tac Toe)
- **✨ Mood Booster** - Quotes motivasi dan quick boost tips

### Untuk Dosen
- **👥 Dashboard Dosen** - Melihat daftar mahasiswa bimbingan
- **📋 Review Progress** - Melihat progress skripsi mahasiswa
- **💬 Feedback** - Memberikan feedback pada notulensi bimbingan

## 🛠️ Tech Stack

- **Frontend:** Vue.js 3 (Composition API)
- **Build Tool:** Vite
- **State Management:** Pinia
- **Routing:** Vue Router 4
- **Storage:** LocalStorage (untuk demo)

## 🚀 Instalasi & Menjalankan

### Prerequisites
- Node.js (v18 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

```bash
# Clone repository
git clone https://github.com/username/teman-skripsi.git

# Masuk ke direktori project
cd teman-skripsi

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

## 🔐 Demo Login

### Mahasiswa
- **NIM:** 2021001
- **Password:** password123

### Dosen
- **NIP:** 198501012010011001
- **Password:** dosen123

## 📁 Struktur Project

```
src/
├── components/          # Komponen reusable
│   └── layout/          # Layout components (Sidebar, dll)
├── router/              # Konfigurasi Vue Router
├── stores/              # Pinia stores
│   ├── auth.js          # Authentication store
│   ├── bimbingan.js     # Bimbingan & notulensi store
│   ├── focus.js         # Focus timer store
│   ├── progress.js      # Progress skripsi store
│   └── user.js          # User data store
├── views/               # Halaman utama
│   ├── dosen/           # Halaman khusus dosen
│   ├── LandingView.vue  # Landing page
│   ├── LoginView.vue    # Halaman login
│   ├── RegisterView.vue # Halaman register
│   └── ...              # Halaman fitur lainnya
├── App.vue              # Root component
└── main.js              # Entry point
```

## 🎨 Screenshots

### Landing Page
Halaman utama dengan informasi tentang aplikasi dan tombol untuk login/register.

### Dashboard Mahasiswa
Dashboard dengan navigasi ke semua fitur: Progress, Bimbingan, Focus Timer, dll.

### Dashboard Dosen
Dashboard untuk melihat mahasiswa bimbingan dan memberikan feedback.

## 📝 Catatan

- Aplikasi ini menggunakan **localStorage** untuk menyimpan data (demo purpose)
- Untuk production, disarankan menggunakan backend dengan database
- Data akan hilang jika localStorage di-clear

## 🤝 Kontribusi

Kontribusi selalu welcome! Silakan buat pull request atau issue jika menemukan bug.

## 📄 Lisensi

MIT License - Silakan gunakan untuk keperluan edukasi dan pengembangan.

---

Dibuat dengan ❤️ untuk membantu mahasiswa menyelesaikan skripsi
