<template>
  <div v-if="item" class="max-w-4xl mx-auto space-y-6 text-slate-700">
    
    <!-- TOMBOL KEMBALI -->
    <button 
      @click="navigateTo('/aduan-saya')" 
      class="inline-flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-[#123565] transition group"
    >
      <Icon name="ph:arrow-left-bold" class="group-hover:-translate-x-1 transition-transform" /> 
      Kembali ke Daftar Aduan
    </button>

    <!-- CARD DETAIL UTAMA -->
    <div class="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
      <div class="p-10 border-b border-slate-100">
        
        <!-- HEADER DETAIL -->
        <div class="flex justify-between items-start mb-8">
          <div>
            <h1 class="text-2xl font-bold text-slate-800 mb-3">{{ item.judul }}</h1>
            <div class="flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span class="flex items-center gap-1">
                <Icon name="ph:map-pin-bold" class="text-red-400"/> {{ item.lokasi }}
              </span>
              <span class="flex items-center gap-1">
                <Icon name="ph:calendar-bold" /> {{ formatDate(item.createdAt) }}
              </span>
              <span class="flex items-center gap-1">
                <Icon name="ph:bank-bold" /> {{ item.kategori }}
              </span>
            </div>
          </div>
          <div :class="statusStyle(item.status)" class="px-5 py-2 rounded-full text-[10px] font-black border flex items-center gap-2 uppercase tracking-widest">
            <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
            {{ item.status }}
          </div>
        </div>

        <!-- BOX DESKRIPSI -->
        <div class="bg-slate-50 p-8 rounded-3xl mb-10 border border-slate-100">
          <p class="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em]">Deskripsi Aduan Anda</p>
          <p class="text-sm font-medium leading-relaxed text-slate-600">
            {{ item.deskripsi }}
          </p>
        </div>

        <!-- BAGIAN FOTO LAMPIRAN (DISAMAKAN DENGAN ADMIN - MAX 320PX) -->
        <div v-if="item.gambar" class="mb-12 border-t pt-8">
          <p class="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em]">Foto Lampiran Anda</p>
          
          <!-- max-w-xs membuat ukuran gambar maksimal 320px (Normal) -->
          <a :href="`/uploads/${item.gambar}`" target="_blank" class="block max-w-xs group relative">
            <img 
              :src="`/uploads/${item.gambar}`" 
              class="w-full h-48 object-cover rounded-[24px] border-4 border-white shadow-lg transition-all duration-300 group-hover:brightness-75" 
              alt="Bukti Aduan"
            />
            
            <!-- Overlay Perbesar saat Hover -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div class="bg-white/90 px-3 py-2 rounded-xl shadow-xl flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                 <Icon name="ph:magnifying-glass-plus-bold" class="text-[#123565]" />
                 <span class="text-[9px] font-black text-[#123565] uppercase">Perbesar</span>
               </div>
            </div>
          </a>
          <p class="text-[10px] text-slate-400 mt-3 italic">* Klik gambar untuk ukuran penuh</p>
        </div>

        <!-- RIWAYAT & TIMELINE -->
        <h3 class="font-black text-slate-800 mb-8 uppercase text-xs tracking-widest">Riwayat & Tanggapan</h3>
        <div class="space-y-10 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          <div class="relative pl-12">
            <div class="absolute left-0 top-1 w-6 h-6 bg-blue-100 rounded-full border-4 border-white flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            </div>
            <p class="text-sm font-bold text-slate-800 leading-none">Aduan Dikirim</p>
            <p class="text-[10px] text-slate-400 mt-1.5 font-bold uppercase">{{ formatDate(item.createdAt) }}</p>
            <p class="text-[11px] mt-2 text-slate-500 font-medium italic">Aduan Anda telah berhasil dikirim ke sistem TekkomCare.</p>
          </div>
          
          <div v-if="item.status !== 'Pending'" class="relative pl-12">
            <div class="absolute left-0 top-1 w-6 h-6 bg-[#123565] rounded-full border-4 border-white flex items-center justify-center">
              <Icon name="ph:check-circle-bold" class="text-white text-[10px]" />
            </div>
            <p class="text-sm font-bold text-slate-800 leading-none">Aduan {{ item.status }}</p>
            <p class="text-[10px] text-slate-400 mt-1.5 font-bold uppercase">Update Terbaru</p>
            <p class="text-[11px] mt-2 text-slate-500 font-medium italic">Status aduan Anda telah diperbarui menjadi {{ item.status }}.</p>
          </div>
        </div>

        <!-- TANGGAPAN ADMIN -->
        <div v-if="item.tanggapanAdmin" class="mt-12 bg-green-50 border border-green-100 p-8 rounded-[32px] flex gap-5 shadow-sm">
          <Icon name="ph:chat-teardrop-dots-bold" class="text-green-500 text-3xl flex-shrink-0" />
          <div>
            <p class="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1.5">Tanggapan Admin</p>
            <p class="text-sm font-bold text-slate-700 leading-relaxed italic">
              "{{ item.tanggapanAdmin }}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- LOADING STATE -->
  <div v-else class="flex flex-col items-center justify-center py-40 text-slate-300">
    <Icon name="ph:circle-notch-bold" size="48" class="animate-spin mb-4" />
    <p class="font-bold uppercase tracking-widest text-xs">Memuat Detail Aduan...</p>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: item } = await useFetch(`/api/complaints/${route.params.id}`)

const statusStyle = (status) => {
  if (status === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-200'
  if (status === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-200'
  if (status === 'Selesai') return 'bg-green-50 text-green-600 border-green-200'
  return 'bg-red-50 text-red-600 border-red-200'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>