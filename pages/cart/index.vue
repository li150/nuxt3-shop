<script setup>
import { createToast, withProps } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'
import Notification from '@/components/Notification.vue'
const carts = ref([])
const total = ref(0)
const loading = ref(true)
const cartsStore = useCartsStore()
const showModal = ref(false)
const removeId = ref('')

// -------------------FUNCTION--------------------
const sumTotal = () => {
	total.value = carts.value.reduce((n, { total }) => n + total, 0)
}

const changeQty = (id, type) => {
	const findCart = carts.value.find((e) => e.product_id === id)
	if (findCart) {
		if (type === 'min') {
			findCart.qty > 1 ? (findCart.qty -= 1) : null
		} else {
			findCart.qty <= 99 ? (findCart.qty += 1) : null
		}
		findCart.total = findCart.qty * findCart.price
		sumTotal()
	}
}

const fetchAllCart = async () => {
	await useFetch('/api/cart', {
		onResponse({ response }) {
			if (response.status === 200) {
				loading.value = false
				carts.value = response._data.data
				sumTotal()
			}
		},
	})
}

const removeItem = async () => {
	await useFetch(`/api/cart?_id=${removeId.value}`, {
		method: 'DELETE',
		async onResponse({ response }) {
			if (response.status === 200) {
				createToast(withProps(Notification, { message: response._data.message }), {
					toastBackgroundColor: '#279C57',
					type: 'success',
					showCloseButton: false,
					timeout: 2000,
					showIcon: true,
					transition: 'zoom',
				})
				await fetchAllCart()
				await cartsStore.countAllCart()
				showModal.value = false
			}
		},
	})
}

const updateCarts = async () => {
	const cart_copy = [...carts.value]
	for (let i = 0; i < cart_copy.length; i++) {
		await fetch('/api/cart', {
			method: 'PUT',
			body: JSON.stringify(cart_copy[i]),
		}).then((res) =>
			res.json().then((data) => {
				// console.log(data.message)
			})
		)
	}
}

const openModal = (_id) => {
	showModal.value = true
	removeId.value = _id
}

onBeforeMount(async () => {
	await fetchAllCart()
})
</script>

