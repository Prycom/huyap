<script lang="ts">
	let logs: string[] = [];

	interface DKAState {
		[symbol: string]: string;
	}

	interface DKA {
		[state: string]: DKAState;
	}

	let testDKA: DKA = {
		q0: {
			'1': 'q1',
			'2': 'q2',
			'3': 'q3'
		},
		q1: {
			'1': 'qf',
			'2': 'q1',
			'3': 'q1'
		},
		q2: {
			'1': 'q2',
			'2': 'qf',
			'3': 'q2'
		},
		q3: {
			'1': 'q3',
			'2': 'q3',
			'3': 'qf'
		}
	};

	function checkInputWithDKA(dka: DKA, input: string) {
		logs = [];
		let currentState = 'q0';

		for (let i = 0; i < input.length; i++) {
			// check every symbol of input sequence

			let currentSymbol = input[i];
			let currentTransitions = dka[currentState];

			if (currentState == 'qf') {
				// if dka finished
				logs = [...logs, `ОШИБКА!!! Считан символ ${currentSymbol}, хотя достигнут qf!!!`];
				return;
			}

			let inputs = Object.keys(currentTransitions);
			if (inputs.includes(currentSymbol)) {
				let newState = currentTransitions[currentSymbol];
				logs = [...logs, `Переход из ${currentState} в ${newState} по символу ${currentSymbol}`];
				currentState = newState; // transit to new state
			} else {
				// we have no transition by current symbol
				logs = [
					...logs,
					`ОШИБКА! Из ${currentState} невозможно куда-либо перейти по ${currentSymbol}. ${currentSymbol} не принадлежит ДКА`
				];
			}
		}
	}

	let exInput: string = '';
    let userInput: string = ''

	let fileInput = null;
	let userDKA: DKA | null = null;

	async function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files[0];
		if (file) {
			const dkaJson = await file.text();
			userDKA = JSON.parse(dkaJson) as DKA;
			console.log(userDKA);
		}
	}
</script>

<div class="flex w-full flex-col gap-4 p-6 lg:p-12">
	<h2 class="text-3xl font-bold">Лабораторная 2</h2>
	<p class="text-2xl italic">Пример</p>
	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="card-title mb-2">Конечный автомат:</div>
				{#each Object.entries(testDKA) as state}
					<div class="flex gap-1">
						<strong class="mr-4">{state[0]} : </strong>
						{#each Object.entries(state[1]) as pair}
							<i class="badge">{pair[0]}</i> -> <i class="badge">{pair[1]}</i>,
						{/each}
					</div>
				{/each}
			</div>
			<div class="card-body">
				<label for="checkExInput">Введите цепочку:</label>
				<input
					id="checkExInput"
					class="input input-bordered"
					bind:value={exInput}
					on:input={() => {
                        userInput = ''
						checkInputWithDKA(testDKA, exInput);
					}}
				/>
				<div class="card-actions mt-4 justify-center"></div>
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="card-title mb-2">Вывод:</div>
				<div class="flex flex-wrap gap-2">
					{#each logs as log}
						<div class="italic">{log}</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

    <!-- USER INPUT SECTION -->

	<p class="text-2xl italic">Пользовательский ввод</p>
	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="card-title mb-2">Конечный автомат:</div>
				<input type="file" id="dkaFileInput" accept=".json" on:change={handleFileChange} />
				{#if userDKA}
					{#each Object.entries(userDKA) as state}
						<div class="flex gap-1">
							<strong class="mr-4">{state[0]} : </strong>
							{#each Object.entries(state[1]) as pair}
								<i class="badge">{pair[0]}</i> -> <i class="badge">{pair[1]}</i>,
							{/each}
						</div>
					{/each}
				{/if}
			</div>
			<div class="card-body">
				<label for="checkExInput">Введите цепочку:</label>
				<input
					id="checkExInput"
					class="input input-bordered"
					bind:value={userInput}
					on:input={() => {
                        exInput = ''
                        if(userDKA !== null) checkInputWithDKA(userDKA, userInput);
					}}
				/>
				<div class="card-actions mt-4 justify-center"></div>
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="card-title mb-2">Вывод:</div>
				<div class="flex flex-wrap gap-2">
					{#if userInput !== ''}  
                        {#each logs as log}
                            <div class="italic">{log}</div>
                        {/each}
                    {/if}
				</div>
			</div>
		</div>
	</div>
</div>
