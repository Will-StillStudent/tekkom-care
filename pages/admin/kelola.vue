<template>
  <div class="space-y-8">
    <!-- Header: Search & Filter (Sesuai Gambar 8) -->
    <div class="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
      <div class="relative w-96">
        <Icon name="ph:magnifying-glass-bold" class="absolute left-5 top-4 text-slate-400" size="18" />
        <input 
          type="text" 
          placeholder="Cari berdasarkan judul atau lokasi..." 
          class="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 transition-all" 
        />
      </div>
      
      <div class="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
        <button v-for="t in ['Semua', 'Pending', 'Diproses', 'Selesai']" :key="t" 
          class="px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
          :class="t === 'Semua' ? 'bg-[#123565] text-white shadow-lg' : 'text-slate-400 hover:bg-white hover:text-slate-600'"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <!-- Tabel Kelola Aduan (Sesuai Gambar 8) -->
    <div class="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr class="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
            <th class="px-8 py-5">ID</th>
            <th class="px-8 py-5">Judul Aduan</th>
            <th class="px-8 py-5">Kategori</th>
            <th class="px-8 py-5 text-nowrap">Tanggal Masuk</th>
            <th class="px-8 py-5 text-center">Status</th>
            <th class="px-8 py-5 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-sm font-bold text-slate-700">
          <!-- Tampilan jika tidak ada data -->
          <tr v-if="!allData || allData.length === 0">
            <td colspan="6" class="px-8 py-20 text-center text-slate-300 italic font-medium">
              Belum ada aduan yang masuk ke sistem.
            </td>
          </tr>

          <!-- Baris Data Asli -->
          <tr v-for="item in allData" :key="item.id" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
            <td class="px-8 py-6 opacity-40 font-mono">#{{ item.id }}</td>
            <td class="px-8 py-6 text-[#123565] max-w-xs truncate">{{ item.judul }}</td>
            <td class="px-8 py-6">
              <span class="flex items-center gap-2 opacity-60 font-medium">
                {{ item.kategori }}
              </span>
            </td>
            <td class="px-8 py-6 opacity-60 font-medium text-xs">{{ formatDate(item.createdAt) }}</td>
            <td class="px-8 py-6">
              <div :class="statusStyle(item.status)" class="mx-auto w-fit px-4 py-1.5 rounded-full text-[10px] font-black border flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                {{ item.status }}
              </div>
            </td>
            <td class="px-8 py-6">
              <div class="flex justify-center gap-2">
                <!-- Tombol Kelola -->
                <button 
                  @click="navigateTo('/admin/aduan/' + item.id)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition shadow-lg shadow-blue-600/20"
                >
                  Kelola
                </button>
                <!-- Tombol Hapus -->
                <button class="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-100 transition border border-red-100">
                  <Icon name="ph:trash-bold" size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>

// Ambil data session
const { user } = useUserSession()

// Jika bukan admin, tendang balik ke halaman utama
if (user.value?.role !== 'admin') {
  navigateTo('/')
}

// 1. Ambil data aduan dari seluruh user (API khusus Admin)
const { data: allData, refresh } = await useFetch('/api/admin/all')

// 2. Fungsi styling status (Sama dengan versi User)
const statusStyle = (status) => {
  if (status === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-100'
  if (status === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-100'
  if (status === 'Selesai') return 'bg-green-50 text-green-600 border-green-100'
  if (status === 'Ditolak') return 'bg-red-50 text-red-600 border-red-100'
  return 'bg-slate-50 text-slate-600'
}

// 3. Format Tanggal
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toISOString().split('T')[0]
}

// Refresh data setiap kali admin membuka halaman ini
onMounted(() => {
  refresh()
})
</script>