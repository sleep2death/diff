import { json } from '@sveltejs/kit';
import { client as rdb } from '$lib/redis';

export async function GET({ params }) {
	const r = await rdb.GET('t2i:' + params.id);
	return json(JSON.parse(r));
}
