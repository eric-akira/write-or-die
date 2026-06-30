<script>
    let { timerInSeconds, label, onClickFunction } = $props();
</script>

<p>
    <button onclick={() => onClickFunction(timerInSeconds)}>
        {label}
    </button>
</p>