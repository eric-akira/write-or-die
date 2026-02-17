<script>
    let { timerInSeconds, timerInMinutes, onClickFunction } = $props();
</script>

<p>
    <button onclick={() => onClickFunction(timerInSeconds)}>
        {timerInMinutes}
    </button>
</p>