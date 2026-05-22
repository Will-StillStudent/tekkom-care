<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- Error Code -->
      <div class="text-7xl font-black text-[#123565] mb-4">
        {{ error.statusCode }}
      </div>

      <!-- Error Title -->
      <h1 class="text-3xl font-bold text-slate-800 mb-3">
        {{ getErrorTitle(error.statusCode) }}
      </h1>

      <!-- Error Message -->
      <p class="text-slate-600 mb-8 leading-relaxed">
        {{ getErrorMessage(error.statusCode) }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="navigateTo('/')"
          class="px-6 py-3 bg-[#123565] text-white font-bold rounded-xl hover:bg-blue-900 transition shadow-lg"
        >
          Kembali ke Beranda
        </button>
        <button 
          v-if="error.statusCode !== 403"
          @click="clearError()"
          class="px-6 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Footer -->
      <p class="text-slate-400 text-sm mt-12">
        TekkomCare © 2026
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const getErrorTitle = (code) => {
  switch (code) {
    case 403:
      return 'Akses Ditolak'
    case 404:
      return 'Halaman Tidak Ditemukan'
    case 500:
      return 'Kesalahan Server'
    default:
      return 'Terjadi Kesalahan'
  }
}

const getErrorMessage = (code) => {
  switch (code) {
    case 403:
      return 'Anda tidak memiliki akses ke halaman ini. Hanya admin yang dapat mengakses area admin.'
    case 404:
      return 'Halaman yang Anda cari tidak ditemukan. Silakan periksa URL atau kembali ke beranda.'
    case 500:
      return 'Terjadi kesalahan pada server. Tim kami sedang menangani masalah ini.'
    default:
      return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi dukungan.'
  }
}

const clearError = () => {
  navigateTo('/')
}
</script>
