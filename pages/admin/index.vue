<template>
  <div v-if="data" class="space-y-10">
    <!-- 1. STATS CARDS (Baris Atas) -->
    <div class="grid grid-cols-5 gap-6">
      <div v-for="s in mainStats" :key="s.label" class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between aspect-[4/3]">
        <span class="text-5xl font-black" :class="s.color">{{ s.value }}</span>
        <p class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{{ s.label }}</p>
      </div>
    </div>

    <!-- 2. ANALYTICS SECTION (Baris Tengah) -->
    <div class="grid grid-cols-2 gap-10">
      <!-- Aduan per Kategori -->
      <div class="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-8">Aduan per Kategori</h3>
        <div class="space-y-8">
          <div v-for="cat in categoryList" :key="cat.name" class="space-y-3">
            <div class="flex justify-between text-[11px] font-black uppercase text-slate-400 tracking-wider">
              <span class="flex items-center gap-2"> {{ cat.icon }} {{ cat.name }}</span>
              <span>{{ cat.value }}</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#123565] transition-all duration-1000" :style="{ width: (cat.value / (data.stats.total || 1) * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Distribusi Status (Lingkaran Warna) -->
      <div class="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-8">Distribusi Status</h3>
        <div class="space-y-5">
          <div v-for="st in statusList" :key="st.label" class="flex items-center gap-4">
            <div class="w-2.5 h-2.5 rounded-full" :class="st.bg"></div>
            <span class="text-[11px] font-black text-slate-400 flex-1 uppercase tracking-widest">{{ st.label }}</span>
            <span class="text-sm font-black text-slate-800">{{ st.value }}</span>
            <div class="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-4">
              <div class="h-full" :class="st.bg" :style="{ width: (st.value / (data.stats.total || 1) * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. ADUAN TERBARU (Baris Bawah) -->
    <section>
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-bold text-slate-800 text-lg">Aduan Terbaru</h3>
        <NuxtLink to="/admin/kelola" class="text-blue-600 text-xs font-bold hover:underline">Kelola semua →</NuxtLink>
      </div>
      <div class="bg-white border border-slate-200 rounded-[32px] overflow-hidden">
        <div v-for="item in data.recent" :key="item.id" class="p-6 border-b border-slate-50 last:border-0 flex items-center justify-between">
          <div class="flex items-center gap-5">
            <div class="p-4 bg-slate-100 rounded-2xl text-xl">
              {{ item.kategori.includes('Fasilitas') ? '🏛️' : item.kategori.includes('SDM') ? '👤' : '🌿' }}
            </div>
            <div>
              <h4 class="font-bold text-slate-800 text-sm">{{ item.judul }}</h4>
              <p class="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{{ item.lokasi }} · {{ item.createdAt.split('T')[0] }}</p>
            </div>
          </div>
          <div :class="statusBadge(item.status)" class="text-[9px] font-black px-4 py-1.5 rounded-full border">
            ● {{ item.status }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Ambil data statistik riil
const { data } = await useFetch('/api/admin/stats')

// Mapping data ke komponen UI
const mainStats = computed(() => [
  { label: 'Total Aduan', value: data.value?.stats.total, color: 'text-blue-700' },
  { label: 'Menunggu', value: data.value?.stats.menunggu, color: 'text-orange-500' },
  { label: 'Diproses', value: data.value?.stats.diproses, color: 'text-blue-400' },
  { label: 'Selesai', value: data.value?.stats.selesai, color: 'text-green-500' },
  { label: 'Ditolak', value: data.value?.stats.ditolak, color: 'text-red-500' },
])

const categoryList = computed(() => [
  { name: 'Fasilitas', value: data.value?.categories.fasilitas, icon: '🏛️' },
  { name: 'SDM', value: data.value?.categories.sdm, icon: '👤' },
  { name: 'Lingkungan', value: data.value?.categories.lingkungan, icon: '🌿' },
])

const statusList = computed(() => [
  { label: 'Pending', value: data.value?.stats.menunggu, bg: 'bg-orange-500' },
  { label: 'Diproses', value: data.value?.stats.diproses, bg: 'bg-blue-400' },
  { label: 'Selesai', value: data.value?.stats.selesai, bg: 'bg-green-500' },
  { label: 'Ditolak', value: data.value?.stats.ditolak, bg: 'bg-red-500' },
])

const statusBadge = (s) => {
  if (s === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-200'
  if (s === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-200'
  if (s === 'Selesai') return 'bg-green-50 text-green-600 border-green-200'
  return 'bg-red-50 text-red-600 border-red-200'
}
</script>