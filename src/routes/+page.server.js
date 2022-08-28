import { client as rdb } from '$lib/redis';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, request }) {
	const uuid = locals.session.data && locals.session.data.uuid;
	try {
	} catch (e) {}

	if (!uuid) {
		throw redirect('307', '/login');
	}

	const url = new URL(request.url);
	const task_id = new URLSearchParams(url.search).get('task');
	// const current_task = await rdb.LINDEX(`uuid:${locals.session.data.uuid}:tasks`, 0);
	// const task = await rdb.get(`t2i:${current_task}`);
	return {
		task: task_id
	};
}

export async function POST({ locals, request }) {
	const isLogin = locals.session.data && locals.session.data.uuid;
	if (!isLogin) {
		throw redirect('307', '/login');
	}
	try {
		const values = await request.formData();

		const task = await fetch(
			'http://localhost:8080/api/txt2img?' +
				new URLSearchParams({
					prompt: values.get('prompt') || '',
					seed: values.get('seed') || randomNumber(0, 99999)
				})
		);

		const task_res = await task.json();
		await rdb.LPUSHX(`uuid:${locals.session.data.uuid}:tasks`, task_res.id);
		return {
			status: 200,
			location: '/?task=' + task_res.id
		};
	} catch (e) {
		console.error(e);
		return {
			status: 500,
			errors: {
				msg: 'something wrong with diffusion server'
			}
		};
	}
}

// Function to generate random number
function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
