<template>
  <div class="flex min-h-screen bg-[#f3f6f9] font-sans text-slate-700 overflow-x-hidden">
    
    <!-- MOBILE SIDEBAR BACKDROP -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>
    
    <!-- SIDEBAR (Biru Gelap - Muncul di Desktop) -->
    <aside :class="['w-72 bg-[#123565] text-white flex-col fixed h-full z-40 shadow-xl transition-transform duration-300 ease-in-out flex', isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      
      <!-- LOGO -->
      <div class="p-8 flex items-center gap-3">
        <div class="bg-blue-500 p-2 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Icon name="ph:plus-bold" class="text-white text-xl" />
        </div>
        <div>
          <h1 class="font-bold text-xl leading-tight tracking-tight">TekkomCare</h1>
          <p class="text-[10px] opacity-60 uppercase tracking-widest font-medium">Teknik Komputer · UNDIP</p>
        </div>
      </div>

      <!-- NAVIGASI DINAMIS -->
      <nav class="flex-1 px-4 mt-6 space-y-1 overflow-y-auto custom-scrollbar">
        <!-- MENU ADMIN -->
        <template v-if="user?.role === 'admin'">
          <p class="text-[10px] uppercase opacity-40 font-black px-6 mb-4 tracking-[0.2em]">Menu Admin</p>
          <NuxtLink to="/admin" class="nav-btn" active-class="active-btn">
            <Icon name="ph:chart-bar-bold" size="20"/> Dashboard Admin
          </NuxtLink>
          <NuxtLink to="/admin/kelola" class="nav-btn" active-class="active-btn">
            <Icon name="ph:list-checks-bold" size="20"/> Kelola Pengaduan
          </NuxtLink>
        </template>

        <!-- MENU USER -->
        <template v-else>
          <p class="text-[10px] uppercase opacity-40 font-black px-6 mb-4 tracking-[0.2em]">Menu User</p>
          <NuxtLink to="/" class="nav-btn" active-class="active-btn">
            <Icon name="ph:house-bold" size="20"/> Beranda
          </NuxtLink>
          <NuxtLink to="/buat-aduan" class="nav-btn" active-class="active-btn">
            <Icon name="ph:plus-circle-bold" size="20"/> Buat Aduan
          </NuxtLink>
          <NuxtLink to="/aduan-saya" class="nav-btn" active-class="active-btn">
            <Icon name="ph:list-bullets-bold" size="20"/> Aduan Saya
          </NuxtLink>
        </template>
      </nav>

      <!-- PROFIL & LOGOUT (Bawah Sidebar) -->
      <div class="p-6 border-t border-white/10">
        <div class="bg-white/10 p-4 rounded-2xl flex items-center gap-3 mb-4 border border-white/5 transition hover:bg-white/20">
          <div class="w-10 h-10 bg-blue-400 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg text-[#123565]">
            {{ user?.nama?.charAt(0).toUpperCase() || '?' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-bold truncate">{{ user?.nama || 'Memuat...' }}</p>
            <p class="text-[11px] opacity-60 font-medium capitalize">{{ user?.role || 'User' }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="flex items-center gap-3 px-6 py-2 text-red-400 text-sm font-bold w-full hover:text-red-300 transition-colors group">
          <Icon name="ph:sign-out-bold" size="18" class="group-hover:-translate-x-1 transition-transform" /> 
          Keluar
        </button>
      </div>
    </aside>

    <!-- AREA KONTEN UTAMA -->
    <main class="flex-1 lg:ml-72 min-w-0 transition-all duration-300 flex flex-col">
      
      <!-- HEADER ATAS -->
      <header class="h-20 bg-white border-b border-slate-200 px-4 md:px-8 lg:px-12 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-white/80">
        <div class="flex items-center gap-3">
          <!-- HAMBURGER BUTTON (Hanya di Mobile) -->
          <button @click="isSidebarOpen = !isSidebarOpen" class="lg:hidden text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-lg transition-colors">
            <Icon name="ph:list-bold" size="24"/>
          </button>
          
          <h2 class="font-bold text-slate-800 text-lg md:text-xl tracking-tight capitalize truncate">
            {{ displayTitle }}
          </h2>
        </div>
        
        <div class="flex items-center gap-3 md:gap-5 flex-shrink-0">
          
          <!-- DROPDOWN NOTIFIKASI -->
          <div class="relative group">
            <button class="text-slate-400 hover:text-blue-600 transition-colors relative p-2 rounded-xl hover:bg-slate-50">
              <Icon name="ph:bell-bold" size="22"/>
              <!-- Dot Merah Notif -->
              <span v-if="unreadCount > 0" class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            <!-- Dropdown Menu Notif -->
            <div class="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-[32px] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
              <div class="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 class="font-bold text-xs uppercase tracking-widest text-[#123565]">Notifikasi</h3>
                <span v-if="unreadCount > 0" class="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase">{{ unreadCount }} Baru</span>
              </div>
              
              <div class="max-h-[400px] overflow-y-auto custom-scrollbar-light">
                <div v-if="!notifs || notifs.length === 0" class="p-10 text-center text-slate-300 text-xs italic">
                  Belum ada notifikasi
                </div>
                
                <div 
                  v-for="n in notifs" :key="n.id"
                  @click="goToNotif(n)"
                  class="p-5 border-b border-slate-50 hover:bg-blue-50/50 cursor-pointer transition-colors relative group/item"
                >
                  <div v-if="n.isRead === 0" class="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <p class="font-bold text-xs text-slate-800 mb-1 flex justify-between">
                    {{ n.title }}
                    <span class="text-[9px] text-slate-300 font-medium">{{ formatTime(n.createdAt) }}</span>
                  </p>
                  <p class="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{{ n.message }}</p>
                </div>
              </div>
              
              <div class="p-4 text-center bg-slate-50/30">
                 <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pusat Informasi TekkomCare</p>
              </div>
            </div>
          </div>
          
          <!-- TAG PROFIL DI HEADER -->
          <div class="flex items-center gap-3 bg-slate-50 px-3 md:px-4 py-2 rounded-full border border-slate-200">
            <div class="w-6 h-6 bg-blue-600 rounded-full text-[10px] flex items-center justify-center text-white font-black uppercase">
              {{ user?.nama?.charAt(0) || '?' }}
            </div>
            <span class="hidden sm:inline text-xs font-bold text-slate-600 truncate max-w-[100px]">
              {{ user?.role === 'admin' ? 'Admin' : user?.nama }}
            </span>
          </div>
        </div>
      </header>

      <!-- KONTEN HALAMAN -->
      <div class="p-4 md:p-8 lg:p-12 max-w-[1440px] mx-auto w-full flex-1">
        <slot />
      </div>

    </main>
  </div>
</template>

<script setup>
const route = useRoute()
const { user, clear } = useUserSession()

// State untuk sidebar mobile
const isSidebarOpen = ref(false)

// 1. Ambil data notifikasi asli dari server
const { data: notifs, refresh } = await useFetch('/api/notifications')

// 2. Hitung jumlah notif yang belum dibaca
const unreadCount = computed(() => notifs.value?.filter(n => n.isRead === 0).length || 0)

// 3. Judul Halaman Otomatis
const displayTitle = computed(() => {
  const path = route.path
  if (path === '/') return 'Beranda'
  if (path === '/admin') return 'Dashboard Admin'
  if (path.includes('buat-aduan')) return 'Buat Aduan Baru'
  if (path.includes('aduan-saya')) return 'Daftar Aduan'
  if (path.includes('kelola')) return 'Kelola Pengaduan'
  return 'TekkomCare'
})

// Tutup sidebar saat navigasi
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

// layouts/default.vue

async function goToNotif(notif) {
  console.log("Mengarahkan ke:", notif.link) // Cek di F12 apakah link-nya muncul
  
  // 1. Pindah Halaman
  if (notif.link) {
    await navigateTo(notif.link)
  }

  // 2. Tandai sudah dibaca di database (Opsional)
  try {
    await $fetch('/api/notifications/mark-read', {
      method: 'POST',
      body: { id: notif.id }
    })
    refresh() // Segarkan daftar notif agar titik merah hilang
  } catch (e) {
    console.error("Gagal update status baca")
  }
}

// 5. Fungsi Logout (Hard Redirect)
async function handleLogout() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    await clear()
    window.location.href = '/login'
  }
}

// 6. Format Waktu
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

// 7. Polling Refresh Notifikasi setiap 30 detik
let timer
onMounted(() => {
  timer = setInterval(() => refresh(), 30000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.nav-btn {
  @apply flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-white/5 opacity-70 transition-all duration-200 text-sm font-bold;
}

.active-btn {
  @apply !bg-blue-600/30 !opacity-100 border-l-4 border-white shadow-lg;
}

/* Scrollbar Sidebar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }

/* Scrollbar Dropdown Notif */
.custom-scrollbar-light::-webkit-scrollbar { width: 5px; }
.custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar-light::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>