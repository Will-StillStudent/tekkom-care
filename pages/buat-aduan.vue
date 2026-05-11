<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-[40px] border border-slate-200 p-12 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-10">
        
        <!-- 1. JUDUL ADUAN -->
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em]">Judul Aduan *</label>
          <input v-model="form.judul" type="text" placeholder="Contoh: Lampu Ruang Kelas B.501 Mati" class="input-field" required />
        </div>

        <!-- 2. KATEGORI & LOKASI -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em]">Kategori *</label>
            <select v-model="form.kategori" class="input-field cursor-pointer">
              <option value="🏛️ Fasilitas">🏛️ Fasilitas</option>
              <option value="👥 SDM">👥 SDM</option>
              <option value="🌿 Lingkungan">🌿 Lingkungan</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em]">Lokasi Kejadian *</label>
            <input v-model="form.lokasi" type="text" placeholder="Contoh: Gedung A Lt. 2" class="input-field" required />
          </div>
        </div>

        <!-- 3. DESKRIPSI -->
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em]">Deskripsi Aduan * (min. 20 karakter)</label>
          <textarea v-model="form.deskripsi" rows="6" placeholder="Jelaskan detail keluhan Anda..." class="input-field resize-none" required></textarea>
          <p class="text-[10px] mt-3 font-bold" :class="form.deskripsi.length >= 20 ? 'text-green-600' : 'text-red-400'">
            {{ form.deskripsi.length }} / 20 karakter minimum
          </p>
        </div>

        <!-- 4. UPLOAD GAMBAR DENGAN DRAG & DROP -->
        <div>
          <label class="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-[0.2em]">Lampiran Foto (Tarik & Lepas Foto di Sini)</label>
          
          <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="hidden" />

          <!-- KOTAK DRAG & DROP -->
          <div 
            @click="$refs.fileInput.click()"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
              isDragging ? 'border-[#123565] bg-blue-50 scale-[1.01]' : 'border-slate-200 bg-white',
              'border-2 border-dashed rounded-[32px] p-12 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-all cursor-pointer group'
            ]"
          >
            <!-- Tampilan Jika Belum Ada Gambar -->
            <template v-if="!previewUrl">
              <Icon 
                name="ph:upload-simple-bold" 
                :class="isDragging ? 'text-[#123565] scale-125' : 'text-slate-300'"
                class="text-4xl mb-4 transition-all duration-300" 
              />
              <p class="text-sm font-bold" :class="isDragging ? 'text-[#123565]' : 'text-slate-500'">
                {{ isDragging ? 'Lepaskan foto sekarang' : 'Upload gambar atau tarik foto ke sini' }}
              </p>
              <p class="text-[10px] mt-2 font-medium opacity-60 uppercase tracking-widest">PNG, JPG, ATAU WEBP (MAKS 5MB)</p>
            </template>

            <!-- Tampilan Preview Jika Gambar Sudah Ada -->
            <template v-else>
              <div class="relative group/preview">
                <img :src="previewUrl" class="max-h-48 rounded-2xl shadow-lg border-4 border-white" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                   <button type="button" @click.stop="removeFile" class="bg-white text-red-500 p-2 rounded-full shadow-xl hover:scale-110 transition-transform">
                     <Icon name="ph:trash-bold" size="20" />
                   </button>
                </div>
              </div>
              <p class="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">Gambar dipilih: {{ selectedFile?.name }}</p>
            </template>
          </div>
        </div>

        <!-- 5. TOMBOL AKSI -->
        <div class="flex justify-end gap-4 pt-8 border-t border-slate-100">
          <button type="button" @click="navigateTo('/')" class="px-10 py-3.5 rounded-2xl text-sm font-black text-slate-400 uppercase tracking-widest">Batal</button>
          <button 
            type="submit" 
            :disabled="isSubmitting || form.deskripsi.length < 20"
            class="px-10 py-3.5 rounded-2xl text-sm font-black bg-[#123565] text-white hover:bg-blue-900 shadow-xl disabled:opacity-50 flex items-center gap-2"
          >
            <Icon v-if="isSubmitting" name="ph:circle-notch-bold" class="animate-spin" />
            <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim Aduan' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const isSubmitting = ref(false)
const isDragging = ref(false) // State untuk mendeteksi saat file ditarik di atas kotak
const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref(null)

const form = ref({
  judul: '',
  kategori: '🏛️ Fasilitas',
  lokasi: '',
  deskripsi: ''
})

// Fungsi memproses file (digunakan oleh klik manual maupun drop)
function processFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    alert("Hanya file gambar yang diperbolehkan!")
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("Ukuran file maksimal 5MB!")
    return
  }
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

// Handler saat file ditarik dan dilepaskan (Drop)
function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  processFile(file)
}

// Handler saat klik manual (Browse)
function onFileChange(e) {
  const file = e.target.files[0]
  processFile(file)
}

function removeFile() {
  selectedFile.value = null
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function handleSubmit() {
  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('judul', form.value.judul)
    formData.append('kategori', form.value.kategori)
    formData.append('lokasi', form.value.lokasi)
    formData.append('deskripsi', form.value.deskripsi)
    if (selectedFile.value) formData.append('gambar', selectedFile.value)

    await $fetch('/api/complaints/create', { method: 'POST', body: formData })
    alert("Aduan berhasil dikirim!")
    navigateTo('/aduan-saya')
  } catch (err) {
    alert("Gagal mengirim aduan")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all;
}
</style>