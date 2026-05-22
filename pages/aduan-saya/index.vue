<template>
  <div class="space-y-6 w-full overflow-hidden">
    <!-- Judul Halaman (Dibuat lebih dinamis) -->
    <h1 class="text-2xl font-bold text-[#123565] lg:hidden mb-4">Aduan Saya</h1>

    <!-- 1. Filter Tabs & Export Button -->
    <div class="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 w-full sm:w-fit shadow-sm">
      <button 
        v-for="tab in ['Semua', 'Pending', 'Diproses', 'Selesai', 'Ditolak']" 
        :key="tab" 
        @click="currentTab = tab"
        class="flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all whitespace-nowrap"
        :class="currentTab === tab ? 'bg-[#123565] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'"
      >
        {{ tab }}
      </button>
      <button 
        @click="downloadPDF"
        class="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 md:px-6 py-2 rounded-xl text-[10px] font-bold transition shadow-lg shadow-red-500/20"
      >
        <Icon name="ph:file-pdf-bold" size="14" />
        <span class="hidden sm:inline">PDF</span>
      </button>
    </div>

    <!-- 2. Tabel Container: Menggunakan teknik scrollable yang kita bahas sebelumnya -->
    <div class="bg-white border border-slate-200 rounded-2xl md:rounded-[32px] overflow-hidden shadow-sm w-full">
      <div class="overflow-x-auto">
        <!-- min-w memastikan tabel tidak hancur saat dikecilkan -->
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead class="bg-slate-50 border-b border-slate-100">
            <tr class="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
              <th class="px-6 py-5">Judul</th>
              <th class="px-6 py-5">Kategori</th>
              <th class="px-6 py-5">Lokasi</th>
              <th class="px-6 py-5">Tanggal</th>
              <th class="px-6 py-5 text-center">Status</th>
              <th class="px-6 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm font-bold text-slate-700">
            <tr v-if="filteredComplaints.length === 0">
              <td colspan="6" class="px-8 py-20 text-center text-slate-300 italic">
                Tidak ada aduan dalam kategori "{{ currentTab }}"
              </td>
            </tr>

            <tr v-for="item in filteredComplaints" :key="item.id" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
              <td class="px-6 py-5 font-bold text-[#123565] truncate max-w-[200px]">{{ item.judul }}</td>
              <td class="px-6 py-5 opacity-60 font-medium text-xs whitespace-nowrap">{{ item.kategori }}</td>
              <td class="px-6 py-5 opacity-60 font-medium text-xs whitespace-nowrap">{{ item.lokasi }}</td>
              <td class="px-6 py-5 opacity-60 font-medium text-xs whitespace-nowrap">{{ formatDate(item.createdAt) }}</td>
              <td class="px-6 py-5">
                <div :class="statusStyle(item.status)" class="mx-auto w-fit px-3 py-1 rounded-full text-[9px] font-black border flex items-center gap-2 whitespace-nowrap">
                  <div class="w-1 h-1 rounded-full bg-current"></div>
                  {{ item.status }}
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <button @click="navigateTo('/aduan-saya/' + item.id)" class="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-blue-600 transition">
                  <Icon name="ph:eye-bold" size="16"/>
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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const currentTab = ref('Semua')
const { data: allComplaints } = await useFetch('/api/complaints/user')

const filteredComplaints = computed(() => {
  if (!allComplaints.value) return []
  if (currentTab.value === 'Semua') return allComplaints.value
  return allComplaints.value.filter(c => c.status === currentTab.value)
})

// Fungsi untuk membersihkan emoji dan karakter spesial
const sanitizeText = (text) => {
  if (!text) return ''
  // Hapus semua karakter di luar ASCII dan Latin-1 Supplement (mempertahankan teks bahasa Indonesia)
  return text.replace(/[^\x20-\x7E\xA0-\xFF]/g, '').trim()
}

// --- FUNGSI DOWNLOAD PDF ---
const downloadPDF = () => {
  const doc = new jsPDF()
  
  // 1. Tambahkan Header Laporan
  doc.setFontSize(18)
  doc.setTextColor(18, 53, 101) // Warna #123565
  doc.text('DAFTAR ADUAN SAYA', 14, 22)
  
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('TekkomCare - Portal Pengaduan Teknik Komputer', 14, 30)
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 35)
  doc.line(14, 40, 196, 40) // Garis pembatas

  // 2. Siapkan Data untuk Tabel (dengan sanitasi kategori)
  const tableRows = filteredComplaints.value.map(item => [
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
  doc.save(`Daftar_Aduan_Saya_${currentTab.value}.pdf`)
}

const statusStyle = (status) => {
  if (status === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-100'
  if (status === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-100'
  if (status === 'Selesai') return 'bg-green-50 text-green-600 border-green-100'
  return 'bg-red-50 text-red-600 border-red-100'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toISOString().split('T')[0]
}
</script>