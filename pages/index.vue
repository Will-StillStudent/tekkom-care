<template>
  <div class="space-y-10">
    <!-- WELCOME BANNER (Sesuai Gambar 3) -->
    <div class="bg-[#123565] rounded-[32px] p-10 text-white relative overflow-hidden shadow-xl shadow-blue-900/10">
      <div class="relative z-10">
        <h1 class="text-3xl font-bold mb-2">Selamat datang, {{ user?.nama || 'User' }}! 👋</h1>
        <p class="opacity-60 text-sm mb-8 max-w-md">Sampaikan aduanmu dengan mudah dan pantau perkembangannya di sini.</p>
        <NuxtLink to="/buat-aduan" class="bg-[#38bdf8] text-[#123565] px-6 py-3 rounded-2xl font-black text-sm inline-flex items-center gap-2 hover:scale-105 transition shadow-lg shadow-cyan-400/20">
          <Icon name="ph:plus-bold" /> Buat Aduan Baru
        </NuxtLink>
      </div>
      <!-- Ornamen Dekoratif Bulat -->
      <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full"></div>
      <div class="absolute right-20 bottom-[-50px] w-32 h-32 bg-white/5 rounded-full"></div>
    </div>

    <!-- STATS CARDS (Sesuai Gambar 3) -->
    <div class="grid grid-cols-4 gap-6">
      <div v-for="stat in statsDisplay" :key="stat.label" class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between aspect-[4/2.5]">
        <div class="flex justify-between items-start">
          <span class="text-5xl font-black" :class="stat.colorClass">
            {{ stat.value || 0 }}
          </span>
        </div>
        <p class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{{ stat.label }}</p>
      </div>
    </div>

    <!-- ADUAN TERBARU (Sesuai Gambar 3) -->
    <section>
      <div class="flex justify-between items-center mb-6 px-2">
        <h3 class="font-bold text-slate-800 text-lg">Aduan Terbaru</h3>
        <NuxtLink to="/aduan-saya" class="text-blue-600 text-xs font-bold hover:underline">Lihat semua →</NuxtLink>
      </div>
      
      <div class="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <!-- Tampilan jika belum ada aduan (User Baru) -->
        <div v-if="!recentComplaints || recentComplaints.length === 0" class="p-20 text-center text-slate-400">
          <Icon name="ph:folder-open-light" size="48" class="mb-4 opacity-20" />
          <p class="text-sm font-medium">Belum ada aduan yang Anda kirimkan.</p>
        </div>

        <!-- Tampilan Daftar Aduan (Jika ada data) -->
        <div v-else v-for="item in recentComplaints" :key="item.id" class="p-6 border-b border-slate-50 last:border-0 flex items-center justify-between hover:bg-slate-50 transition">
          <div class="flex items-center gap-5">
            <div class="p-4 bg-slate-100 rounded-2xl text-2xl">
              {{ item.kategori.includes('Fasilitas') ? '🏛️' : item.kategori.includes('SDM') ? '👥' : '🌿' }}
            </div>
            <div>
              <h4 class="font-bold text-slate-800">{{ item.judul }}</h4>
              <p class="text-xs text-slate-400 mt-1 font-medium">{{ item.kategori }} · {{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
          <!-- Status Badge -->
          <div :class="statusStyle(item.status)" class="text-[10px] font-black px-4 py-1.5 rounded-full border flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
            {{ item.status }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 1. Ambil data user yang sedang login
const { user } = useUserSession()

// 2. Ambil statistik riil dari database (kita panggil API yang sudah dibuat sebelumnya)
const { data: statsData } = await useFetch('/api/user/stats')

// 3. Ambil daftar aduan terbaru milik user ini
const { data: recentComplaints } = await useFetch('/api/complaints/user')

// Mapping statistik untuk tampilan grid
const statsDisplay = computed(() => [
  { label: 'Total Aduan', value: statsData.value?.total, colorClass: 'text-blue-700' },
  { label: 'Menunggu', value: statsData.value?.pending, colorClass: 'text-orange-500' },
  { label: 'Diproses', value: statsData.value?.proses, colorClass: 'text-blue-400' },
  { label: 'Selesai', value: statsData.value?.selesai, colorClass: 'text-green-500' },
])

// Fungsi untuk menentukan warna status badge
const statusStyle = (status) => {
  if (status === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-200'
  if (status === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-200'
  if (status === 'Selesai') return 'bg-green-50 text-green-600 border-green-200'
  if (status === 'Ditolak') return 'bg-red-50 text-red-600 border-red-200'
  return 'bg-slate-50 text-slate-600 border-slate-200'
}

// Fungsi format tanggal
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>