<template>
  <div class="text-center">
    <div class="flex justify-center mb-4">
      <div class="bg-[#123565] p-2 rounded-lg"><Icon name="ph:plus-bold" class="text-white text-xl"/></div>
      <span class="ml-3 font-bold text-xl text-[#123565] self-center">TekkomCare</span>
    </div>
    <h2 class="text-2xl font-bold text-[#123565] mb-1">Daftar Akun</h2>
    <p class="text-[11px] text-slate-400 font-medium mb-8">Buat akun TekkomCare baru</p>

    <!-- Pastikan ada @submit.prevent disini -->
    <form @submit.prevent="handleRegister" class="space-y-4 text-left">
      <div class="grid grid-cols-2 gap-4">
        <input v-model="form.nama" type="text" placeholder="Nama Lengkap" class="input-field" required />
        <input v-model="form.nim" type="text" placeholder="NIM" class="input-field" required />
      </div>
      <input v-model="form.email" type="email" placeholder="Email" class="input-field" required />
      <div class="grid grid-cols-2 gap-4">
        <input v-model="form.password" type="password" placeholder="Password" class="input-field" required />
        <input v-model="form.konfirmasi" type="password" placeholder="Konfirmasi" class="input-field" required />
      </div>
      
      <!-- Tombol ini akan disabled jika loading bernilai true -->
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl mt-4 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Menghubungkan Database...</span>
        <span v-else>Daftar</span>
      </button>
    </form>

    <p class="mt-8 text-xs font-bold text-slate-400">
      Sudah punya akun? <NuxtLink to="/login" class="text-blue-600">Masuk</NuxtLink>
    </p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'auth' })

// Pastikan inisialisasi awal form dan loading benar
const form = ref({ 
  nama: '', 
  nim: '', 
  email: '', 
  password: '', 
  konfirmasi: '' 
})

const loading = ref(false) // Harus FALSE di awal

async function handleRegister() {
  console.log("Tombol diklik, mencoba mendaftar...");
  
  if (form.value.password !== form.value.konfirmasi) {
    alert("Kata sandi tidak cocok!")
    return
  }

  loading.value = true // Tombol jadi disabled saat diproses

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: form.value
    })
    
    console.log("Hasil server:", response);
    alert("Berhasil mendaftar!");
    navigateTo('/')
  } catch (err) {
    console.error("Error pendaftaran:", err);
    // Tampilkan pesan error spesifik dari server
    alert("Gagal Daftar: " + (err.data?.message || "Terjadi kesalahan koneksi"));
  } finally {
    loading.value = false // Kembalikan tombol agar bisa diklik lagi jika gagal
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all;
}
</style>