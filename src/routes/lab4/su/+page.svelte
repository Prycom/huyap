<script lang="ts">

interface Grammar {
  [nonTerminal: string]: [string, string][];
}

    let exSURules: Grammar = {
        'S': [
            ['0S', 'S0'],
            ['1S', 'S1'],
            ['', '']
        ]
    }

    let exSURules1 = {
        'S': [
            ['S+T', 'ST+'],
            ['T', 'T'],
        ],
        'T': [
            ['T*F', 'TF*'],
            ['F', 'F']
        ],
        'F': [
            ['(S)', 'S'],
            ['a', 'a']
        ]
    }

    let exSURules2 = {
        'S': [
            ['(S)', 'S'],
            ['S+S', 'S+S'],
            ['P', 'P']
        ],
        'P': [
            ['(P)', 'P'],
            ['A*A', 'A*A'],
            ['a', 'a']
        ],
        'A': [
            ['(S+S)', '(S+S)'],
            ['P', 'P']
        ]
    }
    let exSURules3 = {
        'S': [
            ['+SS', 'S+S'],
            ['a', 'a']
        ]
    }

    let logs: string [] = []
    let result: string = ''
    
    function perevod(rules: Grammar, input: string){
        logs = []
        let states = Object.keys(rules)
        let chains: [string, string, string[]][] = [['S', 'S', []]] // first input chain; second output chain

        let found = false

        while(chains.length > 0){
            
            let pair = chains.shift() // get chain 
            let inpSeq = pair[0]
            let outSeq = pair[1]
            let history = pair[2]
            

            for(const state of states){ // check every NON TERMINAL
                if(inpSeq.includes(state) && inpSeq.length <= input.length + 2){ // if input sequence contain NON TERMINAL
                    
                    for (const variant of rules[state]){ // replacement variant for input and output sequence
                        let newInp = inpSeq.replace(state, variant[0])
                        let newOut = outSeq.replace(state, variant[1])
                        
                        //console.log(newInp, newOut)
                        chains.push([newInp, newOut, [...history, `Заменили ${state} → ${inpSeq} на ${variant[0]}`]])
                        if (![...newInp].every(char => input.includes(char) || states.includes(char))) continue
                        if(newInp.length > input.length) continue
                        if(newInp === input) {
                            found = true;
                            console.log(`Успех! Вход: ${newInp}, Выход: ${newOut}`);
                            console.log("История замен:", [...history, `Заменили ${state} → ${inpSeq} на ${variant[0]}`]);
                            logs = [...history, `Заменили ${state} → ${inpSeq} на ${variant[0]}`]
                            result = newOut
                            return newOut
                        }

                    }
                }
            }
            if (found) break
        }
        logs = ['Цепочка не принадлежит данному языку']
    }

    let userRules: Grammar
    async function handleFileChange(event: Event) {
		//const file = (event.target as HTMLInputElement)?.files[0];
		const file = (event.target as HTMLInputElement).files?.[0] as File | null;
		if (file) {
			const dkaJson = await file.text();
			userRules = JSON.parse(dkaJson) as Grammar;
			console.log(userRules);
		}
	}

    let userInput: string = ''

    // perevod(exSURules2, '((a+(a*a))*a)')
    //perevod(exSURules3, '++aaa')
</script>

<div class="flex flex-col gap-6 p-6">
    <h2 class="text-3xl font-bold">Синтаксически управляемый перевод</h2>
    
    <label for="mpFileInput" class="btn bg-base-100 shadow-xl">Загрузите СУП</label>
						<input
							type="file"
							id="mpFileInput"
							class="hidden"
							accept=".json"
							on:change={handleFileChange}
						/>

    {#if userRules}
        {#each Object.keys(userRules) as state}
            <div class='flex gap-4 items-center'><strong class='text-xl'>{state}:</strong>

                {#each userRules[state] as variant}
                    <div class='badge text-lg font-semibold'>{variant[0]}|{variant[1]}</div>
                {/each}
            </div>
            {/each}
    {/if}

    <!-- Ввод цепочки -->
    <div>
        <label for="inputString" class="text-xl">Введите входную цепочку:</label>
        <input
            id="inputString"
            type="text"
            class="input input-bordered w-full mt-2"
            bind:value={userInput}
            placeholder="Например, 0101"
        />
    </div>

    <button class="btn btn-primary" on:click={
        () => {
            logs = []
            result = ''
            perevod(userRules, userInput)
        }
    }>Перевести</button>

    <!-- Результат -->
    <div>
        <h3 class="text-2xl">Результат перевода</h3>
        <p class="text-lg"><strong>Выходная цепочка:</strong> {result}</p>
    </div>

    <div>
        <h3 class="text-2xl">Шаги перевода</h3>
        <div class="flex flex-col gap-2">
            {#each logs as log}
                <div class="border p-2 rounded bg-base-200">{log}</div>
            {/each}
        </div>
    </div>
</div>
