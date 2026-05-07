<template>
  <div v-if="item" class="grid grid-cols-3 gap-10">
    <!-- Kolom Kiri: Detail Aduan (Gambar 9) -->
    <div class="col-span-2 space-y-6">
      <button @click="navigateTo('/admin/kelola')" class="text-sm font-bold text-slate-400 flex items-center gap-2 mb-4"><Icon name="ph:arrow-left-bold" /> Kembali</button>
      <div class="bg-white p-10 rounded-[32px] border shadow-sm">
        <h1 class="text-2xl font-bold text-[#123565] mb-4">{{ item.judul }}</h1>
        <p class="text-xs font-bold text-slate-400 mb-8">{{ item.lokasi }} · {{ item.kategori }}</p>
        <div class="bg-slate-50 p-6 rounded-2xl">
          <p class="text-[10px] font-black uppercase text-slate-400 mb-2">Deskripsi</p>
          <p class="text-sm font-medium">{{ item.deskripsi }}</p>
        </div>
      </div>
    </div>

    <!-- Kolom Kanan: Ubah Status (Gambar 9) -->
    <div class="space-y-6">
      <div class="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
        <h3 class="font-black text-xs uppercase text-slate-400 tracking-widest border-b pb-4">Ubah Status</h3>
        <div class="grid grid-cols-2 gap-3">
          <button @click="updateStatus('Pending')" class="status-btn bg-yellow-500 text-white">Pending</button>
          <button @click="updateStatus('Diproses')" class="status-btn bg-blue-600 text-white">Diproses</button>
          <button @click="updateStatus('Selesai')" class="status-btn bg-green-600 text-white">Selesai</button>
          <button @click="updateStatus('Ditolak')" class="status-btn bg-red-600 text-white">Ditolak</button>
        </div>
      </div>

      <div class="bg-white p-8 rounded-[32px] border shadow-sm">
        <h3 class="font-black text-xs uppercase text-slate-400 tracking-widest border-b pb-4 mb-6">Tanggapan Admin</h3>
        <textarea placeholder="Tulis tanggapan teknis..." class="w-full bg-slate-50 border p-4 rounded-2xl text-sm h-32 outline-none mb-4"></textarea>
        <button class="w-full bg-[#123565] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20">Simpan Tanggapan</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: item, refresh } = await useFetch(`/api/complaints/${route.params.id}`)

async function updateStatus(newStatus) {
  try {
    await $fetch('/api/admin/update-status', {
      method: 'POST',
      body: { id: route.params.id, status: newStatus }
    })
    alert("Status berhasil diubah menjadi " + newStatus)
    refresh()
  } catch (e) { alert("Gagal update status") }
}
</script>

<style scoped>
.status-btn { @apply py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition hover:scale-105; }
</style>