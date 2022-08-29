<script>
	import Header from '$lib/components/header.svelte';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Circle3 } from 'svelte-loading-spinners';

	export let errors;

	let img_src = '/images/dummy_512x512.png';
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
				console.log('task done:', task);
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

<Header />
<div class="min-h-screen w-full hero">
	<div class="hero-content text-center flex flex-col w-full">
		<div class="max-w-md">
			<h1 class="text-4xl font-bold">
				<div class="text-sm font-bold text-left">Let's</div>
				<div>Make A Dream</div>
			</h1>
		</div>
		{#if task}
			<div class="md:max-w-lg">
				<div class="border border-slate-400 p-2 rounded-lg">
					<div class:hidden={ready} class="absolute">
						<Circle3 size="36" unit="px" duration="2s" />
					</div>
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
					name="dream"
					class="mt-4 btn border-none w-full md:w-1/2 bg-green-600 hover:bg-green-800 font-semibold text-white"
				/>
				{#if errors}
					<label class="w-full text-sm text-red-400" for="dream">{errors.msg}</label>
				{/if}
			</form>
		{/if}
	</div>
</div>
