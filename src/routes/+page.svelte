<script>
	let text = $state('');
	let phase = $state('idle');
	let mainTimer = $state(30);
	let dangerTimer = $state(10);

	let mainIntervalId = null;
	let dangerIntervalId = null;
	let idleTimeoutId = null;

	function clearAllTimers() {
		clearInterval(mainIntervalId);
		mainIntervalId = null;
		clearInterval(dangerIntervalId);
		dangerIntervalId = null;
		clearTimeout(idleTimeoutId);
		idleTimeoutId = null;
	}

	function resetToIdle(clearText) {
		clearAllTimers();
		if (clearText) {
			text = '';
		}
		
		mainTimer = 30;
		dangerTimer = 10;
		phase = 'idle';
	}

	function startMainInterval() {
		mainIntervalId = setInterval(() => {
			mainTimer--;
			if (mainTimer <= 0) {
				clearAllTimers();
				phase = 'done';
			}
		}, 1000);
	}

	function startDangerInterval() {
		dangerTimer = 10;
		dangerIntervalId = setInterval(() => {
			dangerTimer--;
			if (dangerTimer <= 0) {
				resetToIdle(true);
			}
		}, 1000);
	}

	function startIdleTimeout() {
		clearTimeout(idleTimeoutId);
		idleTimeoutId = setTimeout(() => {
			clearInterval(mainIntervalId);
			mainIntervalId = null;
			phase = 'danger';
			startDangerInterval();
		}, 5000);
	}

	function handleInput() {
		if (phase === 'idle') {
			phase = 'writing';
			startMainInterval();
			startIdleTimeout();
		} else if (phase === 'writing') {
			startIdleTimeout();
		} else if (phase === 'danger') {
			clearInterval(dangerIntervalId);
			dangerIntervalId = null;
			dangerTimer = 10;
			phase = 'writing';
			startMainInterval();
			startIdleTimeout();
		}
	}

	function download() {
		const blob = new Blob([text], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'write-or-die.txt';
		a.click();
		URL.revokeObjectURL(url);
		resetToIdle(false);
	}

	$effect(() => {
		return () => {
			clearAllTimers();
		};
	});
</script>

<textarea bind:value={text} oninput={handleInput} disabled={phase === 'done'}></textarea>

{#if phase === 'writing'}
	<p>Time remaining: {mainTimer}s</p>
{/if}

{#if phase === 'danger'}
	<p>Time remaining: {mainTimer}s (paused)</p>
	<p>Keep typing! Content will be cleared in: {dangerTimer}s</p>
{/if}

{#if phase === 'done'}
	<p>Time is up!</p>
	<button onclick={download}>Download your text</button>
{/if}
