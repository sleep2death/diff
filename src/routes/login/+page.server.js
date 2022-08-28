import { client as rdb } from '$lib/redis';
import { redirect } from '@sveltejs/kit';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

// used for random salt
const saltRounds = 10;

export async function load({ locals }) {
	const isLogin = locals.session.data && locals.session.data.uuid;
	if (isLogin) {
		throw redirect('307', '/');
	}
}

export async function POST({ locals, request }) {
	const values = await request.formData();

	let email = /** @type {string} */ (values.get('email'));
	email = email.toLowerCase();

	const password = /** @type {string} */ (values.get('password'));
	const formType = /** @type {string} */ (values.get('type'));

	if (!validateEmail(email)) {
		return {
			status: 403,
			location: `/login?email_error=${'invalid email format'}`
		};
	}

	if (!validatePassword(password)) {
		return {
			status: 403,
			location: `/login?password_error=${'invalid password format'}`
		};
	}

	const exists = await rdb.exists(`email:${email}`);
	let error = '';

	if (formType === 'login') {
		// get uuid by email
		const uuid = await rdb.get(`email:${email}`);
		if (!uuid) {
			error = 'email or password not match';
			return {
				status: 401,
				location: `/login?login_error=${error}`
			};
		}

		const user = await rdb.hGetAll(`uuid:${uuid}`);
		const match = await bcrypt.compare(password, user.pwd);
		if (!match) {
			error = 'email or password not match';
			return {
				status: 401,
				location: `/login?login_error=${error}`
			};
		} else {
			await locals.session.set({ uuid: uuid });
			return {
				status: 200,
				location: `/`
			};
		}
	} else if (formType === 'create') {
		if (exists) {
			error = 'email address alreay exists';
			return {
				status: 403,
				location: `/login?register_error=${error}`
			};
		}

		const uuid = crypto.randomUUID();
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		await rdb
			.multi()
			.set(`email:${email}`, uuid)
			.hSet(`uuid:${uuid}`, 'pwd', hashedPassword)
			.hSet(`uuid:${uuid}`, 'email', email)
			.exec();
	}

	return {
		status: 200,
		location: `/`
	};
}

function validateEmail(email) {
	return email
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
}

function validatePassword(password) {
	return password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
}
