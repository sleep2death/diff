<script>
	import Login from '$lib/components/login.svelte';
	export let data;
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<div class="flex w-full justify-center">
				<h class="text-4xl font-bold">DreamRiver</h>
				<h class="text-sm font-thin ml-1">beta</h>
			</div>
			{#if !data.isLogin}
				<Login />
			{/if}
		</div>
	</div>
</div>
