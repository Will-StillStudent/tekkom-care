<template>
  <div class="text-center">
    <!-- Header Logo (Sesuai Gambar 2) -->
    <div class="flex justify-center mb-4">
      <div class="bg-[#123565] p-2 rounded-lg">
        <Icon name="ph:plus-bold" class="text-white text-xl" />
      </div>
      <span class="ml-3 font-bold text-xl text-[#123565] self-center">TekkomCare</span>
    </div>
    <h2 class="text-2xl font-bold text-[#123565] mb-1">Masuk ke Akun</h2>
    <p class="text-[11px] text-slate-400 font-medium mb-8 uppercase tracking-widest">
      Sistem Aduan Fasilitas · Teknik Komputer UNDIP
    </p>

    <!-- FORM LOGIN -->
    <form @submit.prevent="handleLogin" class="space-y-5 text-left">
      <!-- Input Email -->
      <div>
        <label class="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
          Email
        </label>
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="user@students.undip.ac.id" 
          class="input-field" 
          required 
        />
      </div>

      <!-- Input Password -->
      <div>
        <label class="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
          Kata Sandi
        </label>
        <input 
          v-model="form.password" 
          type="password" 
          placeholder="••••••••" 
          class="input-field" 
          required 
        />
      </div>

      <!-- Tombol Masuk -->
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/30 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Memproses...</span>
        <span v-else>Masuk</span>
      </button>
    </form>

    <!-- Link ke Register (Sesuai Gambar 2) -->
    <p class="mt-8 text-xs font-bold text-slate-400">
      Belum punya akun? 
      <NuxtLink to="/register" class="text-blue-600 hover:underline">Daftar sekarang</NuxtLink>
    </p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'auth' })

const form = ref({ email: '', password: '' })
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    // Ambil data respon dari API
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })

    // LOGIKA PENGARAHAN (REDIRECTION)
    if (response.role === 'admin') {
      // Jika admin, paksa ke dashboard admin
      window.location.href = '/admin'
    } else {
      // Jika user biasa, paksa ke beranda
      window.location.href = '/'
    }
    
  } catch (err) {
    alert(err.data?.message || "Login Gagal")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Class Tailwind untuk input agar seragam dengan desain */
.input-field {
  @apply w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all;
}
</style>