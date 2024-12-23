<script lang="ts">
	interface MP {
		[state: string]: {
			[input: string]: {
				[stackTop: string]: [newState: string, newStackContent: string, output: string];
			};
		};
	}

	let exMP: MP = {
		q0: {
			// which state
			'0': {
				// which input
				Z: [
					// which top of stack
					'q0', // [0] element -> new state
					'0Z', // [1] element -> new stack content
					'a'
				],
				'0': ['q0', '00', 'a']
			},
			'': {
				Z: ['q0', '', '']
			},
			'1': {
				// which input
				'0': [
					// which top of stack
					'q1',
					'',
					'b'
				]
			}
		},
		q1: {
			'1': {
				'0': ['q1', '', 'b']
			},
			'': {
				Z: ['q0', '', '']
			}
		}
	};

	let logs: string[] = [];
	let userInput: string = '';
	let exInput: string = '';
	let exInputs: string[] = [''];
    let usInputs: string[] = ['']

	function checkInputWithDMPA(mp: MP | null, input: string) {
		if (!mp) {
			alert('Загрузите валидный МП!');
			userInput = '';
			return;
		}
		let currentState = 'q0';
		let stack = 'Z';
		let output = ''; // Инициализация выходной цепочки
		logs = []; // Clear logs
		let curSymb = input[0];
		for (let i = 0; i < input.length + 1; i++) {
			logs = [
				...logs,
				`<strong class=''>[?] INFO</strong> <br/>Текущее состояние: <div class='badge'>${currentState}</div><br/>Текущий стек: <div class='badge'>${stack}</div><br/>Текущая выходная цепочка: <div class='badge'>${output}</div>`
			];
			curSymb = input[i] ? input[i] : ''; // Get current input symbol
			if (Object.keys(mp).includes(currentState)) {
				let stateContent = mp[currentState];

				if (Object.keys(stateContent).includes(curSymb)) {
					let stackVariants = stateContent[curSymb];
					let stackTops = Object.keys(stackVariants);

					let top = stackTops.find((top) => stack.startsWith(top));

					if (top) {
						let newState = stackVariants[top][0];
						let replacementZ = stackVariants[top][1];
						let newOutput = stackVariants[top][2] || ''; // Получение выходного символа
						let newStack = stack.replace(top, replacementZ);
						output += newOutput; // Обновление выходной цепочки
						logs = [
							...logs,
							`<strong class=''>[+] УСПЕХ</strong> <br/>Переход из <div class='badge'>${currentState}</div> по символу <div class='badge'>${curSymb}</div> и текущему стеку <div class='badge'>${stack}</div> произошёл в <div class='badge'>${newState}</div>;`
						];
						currentState = newState;
						stack = newStack;
					} else {
						logs = [
							...logs,
							`<strong class='underline'>[!] ОШИБКА</strong> Переход из <div class='badge'>${currentState}</div> по символу <div class='badge'>${curSymb}</div> и текущему стеку <div class='badge'>${stack}</div> не определён`
						];
						return;
					}
				} else {
					logs = [
						...logs,
						`<strong class='underline'>[!] ОШИБКА</strong> Переход из <div class='badge'>${currentState}</div> по символу <div class='badge'>${curSymb}</div> не определён`
					];
					return;
				}
			} else {
				logs = [
					...logs,
					`<strong class='underline'>[!] ОШИБКА</strong> Состояние <div class='badge'>${currentState}</div> не в ДМПА!`
				];
				return;
			}
			curSymb = '';
		}
		if (currentState === 'q0' && stack === '') {
			logs = [
				...logs,
				`<strong class='underline'>[+] УСПЕХ</strong> <br/>Стек опустошён, автомат вернулся в <div class='badge'>q0</div>. <br/>Выходная цепочка: <div class='badge'>${output}</div>`
			];
			return;
		}
	}

	let userMP: MP | null = null;

	async function handleFileChange(event: Event) {
		//const file = (event.target as HTMLInputElement)?.files[0];
		const file = (event.target as HTMLInputElement).files?.[0] as File | null;
		if (file) {
			const dkaJson = await file.text();
			userMP = JSON.parse(dkaJson) as MP;
			console.log(userMP);
		}
	}

	// SU PEREVOD
	let isMPActive = true;
</script>

