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
</style>