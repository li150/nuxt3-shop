<script setup>
const router = useRouter()
const props = defineProps(['type', 'productName'])

const page = computed(() => router.currentRoute)
const type = computed(() => props.type)
const product_name = computed(() => props.productName)
</script>

<template>
	<div class="bg-[#f8f9fa] py-5">
		<div class="w-[60%] mx-auto">
			<div class="flex gap-3 font-light text-sm">
				<NuxtLink to="/" class="text-primary"> Home </NuxtLink>
				<span> / </span>
				<span class="capitalize">{{ type == 'detail_product' ? product_name : page.name }}</span>
			</div>
		</div>
	</div>
</template>
