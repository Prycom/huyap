<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Header from "$lib/components/Header.svelte";
</script>
	
<Header />
{@render children()}

