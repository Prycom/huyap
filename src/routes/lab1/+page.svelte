<script lang="ts">
	let exAlph = ['0', '1', '2', '-', '+'];
	let exOutput: string[] = [];
	let userOutput: string[] = [];
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
			F: ['0', '1', '2']
		}
	];

	let userRules: Rule[] = [];
	let userRuleKey: string = '';
	let userRuleVariants: string = '';
	let minChars:number = 1;
	let maxChars:number = 1;

	function generateChains(rules: Rule[], minChars: number, maxChars: number) {
		let chains: string[] = ['S'];
		let output: string[] = [];

		let keys: string[] = [];
		rules.forEach((rule) => {
			keys.push(Object.keys(rule)[0]);
		});
		console.log(keys);

		while (chains.length > 0) {
			let chain = chains.shift() as string; // get chain and delete it from chains

			if (chain.length > maxChars + 2) {
				// chain will not be valid; skip
				console.log(`max chars for "${chain}"`);
				continue;
			}
			for (const rule of rules) {
				// get every rule object
				for (const key in rule) {
					// get key of rule
					if (chain.includes(key)) {
						// if terminal in chain
						// for every variant recombine chain
						for (const variant of rule[key]) {
							const newChain = chain.replace(key, variant);
							console.log(`chain: ${chain}; new chain: ${newChain}`);
							chains.push(newChain);
							if (
								newChain.length >= minChars &&
								newChain.length <= maxChars &&
								!keys.some((ruleKey) => newChain.includes(ruleKey))
							) {
								output.push(newChain);
							}
						}
					}
				}
			}
		}
		output = [...new Set(output)];
		console.log(output);
		return output;
	}
</script>

<div class="flex w-full flex-col gap-4 p-6 lg:p-12">
	<h2 class="text-3xl font-bold">Лабораторная 1</h2>
	<p class="text-2xl italic">Пример</p>

	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="card bg-base-200 shadow-xl lg:w-1/2">
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
				<div class="card-title mt-4">Ограничения:</div>
				<p>От 2 до 3 символов</p>
				<div class="card-actions mt-4 justify-center">
					<button
						class="btn btn-primary"
						on:click={() => {
							exOutput = generateChains(exRules, 2, 3);
						}}>Сгенерировать!</button
					>
				</div>
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="card-title mb-2">Вывод:</div>
				<div class="flex flex-wrap gap-1">
					{#each exOutput as ex}
						<div class="badge">{ex}</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<p class="text-2xl italic">Пользовательский ввод</p>

	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class='card-title mb-2'>Скока:</div>
				<div class='flex'>
					<label for='minChars' class='w-1/2'>Мин символов</label>
					<input id='minChars' type='number' class="input input-bordered w-1/2" min='1' bind:value={minChars}/>
				</div>
				<div class='flex'>
					<label for='minChars' class='w-1/2'>Макс символов</label>
					<input id='minChars' type='number' class="input input-bordered w-1/2" min={minChars} bind:value={maxChars}/>
				</div>

				<div class="card-title mb-2">Правила:</div>
				{#each userRules as rule}
					{#each Object.entries(rule) as [key, values]}
						<div class="flex flex-wrap items-center justify-start gap-1">
							<strong class="mr-4">{key} : </strong>
							{#each values as variant}
								<div class="badge">{variant}</div>
							{/each}
						</div>
					{/each}
				{/each}
				<div class="flex w-full gap-4 border-t-2 border-base-300">
					<div class="flex w-1/2 flex-col">
						<label for="ruleName" class="">Название правила</label>
						<input
							type="text"
							id="ruleName"
							placeholder="Ну типо S"
							class="input input-bordered w-full"
							bind:value={userRuleKey}
						/>
					</div>
					<div class="flex w-1/2 flex-col">
						<label for="ruleTrans">Переходы правила</label>
						<input
							type="text"
							id="ruleName"
							placeholder="Добавляйте варианты через | вертикальную черту"
							class="input input-bordered w-full"
							bind:value={userRuleVariants}
						/>
					</div>
				</div>
				<button
					class="btn btn-outline"
					on:click={() => {
						if (!userRuleKey || !userRuleVariants){
							alert('Поля ruleKey и ruleVariants должны быть непустыми!')
						}
						if(minChars > maxChars){
							alert('Ты чо, мин это мин, макс это макс')
						}
						let newRule = {
							[userRuleKey]: userRuleVariants.split('|')
						};
						userRules = [...userRules, newRule];
						console.log(userRuleKey);
						userRuleKey = '';
						userRuleVariants = '';
					}}>Добавить правило</button
				>
				<div class="card-actions mt-4 justify-center">
					<button
						class="btn btn-primary"
						on:click={() => {
							if (!userRuleKey || !userRuleVariants){
							alert('Поля ruleKey и ruleVariants должны быть непустыми!')
							}
							if(minChars > maxChars){
								alert('Ты чо, мин это мин, макс это макс')
							}
							userOutput = generateChains(userRules, 2, 3);
						}}>Сгенерировать!</button
					>
				</div>
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="card-title mb-2">Вывод:</div>
				<div class="flex flex-wrap gap-1">
					{#each userOutput as ex}
						<div class="badge">{ex}</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
