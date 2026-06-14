<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout name="mobile">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Transisi untuk Custom Dropdown */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

button, input, a, label {
  -webkit-tap-highlight-color: transparent;
}
</style>