import { browser } from "$app/environment";

export function persisted(key, initial) {
    let value = $state(load());

    function load() {
        if (!browser) return initial;

        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : initial;
    }

    $effect(() => {
        if (browser) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });

    return {
        get value() { 
            return value; 
        },
        set value(v) { 
            value = v; 
        },
    };
}