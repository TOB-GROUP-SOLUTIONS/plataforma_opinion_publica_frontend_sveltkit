<script>
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import 'nprogress/nprogress.css';
	import '../app.css';
	import { browser } from '$app/environment';

	NProgress.configure({
		// Full list:
		minimum: 0.16
	});

	$: {
		if (browser && $navigating) {
			NProgress.start();
		} else NProgress.done();
	}
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>

