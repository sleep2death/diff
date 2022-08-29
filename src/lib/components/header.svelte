<script>
	import Icon from '$lib/components/icon.svelte';
	let btn_size = '1.6em';
</script>

<div class="fixed w-full flex flex-col bg-gray-800 items-center bottom-0">
	<div class="w-full flex h-12 justify-between items-center px-8 max-w-lg">
		<!-- <a class="flex rounded-full h-10" href="/">
			<div
				class="bg-amber-600 pl-3 pr-2 pt-1.5 rounded-l-full text-white font-semibold inline-block align-middle"
			>
				DreamRiver
			</div>
			<div class="bg-slate-600 pr-3 pl-2 pt-2.5 rounded-r-full text-slate-400 text-sm py-0.5">
				beta
			</div>
    </a> -->
		<a sveltekit:reload href="/home">
			<Icon name="home" width={btn_size} height={btn_size} />
		</a>
		<Icon name="search" width={btn_size} height={btn_size} />
		<div class="bg-green-600 p-6 rounded-full text-white">
			<Icon name="plus-square" width="2em" height="2em" strokeWidth="1.5" />
		</div>
		<Icon name="activity" width={btn_size} height={btn_size} />
		<Icon name="user" width={btn_size} height={btn_size} />
	</div>
</div>
