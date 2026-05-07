<template>
  <div v-if="item" class="max-w-4xl mx-auto space-y-6">
    <!-- Tombol Kembali -->
    <button @click="navigateTo('/aduan-saya')" class="inline-flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-[#123565] transition">
      <Icon name="ph:arrow-left-bold" /> Kembali
    </button>

    <!-- Card Detail (Sesuai Gambar 6) -->
    <div class="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
      <div class="p-10 border-b border-slate-100">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h1 class="text-2xl font-bold text-slate-800 mb-3">{{ item.judul }}</h1>
            <div class="flex gap-4 text-xs font-bold text-slate-400">
              <span class="flex items-center gap-1"><Icon name="ph:map-pin-bold" class="text-red-400"/> {{ item.lokasi }}</span>
              <span class="flex items-center gap-1"><Icon name="ph:calendar-bold" /> {{ formatDate(item.createdAt) }}</span>
              <span class="flex items-center gap-1"><Icon name="ph:bank-bold" /> {{ item.kategori }}</span>
            </div>
          </div>
          <!-- Status Badge -->
          <div :class="statusStyle(item.status)" class="px-5 py-2 rounded-full text-[10px] font-black border flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
            {{ item.status }}
          </div>
        </div>

        <!-- Box Deskripsi -->
        <div class="bg-slate-50 p-8 rounded-3xl mb-10 border border-slate-100">
          <p class="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em]">Deskripsi Aduan</p>
          <p class="text-sm leading-relaxed font-medium text-slate-600">{{ item.deskripsi }}</p>
        </div>

        <!-- Riwayat & Tanggapan (Timeline) -->
        <h3 class="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest">Riwayat & Tanggapan</h3>
        <div class="space-y-10 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          
          <!-- Event 1: Aduan Dikirim -->
          <div class="relative pl-12">
            <div class="absolute left-0 top-1 w-6 h-6 bg-blue-100 rounded-full border-4 border-white flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            </div>
            <p class="text-sm font-bold text-slate-800 leading-none">Aduan Dikirim</p>
            <p class="text-[10px] text-slate-400 mt-1.5 font-bold">{{ formatDate(item.createdAt) }}</p>
            <p class="text-[11px] mt-2 text-slate-500 font-medium italic">Aduan Anda telah berhasil dikirim ke sistem TekkomCare.</p>
          </div>
          
          <!-- Event 2: Status Saat Ini -->
          <div v-if="item.status !== 'Pending'" class="relative pl-12">
            <div class="absolute left-0 top-1 w-6 h-6 bg-[#123565] rounded-full border-4 border-white flex items-center justify-center">
              <Icon name="ph:gear-bold" class="text-white text-[10px]" />
            </div>
            <p class="text-sm font-bold text-slate-800 leading-none">Aduan {{ item.status }}</p>
            <p class="text-[10px] text-slate-400 mt-1.5 font-bold">Terakhir diupdate</p>
            <p class="text-[11px] mt-2 text-slate-500 font-medium italic">Status aduan Anda telah diperbarui menjadi {{ item.status }}.</p>
          </div>
        </div>

        <!-- Tanggapan Admin (Muncul jika ada) -->
        <div v-if="item.status === 'Selesai' || item.status === 'Diproses'" class="mt-12 bg-green-50 border border-green-100 p-8 rounded-3xl flex gap-5">
          <Icon name="ph:chat-teardrop-dots-bold" class="text-green-500 text-3xl" />
          <div>
            <p class="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1.5">Tanggapan Admin</p>
            <p class="text-sm font-bold text-slate-700 leading-relaxed">
              {{ item.status === 'Diproses' ? 'Teknisi sedang dalam proses perbaikan, estimasi selesai 3 hari kerja.' : 'Masalah telah diselesaikan oleh tim teknis. Terima kasih atas laporannya.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="p-20 text-center font-bold text-slate-400 animate-pulse">
    Memuat Detail Aduan...
  </div>
</template>

<script setup>
const route = useRoute()

// Ambil data dari API
const { data: item } = await useFetch(`/api/complaints/${route.params.id}`)

// Fungsi Warna Status
const statusStyle = (status) => {
  if (status === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-200'
  if (status === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-200'
  if (status === 'Selesai') return 'bg-green-50 text-green-600 border-green-200'
  return 'bg-slate-50 text-slate-600'
}

// Fungsi Format Tanggal
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>