<div class="flex w-full flex-col gap-4 p-6 lg:p-12">
	<h2 class="text-3xl font-bold">Лабораторная 4</h2>

	<div class="flex items-center gap-4 text-2xl font-semibold">
		<label class="swap swap-flip text-6xl">
			<!-- this hidden checkbox controls the state -->
			<input type="checkbox" class="hidden" bind:checked={isMPActive} />

			<div class="swap-on">МП преобразователь</div>
			<div class="swap-off">СУ перевод</div>
		</label>
	</div>

	<div class={isMPActive ? 'flex flex-col gap-4' : 'hidden'}>
		<p class="text-2xl italic">Пример</p>

		<div class="flex flex-col gap-8 lg:flex-row">
			<!-- EXAMPLE AUTOMATON -->
			<div class="card w-full bg-base-200 shadow-xl">
				<div class="card-body flex flex-col lg:flex-row">
					<div class="flex flex-col gap-4 lg:w-1/2">
						<div class="card-title mb-2">Магазинный преобразователь:</div>
						<div class="mb-2 flex flex-wrap gap-1">
							<strong class="">Состояние : </strong>
							<div class="badge">(входной символ, верхушка стека, символ перевода)</div>
							->
							<div class="badge">(новое состояние, новая верхушка стека)</div>
						</div>
						{#each Object.keys(exMP) as exState}
							<div class="flex flex-wrap gap-1">
								<strong class="">{exState} : </strong>
								{#each Object.keys(exMP[exState]) as exStateInput}
									{#each Object.keys(exMP[exState][exStateInput]) as exStateInputStack}
										<div class="badge">
											('{exStateInput}', '{exStateInputStack}', '{exMP[exState][exStateInput][
												exStateInputStack
											][2]}') -> ({exMP[exState][exStateInput][exStateInputStack][0]}, '{exMP[
												exState
											][exStateInput][exStateInputStack][1]}')
										</div>
										,
									{/each}
								{/each}
							</div>
						{/each}
					</div>
					<div class="flex w-1/2 flex-col gap-4">
						<label for="exInput" class="mt-4 w-1/2 text-xl font-semibold">Введите цепочку:</label>
						{#each exInputs as usInput}
							<div class="flex w-full gap-2">
								<input
									id="exInput"
									type="text"
									class="input input-bordered flex-grow"
									bind:value={usInput}
									on:input={() => {
										logs = [];
										userInput = '';
										checkInputWithDMPA(exMP, usInput);
									}}
								/><button
									class="btn btn-primary"
									on:click={() => {
										checkInputWithDMPA(exMP, usInput);
										document.getElementById('my_modal_1').showModal();
									}}>?</button
								>
							</div>
						{/each}

						<button
							class="btn btn-secondary"
							on:click={() => {
								exInputs = [...exInputs, ''];
								console.log(exInputs);
							}}>Новая цепочка</button
						>
					</div>
				</div>
			</div>
		</div>

		<p class="text-2xl italic">Пользовательский ввод</p>

		<div class="flex flex-col gap-8 lg:flex-row">
			<!-- USER AUTOMATON -->

			<div class="card h-fit w-full bg-base-200 shadow-xl">
				<div class="card-body flex h-fit gap-8 lg:flex-row">
					<div class="flex w-1/2 flex-col gap-6">
						<div class="card-title mb-2">Магазинный преобразователь:</div>
						<label for="mpFileInput" class="btn bg-base-100 shadow-xl">Загрузите МП</label>
						<input
							type="file"
							id="mpFileInput"
							class="hidden"
							accept=".json"
							on:change={handleFileChange}
						/>

						<div class="mb-2 flex h-fit flex-wrap gap-1">
							<strong class="">Состояние : </strong>
							<div class="badge">(входной символ, верхушка стека, символ перевода)</div>
							->
							<div class="badge">(новое состояние, новая верхушка стека)</div>
						</div>
						{#if userMP}
							{#each Object.keys(userMP) as exState}
								<div class="flex flex-wrap gap-1">
									<strong class="">{exState} : </strong>
									{#each Object.keys(userMP[exState]) as exStateInput}
										{#each Object.keys(userMP[exState][exStateInput]) as exStateInputStack}
											<div class="badge">
												('{exStateInput}', '{exStateInputStack}', '{userMP[exState][exStateInput][
													exStateInputStack
												][2]}') -> ({userMP[exState][exStateInput][exStateInputStack][0]}, '{userMP[
													exState
												][exStateInput][exStateInputStack][1]}')
											</div>
											,
										{/each}
									{/each}
								</div>
							{/each}
						{/if}
					</div>
					<div class="flex w-1/2 flex-col gap-4">
						<label for="userInput" class="mt-4 w-1/2 text-xl font-semibold">Введите цепочку:</label>
						{#each usInputs as usInput}
							<div class="flex w-full gap-2">
								<input
									id="exInput"
									type="text"
									class="input input-bordered flex-grow"
									bind:value={usInput}
									on:input={() => {
										logs = [];
										userInput = '';
										checkInputWithDMPA(exMP, usInput);
									}}
								/><button
									class="btn btn-primary"
									on:click={() => {
										checkInputWithDMPA(userMP, usInput);
										document.getElementById('my_modal_1').showModal();
									}}>?</button
								>
							</div>
						{/each}

						<button
							class="btn btn-secondary"
							on:click={() => {
								usInputs = [...usInputs, ''];
								console.log(usInputs);
							}}>Новая цепочка</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- SU PEREVOD -->
	<div class={isMPActive ? 'flex flex-col gap-4' : 'hidden'}></div>
</div>

<!-- MODAL SECTION -->

<dialog id="my_modal_1" class="modal">
	<div class="modal-box bg-white">
		<h3 class="text-lg font-bold">Вывод</h3>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				{#each logs as log}
					<div class="" bind:innerHTML={log} contenteditable="true"></div>
				{/each}

				<button class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>
