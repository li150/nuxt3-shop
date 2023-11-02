<script setup>
const props = defineProps(['message'])
const message = computed(() => props.message)
</script>

<template>
	<div class="">
		<p class="text-white mt-1">
			{{ message }}
		</p>
	</div>
</template>
