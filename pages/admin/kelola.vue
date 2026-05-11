<template>
  <div class="space-y-8">
    <!-- SEARCH & FILTER BAR -->
    <div class="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center">
      
      <!-- Input Pencarian (v-model dihubungkan ke searchQuery) -->
      <div class="relative w-96">
        <Icon name="ph:magnifying-glass-bold" class="absolute left-5 top-4 text-slate-300" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari berdasarkan judul atau lokasi..." 
          class="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
        />
      </div>

      <!-- TOMBOL FILTER STATUS -->
      <div class="flex gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
        <button 
          v-for="tab in ['Semua', 'Pending', 'Diproses', 'Selesai']" 
          :key="tab"
          @click="currentFilter = tab"
          class="px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300"
          :class="currentFilter === tab 
            ? 'bg-[#123565] text-white shadow-lg shadow-blue-900/20' 
            : 'text-slate-400 hover:text-slate-600'"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- TABEL KELOLA -->
    <div class="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="bg-slate-50 border-b border-slate-100">
            <tr class="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
              <th class="px-8 py-5">Judul Aduan</th>
              <th class="px-8 py-5">Lokasi</th>
              <th class="px-8 py-5">Kategori</th>
              <th class="px-8 py-5">Tanggal</th>
              <th class="px-8 py-5 text-center">Status</th>
              <th class="px-8 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm font-bold text-slate-700">
            <!-- Pesan jika hasil pencarian atau filter tidak ditemukan -->
            <tr v-if="filteredData.length === 0">
              <td colspan="6" class="px-8 py-20 text-center text-slate-300 italic font-medium">
                Data tidak ditemukan untuk "{{ searchQuery }}" di kategori "{{ currentFilter }}"
              </td>
            </tr>

            <!-- Baris Data Hasil Filter & Search -->
            <tr v-for="item in filteredData" :key="item.id" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
              <td class="px-8 py-6 text-[#123565] font-black">{{ item.judul }}</td>
              <td class="px-8 py-6 text-slate-500 font-medium">{{ item.lokasi }}</td>
              <td class="px-8 py-6 opacity-60 font-medium text-xs">{{ item.kategori }}</td>
              <td class="px-8 py-6 opacity-60 font-medium text-xs">{{ formatDate(item.createdAt) }}</td>
              <td class="px-8 py-6">
                <div :class="statusStyle(item.status)" class="mx-auto w-fit px-4 py-1.5 rounded-full text-[10px] font-black border flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                  {{ item.status }}
                </div>
              </td>
              <td class="px-8 py-6 text-center">
                <button 
                  @click="navigateTo('/admin/aduan/' + item.id)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition shadow-lg"
                >
                  Kelola
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// Proteksi role admin
const { user } = useUserSession()
if (user.value?.role !== 'admin') navigateTo('/')

// Ambil data
const { data: allComplaints, refresh } = await useFetch('/api/admin/all')

// State
const currentFilter = ref('Semua')
const searchQuery = ref('')

// LOGIKA FILTER GANDA (Status + Pencarian)
const filteredData = computed(() => {
  if (!allComplaints.value) return []
  
  return allComplaints.value.filter(item => {
    // 1. Filter Status
    const matchStatus = currentFilter.value === 'Semua' || item.status === currentFilter.value
    
    // 2. Filter Pencarian (Cek Judul ATAU Lokasi)
    // Kita ubah semua ke lowercase agar pencarian tidak sensitif huruf besar/kecil
    const query = searchQuery.value.toLowerCase()
    const matchSearch = item.judul.toLowerCase().includes(query) || 
                        item.lokasi.toLowerCase().includes(query)
    
    // Harus memenuhi kedua syarat di atas
    return matchStatus && matchSearch
  })
})

const statusStyle = (status) => {
  if (status === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-100'
  if (status === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-100'
  if (status === 'Selesai') return 'bg-green-50 text-green-600 border-green-100'
  return 'bg-slate-50 text-slate-400'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toISOString().split('T')[0]
}

onMounted(() => refresh())
</script>