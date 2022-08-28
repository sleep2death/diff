import { client as rdb } from '$lib/redis';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const isLogin = locals.session.data && locals.session.data.uuid;
	if (!isLogin) {
		throw redirect('307', '/login');
	}
}
