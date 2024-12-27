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


	/* ---------- USER DATA BLOCK ---------- */

	let userAlphavit: string[] = [];
	let userChar: string = '';
	let userSubstr: string = '';
    let userInput: string = ''
	let userGrammar: Grammar;
    let userMult: number = 1
    let userDKA: DKA

	interface DKA {
		DELTA: { [state: string]: { [symbol: string]: string } }; // here key is state, in object symbol is key and value is target state
		Q: string[];
		V: string[];
		S: string;
		F: string[];
	}


	/* ---------- USER DATA BLOCK ---------- */


	function easyDKAGrammatic(alphavit: string[], subStr: string): Grammar {
		let rules: { [key: string]: string[] } = {};
		let NONTERMINALS: string[] = ['S', 'A'];
		NTsymbIdx = 1;
		// create rules for substring
        
        
        // ??????
        let clearPath: boolean = true
		for (let idx = 0; idx < subStr.length; idx++) {
			let NT = NTsymbols[NTsymbIdx];
			let ch = subStr[idx];

			if (!idx) {
				// create first rule; always S
				rules['S'] = [`${ch}${NT}`];

			} else if (idx !== subStr.length - 1) { // create path to end substring
				rules[NT] = [`${ch}${NTsymbols[NTsymbIdx + 1]}`];
				
                // ?????
                console.log(subStr[idx] !== subStr[idx-1], subStr[idx], subStr[idx-1])
                if (subStr[idx] !== subStr[idx-1]){
                    if (clearPath){
                        rules[NT].push(`${subStr[idx-1]}${NT}`)
                        clearPath = false
                        console.log(rules)
                    } 
                }

                NTsymbIdx += 1;
                NONTERMINALS.push(NT);

			} else { // ending of substring
				rules[NT] = [`${ch}A`];

                // ?????
                if (subStr[idx] !== subStr[idx-1]){
                    if (clearPath){
                        rules[NT].push(`${subStr[idx-1]}${NT}`)
                        clearPath = false
                        console.log(rules)
                    } 
                }

				NONTERMINALS.push(NT);
			}
		}
		// generate rules for backing to S (start state)
		for (let VN in rules) {
			for (let char of alphavit) {
				if ( !rules[VN].some( (variant) => variant.includes(char)) ) rules[VN].push(`${char}S`);
                /*
                if (!rules[VN][0].includes(char)) {
					// rules[VN][0] - only element;
					rules[VN].push(`${char}S`);
				}
                */
			}
		}
		// generate A rule (for ending state)
		rules['A'] = [];
		for (let char of alphavit) {
			rules['A'].push(char);
			rules['A'].push(`${char}A`);
		}
		let gram: Grammar = {
			VT: alphavit,
			VN: NONTERMINALS,
			S: 'S',
			P: rules
		};
		// console.log(gram);
		return gram;
	}

	/**
	 * ## Works with right side grammatic!!!
	 *
	 * @param gram
	 * @param mult
	 */
	function easyDKA(gram: Grammar, mult: number, alphavit: string[]) : DKA {
		interface Transition {
			[symbol: string]: string;
		}

		interface Transitions {
			[state: string]: Transition;
		}
		// only right side grammatic
		let Q: string[] = [];
		let transitions: Transitions = {};
		let remainder = 0;

		for (let VN of gram.VN) {
			// console.log('Current rule:', VN);
			// console.log(gram.P[VN]);
			for (let idx = 0; idx < mult; idx++) {
				let currentState = `q_${VN}_${idx}`; // calc current state
				
				for (let variant of gram.P[VN]) {
					// each variant to go from current state
					if (variant.length === 1) continue; // skip ending gramatic
					let newState: string = `q_${variant[1]}_${(idx + 1) % mult}`;
					let char: string = variant[0];

					transitions[currentState] = {
						...transitions[currentState],
						[char]: newState
					};

				}
			}
		}
        let dka: DKA = {
            Q: Q,
            F: ['q_A_0'],
            S: 'q_S_0',
            DELTA: transitions,
            V: alphavit
        }
		console.log(dka);
        return dka
	}

    let logs: string[] = []

    function checkChain(dka: DKA, input: string){
        logs = []
        let currentState = 'q_S_0'
        for (let char of input){
            if(dka.V.includes(char)){
                let nextState: string = dka.DELTA[currentState][char]
                logs = [...logs, `Переход из ${currentState} в ${nextState} по символу ${char}`]
                currentState = nextState
            }else{
                logs = [...logs, `[!] ОШИБКА! Символ ${char} не входит в алфавит ${dka.V}`]
                break
            }
        }
        let data: string[] = currentState.split('_')
        if (currentState === 'q_A_0')logs = [...logs, `[+ ]УСПЕХ! Цепочка ${input} принадлежит языку!`]
        else {
            if (data[1] !== 'A')logs = [...logs, `[!] ОШИБКА! Цепочка ${input} не содержит ${userSubstr}!`]
            if (data[2] !== '0')logs = [...logs, `[!] ОШИБКА! Цепочка ${input} не кратна ${userMult}!`]
            logs = [...logs, `[!] ОШИБКА! Автомат остановился в ${currentState}!`]
        }
    }

