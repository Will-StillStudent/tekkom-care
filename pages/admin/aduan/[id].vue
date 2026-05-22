<template>
  <div v-if="item" class="max-w-6xl mx-auto space-y-6 text-slate-700">
    
    <!-- TOMBOL KEMBALI -->
    <button 
      @click="navigateTo('/admin/kelola')" 
      class="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-[#123565] transition group"
    >
      <Icon name="ph:arrow-left-bold" class="group-hover:-translate-x-1 transition-transform" /> 
      Kembali ke Daftar Kelola
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <!-- KOLOM KIRI: DETAIL ISI ADUAN -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
          <div class="flex justify-between items-start mb-8">
            <div>
              <h1 class="text-3xl font-bold text-[#123565] mb-2">{{ item.judul }}</h1>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
                ID Aduan: #{{ item.id }} • {{ formatDate(item.createdAt) }}
              </p>
            </div>
            <div :class="statusBadgeStyle(item.status)" class="px-5 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest">
              {{ item.status }}
            </div>
          </div>
          
          <div class="flex gap-6 text-xs font-bold text-slate-500 mb-10 border-y py-6 border-slate-50">
            <span class="flex items-center gap-2">
              <Icon name="ph:map-pin-bold" class="text-red-400 text-lg"/> LOKASI: {{ item.lokasi }}
            </span>
            <span class="flex items-center gap-2">
              <Icon name="ph:bank-bold" class="text-blue-500 text-lg"/> KATEGORI: {{ item.kategori }}
            </span>
          </div>

          <!-- BOX DESKRIPSI -->
          <div class="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8">
            <p class="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em]">Deskripsi Aduan Pelapor</p>
            <p class="text-sm font-medium leading-relaxed text-slate-600">
              {{ item.deskripsi }}
            </p>
          </div>

          <!-- BAGIAN FOTO LAMPIRAN (DIKECILKAN AGAR NORMAL) -->
          <div v-if="item.gambar" class="mt-10 border-t pt-8">
            <p class="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em]">Foto Bukti Lampiran</p>
            
            <!-- max-w-xs (320px) membuat ukuran gambar jadi normal/kecil -->
            <a :href="`/uploads/${item.gambar}`" target="_blank" class="block max-w-xs group relative">
              <img 
                :src="`/uploads/${item.gambar}`" 
                class="w-full h-48 object-cover rounded-[24px] border-4 border-white shadow-lg transition-all duration-300 group-hover:brightness-75" 
                alt="Foto Bukti"
              />
              <!-- Overlay Perbesar -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="bg-white/90 p-2 rounded-xl shadow-xl flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                  <Icon name="ph:magnifying-glass-plus-bold" class="text-[#123565]" />
                  <span class="text-[9px] font-black text-[#123565] uppercase">Perbesar</span>
                </div>
              </div>
            </a>
            <p class="text-[10px] text-slate-400 mt-3 italic">* Klik gambar untuk ukuran penuh</p>
          </div>

          <div v-else class="mt-10 p-10 border-2 border-dashed border-slate-50 rounded-[32px] text-center text-slate-300">
             <p class="text-xs font-bold uppercase tracking-widest">Tidak ada lampiran foto</p>
          </div>
        </div>
      </div>

      <!-- KOLOM KANAN: PANEL ADMIN -->
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 class="font-black text-xs uppercase text-slate-400 tracking-widest mb-6 border-b pb-4 text-center">Ubah Status</h3>
          <div class="grid grid-cols-2 gap-3">
            <button @click="tempStatus = 'Pending'" :class="tempStatus === 'Pending' ? 'status-active ring-yellow-200' : 'opacity-40'" class="status-btn bg-yellow-500 text-white">Pending</button>
            <button @click="tempStatus = 'Diproses'" :class="tempStatus === 'Diproses' ? 'status-active ring-blue-200' : 'opacity-40'" class="status-btn bg-blue-600 text-white">Diproses</button>
            <button @click="tempStatus = 'Selesai'" :class="tempStatus === 'Selesai' ? 'status-active ring-green-200' : 'opacity-40'" class="status-btn bg-green-600 text-white">Selesai</button>
            <button @click="tempStatus = 'Ditolak'" :class="tempStatus === 'Ditolak' ? 'status-active ring-red-200' : 'opacity-40'" class="status-btn bg-red-600 text-white">Ditolak</button>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 class="font-black text-xs uppercase text-slate-400 tracking-widest mb-6 border-b pb-4">Tanggapan Admin</h3>
          <textarea 
            v-model="tempTanggapan"
            placeholder="Tulis balasan..." 
            class="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-sm font-medium h-44 outline-none focus:border-blue-500 transition-all resize-none"
          ></textarea>
          
          <button @click="handleUpdate" :disabled="isUpdating" class="w-full bg-[#123565] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-6 shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all disabled:opacity-50">
            {{ isUpdating ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Middleware untuk proteksi admin
definePageMeta({
  middleware: 'admin'
})

const route = useRoute()
const isUpdating = ref(false)
const { data: item, refresh } = await useFetch(`/api/complaints/${route.params.id}`)

const tempStatus = ref('')
const tempTanggapan = ref('')

watchEffect(() => {
  if (item.value) {
    tempStatus.value = item.value.status
    tempTanggapan.value = item.value.tanggapanAdmin || ''
  }
})

async function handleUpdate() {
  isUpdating.value = true
  try {
    await $fetch('/api/admin/update-aduan', {
      method: 'POST',
      body: { id: route.params.id, status: tempStatus.value, tanggapanAdmin: tempTanggapan.value }
    })
    alert("Aduan diperbarui!")
    refresh()
  } catch (err) {
    alert("Gagal")
  } finally { isUpdating.value = false }
}

const statusBadgeStyle = (s) => {
  if (s === 'Pending') return 'bg-yellow-50 text-yellow-600 border-yellow-200'
  if (s === 'Diproses') return 'bg-blue-50 text-blue-600 border-blue-200'
  if (s === 'Selesai') return 'bg-green-50 text-green-600 border-green-200'
  return 'bg-red-50 text-red-600 border-red-200'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.status-btn { @apply py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300; }
.status-active { @apply ring-4 opacity-100 shadow-lg scale-105; }
</style>