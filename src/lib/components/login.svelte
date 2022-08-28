<script>
	import { page } from '$app/stores';

	let password_error = $page.url.searchParams.get('password_error');
	let email_error = $page.url.searchParams.get('email_error');
	let login_error = $page.url.searchParams.get('login_error');
	let register_error = $page.url.searchParams.get('register_error');

	let formType = 'login';
</script>

<form class="m-4" action="/login" method="post">
	<input
		id="email"
		name="email"
		type="email"
		placeholder="Email"
		class="input input-bordered w-full max-w-md"
	/>
	{#if email_error}
		<label class="w-full text-sm text-red-400" for="email">{email_error}</label>
	{/if}
	<input
		id="password"
		name="password"
		type="password"
		placeholder="Password"
		class="mt-2 input input-bordered w-full max-w-md"
	/>
	{#if password_error}
		<label class="w-full text-sm text-red-400" for="password">{password_error}</label>
	{/if}
	<input type="hidden" name="type" bind:value={formType} />
	<input
		on:click={() => (formType = 'login')}
		type="Submit"
		value="Login"
		class="mt-4 input input-bordered w-full bg-blue-900 font-semibold"
	/>
	{#if login_error}
		<label class="w-full text-sm text-red-400" for="password">{login_error}</label>
	{/if}
	<div class="divider">or</div>
	<input
		on:click={() => (formType = 'create')}
		type="Submit"
		value="Create new account"
		class="input input-bordered w-full bg-green-900 font-semibold"
	/>
	{#if register_error}
		<label class="w-full text-sm text-red-400" for="password">{register_error}</label>
	{/if}
</form>
