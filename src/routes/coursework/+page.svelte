<script lang="ts">
	let NTsymbols: string[] = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z'
	];
	let NTsymbIdx: number = 0;

	interface Grammar {
		VT: string[]; // terminal symbols
		VN: string[]; // non terminal symbols
		P: { [key: string]: string[] }; // rules
		S: string; // start symbol from non terminal symbols
	}

	let testGrammatic: Grammar = {
		VT: ['0', '1'], // terminal symbols
		VN: ['S', 'A'], // non terminal symbols
		P: {
			// rules
			S: ['001A'],
			A: ['0A', '1A', '11']
		},
		S: 'S' // Start symbol from (non terminal symbols)
	};

	let leftGrammatic: Grammar = {
		VT: ['0', '1'], // terminal symbols
		VN: ['S', 'A'], // non terminal symbols
		P: {
			// rules
			S: ['A11'],
			A: ['A0', 'A1', '001']
		},
		S: 'S' // Start symbol from (non terminal symbols)
	};

	let testDKACompatibleGrammatic: Grammar = {
		VT: ['0', '1'],
		VN: ['S', 'A', 'B', 'C', 'D'], // DKA optimized non terminals
		P: {
			// DKA opimized rules
			S: ['0B'],
			B: ['0C'],
			C: ['1A'],
			A: ['0A', '1A', '1D'],
			D: ['1']
		},
		S: 'S'
	};

	let testDKA = {};

	/**
	 * Gets Grammatic, returns [isValid: boolean, message: string, side: string]
	 *
	 * ### Checks:
	 * - If grammatic (left side | right side) valid
	 * - If terminals intersect non terminals
	 * - If valid start non terminal
	 */
	function checkGrammatic(gram: Grammar): [boolean, string, string] {
		let isLeftSide: boolean | null = null; // by default it is null
		let isRightSide: boolean | null = null; // by default it is null

		// check grammar side
		for (let NT in gram.P) {
			for (let rule of gram.P[NT]) {
				let firstCh: string = rule[0];
				let lastCh: string = rule[rule.length - 1];

				if (gram.VN.includes(firstCh)) isLeftSide = true;
				if (gram.VN.includes(lastCh)) isRightSide = true;
			}
		}

		if (gram.VN.some((ch) => gram.VT.includes(ch)))
			return [false, 'Error: non terminals intersect terminals', 'n'];
		if (!gram.VN.includes(gram.S)) return [false, 'Error: start symbol not in non terminals', 'n'];
		if (isRightSide && isLeftSide)
			return [false, 'Error: non regular grammar (left|right sides)', 'n'];
		if (isRightSide) return [true, 'Right Side Grammar', 'r'];
		if (isLeftSide) return [true, 'Left Side Grammar', 'l'];

		return [false, 'Unexpected State', 'n'];
	}

	/**
	 * Builds DKA compatible grammatic
	 */
	function toAutomatGrammatic(gram: Grammar, side: string): Grammar {
		if (side !== 'r' && side !== 'l') gram;

		let newRules: { [key: string]: string[] } = {};
		if (side === 'r') {
			for (let NT in gram.P) {
				// for every non terminal
				for (let rule of gram.P[NT]) {
					// get every rule of non terminal

					for (let idx = 0; idx < rule.length; idx += 1) {
						if (newRules[NT] === undefined) newRules[NT] = [];

						if (idx === rule.length - 1) {
							// process last symbol
							if (gram.VT.includes(rule[idx])) {
								// if last symbol is terminal
								newRules[NT].push(rule[idx]); // add rule
							}
							continue;
						}

						// choose non terminal symbol for new rule
						let newNT: string = NTsymbols[NTsymbIdx];
						while (gram.VN.includes(newNT)) {
							NTsymbIdx += 1;
							newNT = NTsymbols[NTsymbIdx];
						}
						if (gram.VT.includes(rule[idx])) {
							// if we get terminal symbol
							if (gram.VN.includes(rule[idx + 1])) {
								// process pre last symbol (terminal, non terminal)
								newRules[NT].push(`${rule[idx]}${rule[idx + 1]}`);
							} else {
								newRules[NT].push(`${rule[idx]}${newNT}`); // add created new rule
								NTsymbIdx += 1; // increase for next symbol
								NT = newNT;
							}
						}
					}
				}
			}
		} else {
			for (let NT in gram.P) {
				// for every non terminal
				for (let rule of gram.P[NT]) {
					// get every rule of non terminal

					for (let idx = rule.length - 1; idx >= 0; idx -= 1) {
						if (newRules[NT] === undefined) newRules[NT] = [];

						if (idx === 0) {
							// process last symbol
							if (gram.VT.includes(rule[idx])) {
								// if last symbol is terminal
								newRules[NT].push(rule[idx]); // add rule
							}
							continue;
						}

						// choose non terminal symbol for new rule
						let newNT: string = NTsymbols[NTsymbIdx];
						while (gram.VN.includes(newNT)) {
							NTsymbIdx += 1;
							newNT = NTsymbols[NTsymbIdx];
						}
						if (gram.VT.includes(rule[idx])) {
							// if we get terminal symbol
							if (gram.VN.includes(rule[idx - 1])) {
								// process pre last symbol (terminal, non terminal)
								newRules[NT].push(`${rule[idx - 1]}${rule[idx]}`);
							} else {
								newRules[NT].push(`${newNT}${rule[idx]}`); // add created new rule
								NTsymbIdx += 1; // increase for next symbol
								NT = newNT;
							}
						}
					}
				}
			}
		}

		let newGrammar: Grammar = gram;

		newGrammar.P = newRules;
		newGrammar.VN = Object.keys(newRules);

		return newGrammar;
	}

	/**
	 *
	 * @param alphavit - base alphavit
	 * @param subStr - fixed substring, that should be in grammatic
	 * @param leftSide - choose the type of created grammatic
	 */
	function generateGrammatic(alphavit: string[], subStr: string, side: string): Grammar {
		if (!alphavit.some((term) => subStr.includes(term))) {
            alert(`Substring '${subStr}' couldn't be created with alphavit [${alphavit}]`)
			throw new Error("Substring couldn't be created with alphavit");
		}

		if (side !== 'r' && side !== 'l') {
			throw new Error('Side should be left or right');
		}

		let gram: Grammar = {
			VT: alphavit,
			VN: [],
			P: {},
			S: 'S'
		};

		let rules: { [key: string]: string[] } = {};

		if (side === 'l') {
			// generate left side grammatic
			for (let idx = 0; idx < alphavit.length; idx += 1) {
				rules['S'] = ['A' + subStr];
				// add end rule
				rules['A'] = [''];
				for (let idx = 0; idx < alphavit.length; idx += 1) {
					rules['S'].push('S' + alphavit[idx]);
					rules['A'].push(alphavit[idx]);
					rules['A'].push('A' + alphavit[idx]);
				}
			}
		} else {
			// generate right side grammatic
			// add start rule
			rules['S'] = [subStr + 'A'];
			// add end rule
			rules['A'] = [''];
			for (let idx = 0; idx < alphavit.length; idx += 1) {
				rules['S'].push(alphavit[idx] + 'S');
				rules['A'].push(alphavit[idx]);
				rules['A'].push(alphavit[idx] + 'A');
			}
		}
		gram.P = rules;
		gram.VN = ['S', 'A'];

		return gram;
	}

	/**
	 * Generates DKA with checking mult of chain length
	 * @param gram - DKA compatible grammatic
	 * @param mult - multiplyer to chain length
	 */
	function generateDKA(gram: Grammar, mult: number) {
        let states = {}
        for (let VN in gram.P){ // for each rule
            let idx = 0 // idx % mult = current remainder; (idx + 1) % mult = nex remainder
            for ( ; idx < mult; idx++){ // generate state for each remainder of division
                let currentState: string = `q_${VN}_${idx%mult}` // means q_(CURRENT_VN)_(CURRENT_REMAINDER)
                let nextRemainder:number = (idx + 1) % mult


                gram.VN.some( (NT) => {
                    if (gram.P[VN][0].includes(NT)){
                        console.log(`q_${NT}_${(idx+1)%mult}`)
                    }

                } )

                //console.log(`${currentState} ${gram.P[VN]}`)
                
            }
        }
    }

	/* ---------- USER DATA BLOCK ---------- */

	let userAlphavit: string[] = [];
	let userChar: string = '';
	let userSubstr: string = '';
    let userInputSide = 'l'
    let userGrammarSide = ''
	let userGrammar: Grammar;
	let userDKAGrammar: Grammar;

	/* ---------- USER DATA BLOCK ---------- */

	async function handleFileChange(event: Event) {
		//const file = (event.target as HTMLInputElement)?.files[0];
		const file = (event.target as HTMLInputElement).files?.[0] as File | null;
		if (file) {
			const dkaJson = await file.text();
			userGrammar = JSON.parse(dkaJson) as Grammar;
			console.log(userGrammar);
		}
	}

    generateDKA(testDKACompatibleGrammatic, 2)
