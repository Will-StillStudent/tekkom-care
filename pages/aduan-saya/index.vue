<template>
  <!-- Gunakan max-w-full dan overflow-hidden untuk mengunci lebar komponen -->
  <div class="space-y-8 max-w-full overflow-hidden">
    
    <!-- Filter Tabs: Tambahkan overflow-x-auto juga jika tab terlalu banyak di HP -->
    <div class="flex gap-2 bg-white p-2 rounded-2xl border w-fit shadow-sm max-w-full overflow-x-auto no-scrollbar">
      <button 
        v-for="tab in ['Semua', 'Pending', 'Diproses', 'Selesai', 'Ditolak']" 
        :key="tab" 
        @click="currentTab = tab"
        class="px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
        :class="currentTab === tab ? 'bg-[#123565] text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-50'"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm w-full">
      
      <!-- Wrapper Scroll Horizontal -->
      <!-- 'block' dan 'w-full' memastikan dia mengambil ruang yang tersedia saja -->
      <div class="block w-full overflow-x-auto">
        
        <!-- Tabel: Gunakan min-w-max agar kolom tidak menyempit/gepeng -->
        <table class="w-full text-left border-collapse min-w-max">
          <thead class="bg-slate-50 border-b border-slate-100">
            <tr class="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
              <th class="px-8 py-5">Judul</th>
              <th class="px-8 py-5">Kategori</th>
              <th class="px-8 py-5">Lokasi</th>
              <th class="px-8 py-5">Tanggal</th>
              <th class="px-8 py-5 text-center">Status</th>
              <th class="px-8 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm font-bold text-slate-700">
            <tr v-if="filteredComplaints.length === 0">
              <td colspan="6" class="px-8 py-20 text-center text-slate-300 font-medium italic">
                Tidak ada aduan dalam kategori "{{ currentTab }}"
              </td>
            </tr>

            <tr v-for="item in filteredComplaints" :key="item.id" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
              <!-- whitespace-nowrap sangat penting di sini agar text tidak turun ke bawah -->
              <td class="px-8 py-6 font-bold text-[#123565] whitespace-nowrap">{{ item.judul }}</td>
              <td class="px-8 py-6 whitespace-nowrap">
                <span class="flex items-center gap-2 opacity-60 font-medium">
                  {{ item.kategori }}
                </span>
              </td>
              <td class="px-8 py-6 opacity-60 font-medium text-xs whitespace-nowrap">{{ item.lokasi }}</td>
              <td class="px-8 py-6 opacity-60 font-medium text-xs whitespace-nowrap">{{ formatDate(item.createdAt) }}</td>
              <td class="px-8 py-6">
                <div :class="statusStyle(item.status)" class="mx-auto w-fit px-4 py-1.5 rounded-full text-[10px] font-black border flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                  {{ item.status }}
                </div>
              </td>
              <td class="px-8 py-6 text-center">
                <button 
                   @click="navigateTo('/aduan-saya/' + item.id)"
                   class="bg-slate-100 p-2.5 rounded-xl text-slate-400 hover:text-blue-600 transition shadow-sm"
                >
                  <Icon name="ph:eye-bold" size="18"/>
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
// 1. Inisialisasi Tab yang sedang aktif
const currentTab = ref('Semua')

// 2. Ambil data asli dari API yang baru dibuat
const { data: allComplaints, refresh } = await useFetch('/api/complaints/user')

// 3. Logika Filter: Memfilter data berdasarkan tab yang diklik
const filteredComplaints = computed(() => {
  if (!allComplaints.value) return []
  if (currentTab.value === 'Semua') return allComplaints.value
  return allComplaints.value.filter(c => c.status === currentTab.value)
})

// Fungsi Styling Status Badge
const statusStyle = (status) => {
  if (status === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-100'
  if (status === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-100'
  if (status === 'Selesai') return 'bg-green-50 text-green-600 border-green-100'
  if (status === 'Ditolak') return 'bg-red-50 text-red-600 border-red-100'
  return 'bg-slate-50 text-slate-400 border-slate-100'
}

// Fungsi Format Tanggal agar rapi
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toISOString().split('T')[0] // Hasil: 2026-04-20
}

// Refresh data setiap kali masuk halaman ini
onMounted(() => {
  refresh()
})
</script>