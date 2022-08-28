<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let data;

	let img_src = '';
	let ready = false;
	let task;

	onMount(async () => {
		const task_id = $page.url.searchParams.get('task');
		if (!task_id) {
			return;
		}

		const loadTask = async () => {
			const f = await fetch('/api/task/' + task_id);
			task = await f.json();
			ready = task.status === 'Done';

			if (ready) {
				console.log('job done');
				clearInterval(inter);
				img_src = '/outputs/' + task.img_id + '.jpg';
			}
		};

		const inter = setInterval(loadTask, 1000);
		await loadTask();
	});

	let prompt =
		$page.url.searchParams.get('prompt') ||
		'illustration print of pug head sculpture, super detailed, by dan mumford, by aaron horkey, high contrast, low poly style';
</script>

<div class="min-h-screen w-full hero">
	<div class="hero-content text-center flex flex-col w-full">
		<div class="max-w-md">
			<h1 class="text-4xl font-bold">
				<div class="text-sm font-bold text-left">Let's</div>
				<div>Make A Dream</div>
			</h1>
		</div>
		{#if task}
			<div class="md:max-w-lg" class:hidden={!ready}>
				<div class="border border-slate-400 p-2 rounded-lg">
					<img class="w-full h-full" src={img_src} alt="task result" />
				</div>
				<a
					sveltekit:reload
					href="/?prompt={task.prompt}"
					class="mt-4 btn border-none w-full md:w-1/2 bg-green-600 hover:bg-green-800 font-semibold text-white"
					>dream with this</a
				>
			</div>
		{:else}
			<form class="md:max-w-lg w-full px-8 md:px-0" action="/" method="post">
				<textarea
					name="prompt"
					class="w-full textarea textarea-bordered resize-none"
					rows={4}
					bind:value={prompt}
				/>
				<input
					type="submit"
					value="dream"
					class="mt-4 btn border-none w-full md:w-1/2 bg-green-600 hover:bg-green-800 font-semibold text-white"
				/>
			</form>
		{/if}
	</div>
</div>
