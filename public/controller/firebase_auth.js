import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import * as Elements from '../viewpage/elements.js';
import * as Constants from '../model/constants.js';
import * as Util from '../viewpage/util.js';
import { routing, ROUTE_PATHNAMES } from './route.js';
import { initShoppingCart } from '../viewpage/cart_page.js';
const auth = getAuth();
export let currentUser = null;

export function addEventListeners() {
	onAuthStateChanged(auth, authStateChanged);

	Elements.formSignIn.addEventListener('submit', async (e) => {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;
		const button = e.target.getElementsByTagName('button')[0];
		const label = Util.disableButton(button);
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			Elements.modalSignin.hide();
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			Util.info('Sign in error', JSON.stringify(error), Elements.modalSignin);
			if (Constants.DEV) {
				console.log(`error: ${errorCode} | ${errorMessage}`);
			}
		}
		Util.enableButton(button, label);
	});

	Elements.MENU.SignOut.addEventListener('click', async (e) => {
		try {
			await signOut(auth);
		} catch (error) {
			Util.info('Sign Out Error: Try again\n', JSON.stringify(error));
			if (Constants.DEV) {
				console.log(`sign out error\n${JSON.stringify(e)}`);
			}
		}
	});
}

async function authStateChanged(user) {
	currentUser = user;
	if (user) {
		let menus = document.getElementsByClassName('modal-preauth');
		for (let i = 0; i < menus.length; i++) {
			menus[i].style.display = 'none';
		}
		menus = document.getElementsByClassName('modal-postauth');
		for (let i = 0; i < menus.length; i++) {
			menus[i].style.display = 'block';
		}
		initShoppingCart();
		routing(window.location.pathname, window.location.hash);
	} else {
		let menus = document.getElementsByClassName('modal-preauth');
		for (let i = 0; i < menus.length; i++) {
			menus[i].style.display = 'block';
		}
		menus = document.getElementsByClassName('modal-postauth');
		for (let i = 0; i < menus.length; i++) {
			menus[i].style.display = 'none';
		}
		history.pushState(null, null, ROUTE_PATHNAMES.HOME);
		routing(window.location.pathname, window.location.hash);
	}
}
