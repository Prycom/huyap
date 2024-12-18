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
		let chains: string[] = ['S'];
		let output: string[] = [];

		while (chains.length > 0) {
			let chain = chains.shift() as string; // get chain and delete it from chains
			let newChains: string[] = [];
			console.log(chains)
			if (chain.length > maxChars){
				console.log(`max chars for "${chain}"`)
				continue
			}
			for (const rule of rules) { // get every rule object
				for (const key in rule) { // get key of rule 
					if (chain.includes(key)) { // if terminal in chain
						//console.log(`key: ${key}; chain: ${chain}`)
						// for every variant for particular key
						for(const variant of rule[key]){
							//console.log(`${variant}`)
							const newChain = chain.replace(key, variant)
							//console.log(`chain: ${chain}; new chain: ${newChain}`)
							newChains.push(newChain)
							//if (newChain.length >= minChars && newChain <= maxChars && !newChain.includes())
						}
					}
				}
			}
			if (chains.length > 100){
				break
			}
			//console.log(newChains)
			if (newChains.length > 0) {
				chains.push(...newChains);
				newChains = []
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
		<div class="card lg:w-96 bg-base-200 shadow-xl">
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
					<button class="btn btn-primary" on:click={generateChains(exRules, 2, 3)}>Сгенерировать!</button>
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
