<template>
  <div class="max-w-4xl mx-auto">
    <!-- Card Putih -->
    <div class="bg-white rounded-[32px] border border-slate-200 p-12 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        
        <!-- Judul -->
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-widest">Judul Aduan *</label>
          <input 
            v-model="form.judul" 
            type="text" 
            placeholder="Judul aduan Anda" 
            class="input-field" 
            required 
          />
        </div>

        <!-- Kategori & Lokasi -->
        <div class="grid grid-cols-2 gap-8">
          <div>
            <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-widest">Kategori *</label>
            <select v-model="form.kategori" class="input-field cursor-pointer">
              <option>🏛️ Fasilitas</option>
              <option>👥 SDM</option>
              <option>🌿 Lingkungan</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-widest">Lokasi *</label>
            <input 
              v-model="form.lokasi" 
              type="text" 
              placeholder="Contoh: Ruang B201" 
              class="input-field" 
              required 
            />
          </div>
        </div>

        <!-- Deskripsi -->
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-widest">Deskripsi * (min. 20 karakter)</label>
          <textarea 
            v-model="form.deskripsi" 
            rows="6" 
            placeholder="Jelaskan detail keluhan..." 
            class="input-field resize-none" 
            required
          ></textarea>
          <p class="text-[10px] mt-2 font-bold" :class="form.deskripsi.length >= 20 ? 'text-green-600' : 'text-red-400'">
            {{ form.deskripsi.length }} / 20 karakter minimum
          </p>
        </div>

        <!-- Lampiran -->
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-widest">Lampiran Foto (Opsional)</label>
          <div class="border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-slate-400">
            <Icon name="ph:upload-simple-bold" size="32" class="mb-2" />
            <p class="text-xs font-bold">Klik atau seret file ke sini</p>
          </div>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex justify-end gap-4 pt-8 border-t border-slate-100">
          <button 
            type="button" 
            @click="navigateTo('/')" 
            class="px-10 py-3.5 rounded-2xl text-sm font-black text-slate-400 hover:bg-slate-50 uppercase tracking-widest"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="loading || form.deskripsi.length < 20"
            class="px-10 py-3.5 rounded-2xl text-sm font-black bg-[#123565] text-white hover:bg-blue-900 shadow-xl shadow-blue-900/20 transition uppercase tracking-widest disabled:opacity-50"
          >
            <span v-if="loading">Mengirim...</span>
            <span v-else>Kirim Aduan</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const form = ref({ 
  judul: '', 
  kategori: '🏛️ Fasilitas', 
  lokasi: '', 
  deskripsi: '' 
})

const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    // Memanggil API yang menggunakan db manual
    await $fetch('/api/complaints/create', { 
      method: 'POST', 
      body: form.value 
    })
    
    alert("Berhasil! Aduan Anda telah terkirim.")
    navigateTo('/aduan-saya')
  } catch (e) {
    console.error(e)
    alert("Gagal kirim: " + (e.data?.message || "Terjadi kesalahan koneksi"))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-blue-500 transition-all;
}
</style>