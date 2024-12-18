<script lang="ts">
	let exAlph = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+'];
	let exOutput = []

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
		
	}
</script>

<div class="flex w-full flex-col gap-4 p-6 lg:p-12">
	<h2 class="text-3xl font-bold">Лабораторная 1</h2>
	<p class="text-2xl italic">Пример</p>

	<div class='flex lg:flex-row flex-col gap-8'>
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
					<button class="btn btn-primary">Сгенерировать!</button>
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
