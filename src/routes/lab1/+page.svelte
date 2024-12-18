<script lang="ts">
	let exAlph = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+'];
	let exOutput = [];

	interface Rule {
		[key: string]: string[];
	}

	const exRules: Rule[] = [
		{
			S: ['T', '+T', '-T']
		},
		{
			T: ['F', 'TF']
		},
		{
			F: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
		}
	];

	let minChars = 3;
	let maxChars = 5;

	function generateChains(rules: Rule[], minChars: number, maxChars: number) {
		let chains = ['S'];
		let output: string[] = [];

		while (chains.length > 0) {
			const chain = chains.shift() as string;
			const newChains: string[] = [];

			for (const rule of rules) {
				for (const key in rule) {
					if (chain.includes(key)) {
						console.log(`key: ${key}`)
						
						const replacement = rule[key][Math.floor(Math.random() * rule[key].length)];
						const newChain = chain.replace(key, replacement);
						newChains.push(newChain);
					}
				}
			}

			if (newChains.length > 0) {
				chains.push(...newChains);
			} else {
				if (chain.length >= minChars && chain.length <= maxChars) {
					output.push(chain);
				}
			}

			if (chains.every((chain) => chain.length > maxChars)) {
				break;
			}
		}

		return output;
	}
</script>

<div class="flex w-full flex-col gap-4 p-6 lg:p-12">
	<h2 class="text-3xl font-bold">Лабораторная 1</h2>
	<p class="text-2xl italic">Пример</p>

	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="card w-96 bg-base-200 shadow-xl">
			<div class="card-body">
				<div class="card-title mb-2">Правила:</div>
				{#each exRules as rule}
					{#each Object.entries(rule) as [key, values]}
						<div class="flex flex-wrap items-center justify-start gap-1">
							<strong class="mr-4">{key} : </strong>
							{#each values as variant}
								<div class="badge">{variant}</div>
							{/each}
						</div>
					{/each}
				{/each}
			</div>
			<div class="card-body">
				<div class="card-title mb-2">Алфавит:</div>
				<div class="flex flex-wrap gap-1">
					{#each exAlph as letter}
						<div class="badge">{letter}</div>
					{/each}
				</div>
				<div class="card-actions mt-4 justify-center">
					<button class="btn btn-primary" on:click={generateChains(exRules, 3, 5)}>Сгенерировать!</button>
				</div>
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<div class="card-title mb-2">Вывод:</div>
			</div>
		</div>
	</div>
</div>
