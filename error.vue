<template>
	<div>404</div>
</template>
<script lang="ts" setup>
throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
</script>
