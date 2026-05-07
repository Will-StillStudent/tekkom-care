<template>
  <div class="flex min-h-screen bg-[#f3f6f9] font-sans text-slate-700">
    <!-- SIDEBAR (Biru Gelap - Tetap di Kiri) -->
    <aside class="w-72 bg-[#123565] text-white flex flex-col fixed h-full z-20 shadow-xl">
      
      <!-- LOGO SECTION -->
      <div class="p-8 flex items-center gap-3">
        <div class="bg-blue-500 p-2 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Icon name="ph:plus-bold" class="text-white text-xl" />
        </div>
        <div>
          <h1 class="font-bold text-xl leading-tight">TekkomCare</h1>
          <p class="text-[10px] opacity-60 uppercase tracking-widest font-medium">Teknik Komputer · UNDIP</p>
        </div>
      </div>

      <!-- NAVIGATION MENU -->
      <nav class="flex-1 px-4 mt-6 space-y-1">
        
        <!-- MENU KHUSUS ADMIN (Akan muncul jika user.role === 'admin') -->
        <template v-if="user?.role === 'admin'">
          <p class="text-[10px] uppercase opacity-40 font-black px-6 mb-4 tracking-[0.2em]">Menu Admin</p>
          <NuxtLink to="/admin" class="nav-btn" active-class="active-btn">
            <Icon name="ph:chart-bar-bold" size="20"/> Dashboard Admin
          </NuxtLink>
          <NuxtLink to="/admin/kelola" class="nav-btn" active-class="active-btn">
            <Icon name="ph:list-checks-bold" size="20"/> Kelola Aduan
          </NuxtLink>
        </template>

        <!-- MENU KHUSUS USER (Akan muncul jika user.role === 'user' atau default) -->
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

      <!-- USER PROFILE CARD (Bagian Bawah Sidebar) -->
      <div class="p-6 border-t border-white/10">
        <div class="bg-white/10 p-4 rounded-2xl flex items-center gap-3 mb-4 border border-white/5 transition hover:bg-white/20">
          <!-- Inisial Nama (Huruf Pertama) -->
          <div class="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center font-black text-lg text-[#123565] shadow-inner">
            {{ user?.nama?.charAt(0).toUpperCase() || '?' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-bold truncate">{{ user?.nama || 'Memuat...' }}</p>
            <p class="text-[11px] opacity-60 font-medium capitalize">{{ user?.role || 'User' }}</p>
          </div>
        </div>
        <!-- Tombol Logout -->
        <button @click="handleLogout" class="flex items-center gap-3 px-6 py-2 text-red-400 text-sm font-bold w-full hover:text-red-300 transition-colors group">
          <Icon name="ph:sign-out-bold" size="18" class="group-hover:-translate-x-1 transition-transform" /> 
          Keluar
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT AREA (Halaman yang berubah-ubah) -->
    <main class="flex-1 ml-72">
      <!-- HEADER ATAS (Dinamis) -->
      <header class="h-20 bg-white border-b border-slate-200 px-12 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <h2 class="font-bold text-slate-800 text-xl tracking-tight capitalize">
          {{ displayTitle }}
        </h2>
        
        <div class="flex items-center gap-5">
          <!-- Ikon Notifikasi -->
          <button class="text-slate-400 hover:text-blue-600 transition-colors relative p-2">
            <Icon name="ph:bell-bold" size="22"/>
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <!-- Tag Nama User di Header -->
          <div class="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <div class="w-6 h-6 bg-blue-500 rounded-full text-[10px] flex items-center justify-center text-white font-black uppercase">
              {{ user?.nama?.charAt(0) || 'A' }}
            </div>
            <span class="text-xs font-bold text-slate-600">{{ user?.role === 'admin' ? 'Admin TekkomCare' : user?.nama }}</span>
          </div>
        </div>
      </header>

      <!-- Konten dari Folder Pages dimasukkan ke sini -->
      <div class="p-12">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
// 1. Ambil data route untuk judul dinamis
const route = useRoute()

// 2. Ambil data session user & fungsi logout
const { user, clear } = useUserSession()

// 3. Logika untuk mengubah judul di Header secara otomatis
const displayTitle = computed(() => {
  const path = route.path
  if (path === '/') return 'Beranda'
  if (path === '/admin') return 'Dashboard Admin'
  if (path.includes('buat-aduan')) return 'Buat Aduan Baru'
  if (path.includes('aduan-saya')) return 'Daftar Aduan Saya'
  if (path.includes('kelola')) return 'Kelola Pengaduan'
  return path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'TekkomCare'
})

// layouts/default.vue
async function handleLogout() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    await clear() // Menghapus session dari server & browser
    // Gunakan window.location.href agar browser melakukan "Hard Refresh" 
    // Ini cara paling ampuh untuk membuang semua sisa data user lama
    window.location.href = '/login' 
  }
}
</script>

<style scoped>
/* Tombol navigasi standar */
.nav-btn {
  @apply flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-white/5 opacity-70 transition-all duration-200 text-sm font-bold;
}

/* Tampilan tombol saat halaman tersebut sedang dibuka */
.active-btn {
  @apply !bg-blue-600/30 !opacity-100 border-l-4 border-white shadow-lg;
}

/* Menghilangkan scrollbar pada sidebar */
aside::-webkit-scrollbar {
  display: none;
}
</style>