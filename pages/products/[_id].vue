<script setup>
import mongoose from 'mongoose'
import { createToast, withProps } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'
import Notification from '@/components/Notification.vue'

const route = useRoute()

// const router = useRouter()
const carts = useCartsStore()

const _id = route.params._id
const product = reactive({
	name: '',
	short_desc: '',
	long_desc: '',
	image: '',
	size: [],
	category: '',
	price: 0,
})

const buy_product = reactive({
	product_id: mongoose.Types.ObjectId(_id),
	qty: 1,
	size: 'medium',
	price: 0,
	total: 0,
})

const loading = ref(true)

// -------------------FUNCTION--------------------
const changeQty = (type) => {
	if (type === 'min') {
		buy_product.qty > 1 ? (buy_product.qty -= 1) : null
	} else {
		buy_product.qty += 1
	}
	buy_product.total = buy_product.qty * buy_product.price
}

const fetchProduct = async () => {
	await useFetch(`/api/products?_id=${_id}`, {
		onResponse({ response }) {
			product.name = response._data.data.name
			product.image = response._data.data.image
			product.size = response._data.data.size
			product.short_desc = response._data.data.short_desc
			product.long_desc = response._data.data.long_desc
			product.category = response._data.data.category
			product.price = response._data.data.price
			buy_product.price = response._data.data.price
			buy_product.total = response._data.data.price
			loading.value = false
		},
	})
}

const addToCart = async () => {
	await useFetch('/api/cart', {
		method: 'POST',
		body: buy_product,
		async onResponse({ response }) {
			if (response.status === 200) {
				// router.push("/cart");
				createToast(withProps(Notification, { message: response._data.message }), {
					toastBackgroundColor: '#279C57',
					type: 'success',
					showCloseButton: false,
					timeout: 2000,
					showIcon: true,
					transition: 'zoom',
				})
				await carts.countAllCart()
			}
		},
	})
}

onBeforeMount(async () => {
	await fetchProduct()
})
</script>

<template>
	<div>
		<header id="header">
			<Navbar />
			<hr />
			<NavbarMenu />
			<CurrentPage v-if="JSON.stringify(product) !== {}" :type="'detail_product'" :product_name="product.name" />
		</header>

		<main>
			<div class="w-[60%] mx-auto py-20">
				<div v-if="!loading" class="flex gap-10">
					<div class="w-1/2">
						<img v-if="product.image !== ''" :src="`/images/${product.image}`" />
					</div>
					<div class="w-1/2">
						<h2 class="text-3xl font-normal">
							{{ product.name }}
						</h2>
						<p class="text-sm leading-loose font-light text-gray-500 mt-5 text-justify">
							{{ product.long_desc }}
						</p>
						<p class="mt-4 text-2xl font-normal tracking-wider text-primary">${{ product.price }}</p>
						<div class="flex gap-3 mt-4">
							<div v-for="s in product.size" :key="s" class="capitalize">
								<input v-model="buy_product.size" type="radio" name="size" :value="s" />
								<span class="font-light text-md">
									{{ s.split('_').join(' ') }}
								</span>
							</div>
						</div>
						<div class="flex mt-4">
							<button
								class="flex items-center justify-center text-3xl px-3 py-1 border-primary border-[1.5px] font-light rounded-l-md hover:bg-secondary transition-all duration-150 hover:shadow-xl hover:text-white"
								@click="changeQty('min')"
							>
								-
							</button>
							<input
								v-model="buy_product.qty"
								type="number"
								class="w-14 text-center font-light text-md border-[#a8a2f3] border-l-0 border-r-0 border-[0.1px] focus:outline-none focus:border-primary"
							/>
							<button
								class="flex items-center justify-center text-2xl px-3 py-1 border-primary border-[1.5px] font-light rounded-r-md hover:bg-secondary transition-all duration-150 hover:shadow-xl hover:text-white"
								@click="changeQty('plus')"
							>
								+
							</button>
						</div>
						<div class="mt-10">
							<button
								class="w-[30%] uppercase tracking-wider text-white bg-primary hover:bg-secondary transition-all duration-150 hover:shadow-2xl text-sm font-light py-3 rounded-sm"
								@click="addToCart()"
							>
								Add To Cart
							</button>
						</div>
					</div>
				</div>
				<div v-else>
					<div class="flex items-center justify-center">
						<Loading />
					</div>
				</div>
			</div>
		</main>

		<section id="carousel">
			<Carousel />
		</section>

		<footer>
			<Footer />
		</footer>
	</div>
</template>