<template>
	<Head>
		<title>Shoppers - Cart</title>
	</Head>
	<div>
		<header id="header">
			<Navbar />
			<hr />
			<NavbarMenu />
			<CurrentPage :product_name="''" />
		</header>

		<main>
			<!-- <div>{{carts}}</div> -->
			<div class="w-[60%] mx-auto py-20">
				<div>
					<Modal v-if="showModal" @close="showModal = false">
						<template #header>
							<h3 class="text-center">Confirm Remove Item</h3>
						</template>
						<template #body>
							<div class="flex items-center justify-center">
								<Icon
									name="material-symbols:question-mark-rounded"
									size="100"
									class="border-2 border-primary rounded-full p-5 text-primary"
								/>
							</div>
							<h3 class="text-center mt-7 font-normal">Are you sure want to delete this item ?</h3>
						</template>
						<template #footer>
							<div class="flex justify-end gap-3">
								<button class="bg-primary px-4 py-1 text-white rounded-md" @click="removeItem">Yes</button>
								<button class="bg-red-500 px-4 py-1 text-white rounded-md" @click="showModal = false">Cancel</button>
							</div>
						</template>
					</Modal>
				</div>
				<div v-if="loading" class="flex justify-center items-center py-[10rem]">
					<Loading />
				</div>
				<div v-else>
					<div v-if="carts.length !== 0">
						<table class="table-fixed border-collapse border border-slate-500 w-full">
							<thead>
								<tr>
									<th class="border border-slate-300 font-semibold text-md px-2 py-7">Image</th>
									<th class="border border-slate-300 font-semibold text-md px-2 py-7">Product</th>
									<th class="border border-slate-300 font-semibold text-md px-2 py-7">Price</th>
									<th class="border border-slate-300 font-semibold text-md px-2 py-7">Quantity</th>
									<th class="border border-slate-300 font-semibold text-md px-2 py-7">Total</th>
									<th class="border border-slate-300 font-semibold text-md px-2 py-7">Remove</th>
								</tr>
							</thead>
							<tbody class="text-center">
								<tr v-for="cart in carts" :key="cart.id">
									<td class="border border-slate-300 font-light p-3">
										<img :src="`/images/${cart.product.image}`" />
									</td>
									<td class="border border-slate-300 font-medium text-lg">
										{{ cart.product.name }} <span class="capitalize text-sm">({{ cart.size }})</span>
									</td>
									<td class="border border-slate-300 font-light tracking-wider">${{ cart.price }}</td>
									<td class="border border-slate-300 font-light">
										<div class="flex justify-center">
											<button
												class="flex items-center justify-center text-3xl px-3 py-1 border-primary border-[1.5px] font-light rounded-l-md hover:bg-secondary transition-all duration-150 hover:shadow-xl hover:text-white"
												@click="changeQty(cart.product_id, 'min')"
											>
												-
											</button>
											<input
												v-model="cart.qty"
												type="number"
												class="w-14 text-center font-light text-md border-[#a8a2f3] border-l-0 border-r-0 border-[0.1px] focus:outline-none focus:border-primary"
											/>
											<button
												class="flex items-center justify-center text-2xl px-3 py-1 border-primary border-[1.5px] font-light rounded-r-md hover:bg-secondary transition-all duration-150 hover:shadow-xl hover:text-white"
												@click="changeQty(cart.product_id, 'plus')"
											>
												+
											</button>
										</div>
									</td>
									<td class="border border-slate-300 font-light tracking-wider">${{ cart.total }}</td>
									<td class="border border-slate-300 font-light">
										<button
											class="w-[30%] uppercase tracking-wider text-white bg-primary hover:bg-secondary transition-all duration-150 hover:shadow-2xl text-sm font-light py-3 rounded-md hover:-translate-y-1"
											@click="openModal(cart._id)"
										>
											X
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div v-else>
						<div class="flex flex-col justify-center items-center py-10">
							<img src="/images/no-data.png" width="130" />
							<p class="mt-10 text-2xl">There's nothing in the cart</p>
							<button
								class="px-4 mt-10 uppercase tracking-wider text-white bg-primary hover:text-white hover:bg-secondary transition-all duration-150 hover:shadow-2xl hover:-translate-y-0.5 text-sm font-light py-3 rounded-md"
								@click="$router.push('/shop')"
							>
								Go to Shop
							</button>
						</div>
					</div>
				</div>

				<div v-if="carts.length !== 0" class="flex justify-between mt-14">
					<div class="w-[50%]">
						<div class="flex w-full gap-12">
							<button
								class="w-full uppercase tracking-wider text-white bg-primary hover:bg-secondary transition-all duration-150 hover:shadow-2xl hover:-translate-y-0.5 text-sm font-light py-3 rounded-md"
								@click="updateCarts()"
							>
								Update Cart
							</button>
							<button
								class="w-full uppercase tracking-wider text-primary bg-white border border-primary hover:text-white hover:bg-secondary transition-all duration-150 hover:shadow-2xl hover:-translate-y-0.5 text-sm font-light py-3 rounded-md"
								@click="$router.push('/shop')"
							>
								Continue Shopping
							</button>
						</div>
						<div class="flex flex-col gap-4 mt-10">
							<h4 class="text-xl">Coupon</h4>
							<p class="text-sm font-light">Enter your coupon code if you have one.</p>
							<div class="flex w-full gap-5">
								<input
									type="text"
									class="w-full px-2 border-[0.5px] border-primary focus:outline-none rounded-md font-light"
									placeholder="Coupon Code"
								/>
								<button
									class="w-[40%] uppercase tracking-wider text-white bg-primary hover:bg-secondary transition-all duration-150 hover:shadow-2xl hover:-translate-y-0.5 text-sm font-light py-3 rounded-md"
								>
									Apply Coupon
								</button>
							</div>
						</div>
					</div>
					<div class="w-[30%]">
						<h3 class="tracking-wider text-xl font-normal uppercase text-right">Cart Totals</h3>
						<hr class="mt-3" />
						<div class="mt-5 font-light text-md">
							<div class="flex justify-between">
								<span>Subtotal</span>
								<span class="font-semibold tracking-wider">${{ total }}</span>
							</div>
							<div class="flex justify-between mt-4">
								<span>Total</span>
								<span class="font-semibold tracking-wider">${{ total }}</span>
							</div>
						</div>
						<div class="w-full mt-10">
							<button
								class="w-full uppercase tracking-wider text-white bg-primary hover:bg-secondary transition-all duration-150 hover:shadow-2xl hover:-translate-y-0.5 text-md font-light py-5 rounded-md"
							>
								Proceed To Checkout
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
		<hr />
		<footer>
			<Footer />
		</footer>
	</div>
</template>
