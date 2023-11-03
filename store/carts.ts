export const useCartsStore = defineStore('saveCarts', () => {
	// 测试store
	const name = ref('')
	const carts = ref<any[]>([])
	const cartLength = ref(0)

	function addItem() {
		carts.value.push({})
	}
	async function countAllCart() {
		carts.value = await fetch('/api/cart').then((response) => response.json())
		cartLength.value = carts.value.length
	}

	return {
		name,
		carts,
		cartLength,
		addItem,
		countAllCart,
	}
})

export default useCartsStore
