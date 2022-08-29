import { client as rdb } from '$lib/redis';

import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const uuid = locals.session.data && locals.session.data.uuid;
	try {
	} catch (e) {}

	if (!uuid) {
		throw redirect('307', '/login');
	}
}

export async function POST({ locals, request }) {
	const uuid = locals.session.data && locals.session.data.uuid;
	if (!uuid) {
		throw redirect('307', '/login');
	}
	try {
		const latest = await rdb.LINDEX(`uuid:${uuid}:tasks`, 0);
		if (latest) {
			const latest_task = await rdb.GET(`t2i:${latest}`);
			const l_task = JSON.parse(latest_task);
			if (l_task.status === 'Pending') {
				console.warn('a task already running');
				return {
					status: 400,
					errors: {
						msg: 'a task already running'
					}
				};
			}
		}

		const values = await request.formData();

		const task = await fetch(
			'http://localhost:8080/api/txt2img?' +
				new URLSearchParams({
					prompt: values.get('prompt') || '',
					seed: values.get('seed') || randomNumber(0, 99999),
					author: uuid
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
