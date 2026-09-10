<template>
	<div aria-label="Lin Client" class="flex h-full items-center gap-2 font-extrabold text-contrast">
		<img aria-hidden="true" class="aspect-square h-full object-contain" :src="linClientVisual" />
		<span v-if="!iconOnly" class="hidden text-sm tracking-wide xl:inline">Lin Client</span>
	</div>
</template>

<script setup lang="ts">
import linClientVisual from '@/assets/lin-client.png'

defineProps<{
	iconOnly?: boolean
}>()
</script>