</script>

<div class="flex flex-row flex-wrap gap-4 p-6">
	<div class="flex lg:flex-row flex-col w-full gap-4">
		<div class="card card-bordered grow bg-base-200">
			<div class="card-body justify-start">
				<div class="card-title text-2xl">Создайте грамматику</div>
				<h3 class="mt-4 text-xl font-semibold">Алфавит</h3>
				{#each userAlphavit as ch}
					<div class="badge h-fit">{ch}</div>
				{/each}
				<div class="flex w-full gap-4">
					<input
						class="input input-bordered grow"
						type="text"
						maxlength="1"
						placeholder="Добавить символ в алфавит"
						bind:value={userChar}
					/>
					<button
						class="btn h-12 w-12 rounded bg-base-300"
						on:click={() => {
							userAlphavit = [...userAlphavit, userChar];
							userChar = '';
						}}>+</button
					>
				</div>
				<h3 class="mt-4 text-xl font-semibold">Обязательная цепочка</h3>
				<input
					class="input input-bordered"
					type="text"
					minlength="1"
					placeholder="Введите обязательную подстроку языка"
					bind:value={userSubstr}
				/>

                <div class='flex gap-4'>
                    <div>ЛЛ</div>
                    <input type="radio" name="radio-1" class="radio" checked={true} value='l' bind:group={userInputSide}/>
                    <input type="radio" name="radio-1" class="radio" value='r' bind:group={userInputSide}/>
                    <div>ПЛ</div>
                </div>

				<button
					class="btn btn-outline"
					on:click={() => {
                        userGrammarSide = userInputSide
                        console.log(userGrammarSide)
						userGrammar = generateGrammatic(userAlphavit, userSubstr, userGrammarSide);
					}}>Сгенерировать</button
				>
			</div>
		</div>

		<div class="card card-bordered grow bg-base-200">
			<div class="card-body">
				<div class="card-title text-2xl">Просмотр/загрузка грамматики</div>
				<input
					type="file"
					class="file-input file-input-bordered file-input-sm w-full max-w-xs"
					on:change={handleFileChange}
				/>

				<h3 class="mt-4 text-xl font-semibold">VT:</h3>
				{#if userGrammar}
					<div class="flex">
						{#each userGrammar.VT as term}
							<div class="badge flex">{term}</div>
						{/each}
					</div>
				{/if}
				<h3 class="mt-4 text-xl font-semibold">VN:</h3>
				{#if userGrammar}
					<div class="flex">
						{#each userGrammar.VN as nt}
							<div class="badge inline">{nt}</div>
						{/each}
					</div>
				{/if}
				<h3 class="mt-4 text-xl font-semibold">P:</h3>
				{#if userGrammar}
					{#each Object.keys(userGrammar.P) as key}
						<div class="ml-2 flex justify-start gap-2">
							<div>{key}:</div>
							{#each userGrammar.P[key] as variant}
								<div class="badge">{variant}</div>
							{/each}
						</div>
					{/each}
				{/if}
				<h3 class="mt-4 text-xl font-semibold">S:</h3>
				{#if userGrammar}
					<div class="badge">{userGrammar.S}</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="card card-bordered bg-base-200">
		<div class="card-body">
			<div class="card-title text-2xl">Шаг 1: Преобразование к ДКА совместимой грамматике</div>
			<button
				class="btn btn-outline"
				on:click={() => {
					userDKAGrammar = toAutomatGrammatic({ ...userGrammar }, 'r');
				}}>Преобразовать к ДКА форме!</button
			>

			<h3 class="mt-4 text-xl font-semibold">VT:</h3>
			{#if userDKAGrammar}
				<div class="flex">
					{#each userDKAGrammar.VT as term}
						<div class="badge flex">{term}</div>
					{/each}
				</div>
			{/if}
			<h3 class="mt-4 text-xl font-semibold">VN:</h3>
			{#if userDKAGrammar}
				<div class="flex">
					{#each userDKAGrammar.VN as nt}
						<div class="badge inline">{nt}</div>
					{/each}
				</div>
			{/if}
			<h3 class="mt-4 text-xl font-semibold">P:</h3>
			{#if userDKAGrammar}
				{#each Object.keys(userDKAGrammar.P) as key}
					<div class="ml-2 flex justify-start gap-2">
						<div>{key}:</div>
						{#each userDKAGrammar.P[key] as variant}
							<div class="badge">{variant}</div>
						{/each}
					</div>
				{/each}
			{/if}
			<h3 class="mt-4 text-xl font-semibold">S:</h3>
			{#if userDKAGrammar}
				<div class="badge">{userDKAGrammar.S}</div>
			{/if}
		</div>
	</div>
</div>
