<template>
  <div class="space-y-8">
    <!-- HEADER: SEARCH & EXPORT BUTTON -->
    <div class="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
      
      <!-- Input Pencarian -->
      <div class="relative w-full md:w-96">
        <Icon name="ph:magnifying-glass-bold" class="absolute left-5 top-4 text-slate-300" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari judul atau lokasi..." 
          class="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <!-- TOMBOL CETAK PDF (Fitur Baru) -->
        <button 
          @click="downloadPDF"
          class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-red-500/20"
        >
          <Icon name="ph:file-pdf-bold" size="18" />
          Cetak PDF
        </button>

        <!-- Filter Tab -->
        <div class="flex gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button v-for="tab in ['Semua', 'Pending', 'Diproses', 'Selesai']" :key="tab"
            @click="currentFilter = tab"
            class="px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all"
            :class="currentFilter === tab ? 'bg-[#123565] text-white shadow-md' : 'text-slate-400'"
          >
            {{ tab }}
          </button>
        </div>
      </div>
    </div>

    <!-- TABEL DATA -->
    <div class="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="bg-slate-50 border-b border-slate-100">
            <tr class="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
              <th class="px-8 py-5">Judul Aduan</th>
              <th class="px-8 py-5">Lokasi</th>
              <th class="px-8 py-5">Tanggal</th>
              <th class="px-8 py-5 text-center">Status</th>
              <th class="px-8 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm font-bold text-slate-700">
            <tr v-if="filteredData.length === 0">
              <td colspan="5" class="px-8 py-20 text-center text-slate-300 italic">Data tidak ditemukan</td>
            </tr>
            <tr v-for="item in filteredData" :key="item.id" class="border-b border-slate-50 hover:bg-slate-50/50 transition">
              <td class="px-8 py-6 text-[#123565]">{{ item.judul }}</td>
              <td class="px-8 py-6 text-slate-500 font-medium">{{ item.lokasi }}</td>
              <td class="px-8 py-6 text-slate-400 font-medium text-xs">{{ formatDate(item.createdAt) }}</td>
              <td class="px-8 py-6">
                <div :class="statusStyle(item.status)" class="mx-auto w-fit px-4 py-1.5 rounded-full text-[10px] font-black border uppercase">
                  {{ item.status }}
                </div>
              </td>
              <td class="px-8 py-6 text-center">
                <button @click="navigateTo('/admin/aduan/' + item.id)" class="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase transition shadow-lg shadow-blue-600/20">Kelola</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import library PDF
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const { user } = useUserSession()
if (user.value?.role !== 'admin') navigateTo('/')

const { data: allComplaints, refresh } = await useFetch('/api/admin/all')
const currentFilter = ref('Semua')
const searchQuery = ref('')

const filteredData = computed(() => {
  if (!allComplaints.value) return []
  return allComplaints.value.filter(item => {
    const matchStatus = currentFilter.value === 'Semua' || item.status === currentFilter.value
    const query = searchQuery.value.toLowerCase()
    const matchSearch = item.judul.toLowerCase().includes(query) || item.lokasi.toLowerCase().includes(query)
    return matchStatus && matchSearch
  })
})

// --- FUNGSI DOWNLOAD PDF ---
const downloadPDF = () => {
  const doc = new jsPDF()
  
  // Fungsi untuk membersihkan emoji dan karakter spesial
  const sanitizeText = (text) => {
    if (!text) return ''
    // Hapus semua karakter di luar ASCII dan Latin-1 Supplement (mempertahankan teks bahasa Indonesia)
    return text.replace(/[^\x20-\x7E\xA0-\xFF]/g, '').trim()
  }
  
  // 1. Tambahkan Header Laporan
  doc.setFontSize(18)
  doc.setTextColor(18, 53, 101) // Warna #123565
  doc.text('REKAPITULASI PENGADUAN TEKKOMCARE', 14, 22)
  
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('Departemen Teknik Komputer - Universitas Diponegoro', 14, 30)
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 35)
  doc.line(14, 40, 196, 40) // Garis pembatas

  // 2. Siapkan Data untuk Tabel (dengan sanitasi kategori)
  const tableRows = filteredData.value.map(item => [
    `#${item.id}`,
    sanitizeText(item.judul),
    sanitizeText(item.kategori),
    sanitizeText(item.lokasi),
    formatDate(item.createdAt),
    sanitizeText(item.status)
  ])

  // 3. Gambar Tabel
  autoTable(doc, {
    startY: 45,
    head: [['ID', 'Judul Aduan', 'Kategori', 'Lokasi', 'Tanggal', 'Status']],
    body: tableRows,
    headStyles: { fillColor: [18, 53, 101], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 4, font: 'helvetica' },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  })

  // 4. Download File
  doc.save(`Laporan_TekkomCare_${currentFilter.value}.pdf`)
}

const statusStyle = (s) => {
  if (s === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-200'
  if (s === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-200'
  if (s === 'Selesai') return 'bg-green-50 text-green-600 border-green-200'
  return 'bg-slate-50 text-slate-400'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toISOString().split('T')[0]
}

onMounted(() => refresh())
</script>