<script>
	import { persisted } from "$lib/persisted.svelte";
	import SetTimerButton from "$lib/components/SetTimerButton.svelte";
	import { preventDefault } from "svelte/legacy";

	const timeInvestedInWritingSoFar = persisted('timeInvestedInWritingSoFar', 0);

	let mainTimerStartTime = $state(300);

	function setMainTimerStartTime(valueToSetInSeconds) {
		mainTimerStartTime = valueToSetInSeconds;
	}

	let text = $state('');
	let phase = $state('idle');
	let mainTimer = $state(300);
	let dangerTimer = $state(10);

	$effect(() => {
		if (phase === 'idle') {
			mainTimer = mainTimerStartTime;
		}
	});

	let mainIntervalId = null;
	let dangerIntervalId = null;
	let idleTimeoutId = null;

	let textOpacity = $derived(phase === 'danger' ? dangerTimer / 10 : 1);

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
		
		mainTimer = mainTimerStartTime;
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
		}, 2000);
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
		timeInvestedInWritingSoFar.value += mainTimerStartTime;

		const content = `Time Invested In Writing So Far: ${timeInvestedInWritingSoFar.value} seconds\n\nText written:\n\n${text}`;
		const blob = new Blob([content], { type: 'text/plain' });
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

	$effect(() => {
		if (phase !== 'writing' && phase !== 'danger') return;

		function handleFocusLoss() {
			resetToIdle(true);
		}

		function handleVisibilityChange() {
			if (document.hidden) {
				handleFocusLoss();
			}
		}

		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('blur', handleFocusLoss);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('blur', handleFocusLoss);
		};
	});
</script>

<div class="container">
	<textarea 
		bind:value={text} 
		oninput={handleInput} 
		disabled={phase === 'done'}
		onpaste={(e) => {
			e.preventDefault();
		}}
		oncopy={(e) => {
			e.preventDefault();
			e.clipboardData.setData('text/plain', "Don't cheat! No copying/pasting");
		}}
		oncontextmenu={(e) => {
			e.preventDefault();
		}}
		style="opacity: {textOpacity}"
	></textarea>

	<p>
		Time invested so far: {timeInvestedInWritingSoFar.value} seconds.
	</p>

	{#if phase === 'idle'}
		<p>{mainTimerStartTime} seconds.</p>
		
		<SetTimerButton timerInSeconds={60} timerInMinutes="1m" onClickFunction={setMainTimerStartTime} />
		<SetTimerButton timerInSeconds={120} timerInMinutes="2m" onClickFunction={setMainTimerStartTime} />
		<SetTimerButton timerInSeconds={180} timerInMinutes="3m" onClickFunction={setMainTimerStartTime} />
		<SetTimerButton timerInSeconds={300} timerInMinutes="5m" onClickFunction={setMainTimerStartTime} />
		<SetTimerButton timerInSeconds={480} timerInMinutes="8m" onClickFunction={setMainTimerStartTime} />
		<SetTimerButton timerInSeconds={780} timerInMinutes="13m" onClickFunction={setMainTimerStartTime} />
	{/if}

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
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	textarea {
		width: 100%;
		min-height: 60vh;
		padding: 1rem;
		font-size: 1.1rem;
		line-height: 1.6;
		resize: vertical;
		box-sizing: border-box;
	}
</style>