</script>

<div class="flex flex-row flex-wrap gap-4 p-6">
	<div class="flex w-full flex-col gap-4 lg:flex-row">
		<!-- USER INPUT ALPHAVIT -->
		<div class="card card-bordered w-full bg-base-200">
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
                            if (userAlphavit.includes(userChar)){
                                alert('Символы алфавита должны быть уникальными!')
                            }else{
                                userAlphavit = [...userAlphavit, userChar];
                                userChar = '';
                            }
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

                <h3 class="mt-4 text-xl font-semibold">Число кратности</h3>
				<input
					class="input input-bordered"
					type="number"
                    min='1'
					placeholder="Введите число, которому будут кратны длины цепочек"
					bind:value={userMult}
				/>

				<button
					class="btn btn-outline"
					on:click={() => {
                        // add checks!!!
                        if(![...userSubstr].every((char) => userAlphavit.includes(char))){
                            
			                alert(`Подстроку '${userSubstr}' нельзя создать из [${userAlphavit}]`);
                        }else{
                            userGrammar = easyDKAGrammatic(userAlphavit, userSubstr);
                        }
					}}>Сгенерировать</button
				>
			</div>
		</div>

		<div class="card card-bordered w-full bg-base-200">
			<div class="card-body">
				<div class="card-title text-2xl">Просмотр грамматики</div>

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

	<div class="flex w-full flex-col gap-4 lg:flex-row">

		<div class="card card-bordered w-full bg-base-200">
			<div class="card-body">
				<div class="card-title text-2xl">ДКА на основе грамматики</div>
				<button class="btn btn-outline" on:click={
                    () => {
                        userDKA = easyDKA(userGrammar, userMult, userAlphavit)
                    }
                }>Построить ДКА!</button>

                {#if userDKA}
                    <div class='overflow-x-auto'>
                        <table class='table'>
                            <!-- TABLE HEAD -->
                            <thead>
                                <tr>
                                    <th></th>
                                    {#each userDKA.V as symbol }
                                        <th>{symbol}</th>
                                    {/each}
                                </tr>
                            </thead>
                            <tbody>
                                {#each Object.keys( userDKA.DELTA ) as state}
                                    <tr>
                                        <th>{state}</th>
                                        {#each Object.keys( userDKA.DELTA[state] ) as symbol}
                                            <td>
                                                { userDKA.DELTA[state][symbol] }
                                            </td>
                                        {/each}
                                    </tr>
                                        
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
			</div>
		</div>


        <div class="card card-bordered w-full bg-base-200">
			<div class="card-body">
				<div class="card-title text-2xl">Ввод цепочек</div>
				<input
					class="input input-bordered"
					type="text"
					minlength="1"
					placeholder="Введите обязательную подстроку языка"
					bind:value={userInput}
                    on:input={
                        () => {
                            if(userDKA && userInput) checkChain(userDKA, userInput)
                        }
                    }
				/>
                <div class='flex flex-col gap-2 border-dotted border-base-300 rounded'>
                    {#each logs as log}
                        <p class='font-semibold italic '>{log}</p>
                    {/each}
                </div>
			</div>
		</div>
	</div>
</div>
