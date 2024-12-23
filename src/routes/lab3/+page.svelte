<script lang="ts">
	interface DMPA {
		[state: string]: {
			[input: string]: {
				[stackTop: string]: [newState: string, newStackContent: string];
			};
		};
	}

	let exDMPA: DMPA = {
		'q0': { // which state
			'0': { // which input
				'Z': [ // which top of stack
					'q0', // [0] element -> new state
					'0Z', // [1] element -> new stack content
				],
				'0': ['q0', '00']
			},
			'': {
				'Z': ['q0', '']
			},
			'1': { // which input
				'0': [ // which top of stack
					'q1',
					''
				]
			}
		},
		'q1': {
			'1': {
				'0': ['q1', '']
			},
			'': {
				'Z': ['q0', '']
			}
		}
	};

    let logs: string[] = []
    let userInput: string = ''
    let exInput: string = ''

    function checkInputWithDMPA(dmpa: DMPA | null, input: string){
        if (!dmpa){
            alert('Загрузите валидный ДМПА!')
            userInput = ''
            return
        }
        let currentState = 'q0'
        let stack = 'Z'
        logs = [] // clear logs
        let curSymb = input[0]
        for(let i = 0; i < input.length + 1; i++){
            logs = [...logs, `<strong class=''>[?] INFO</strong> <br/>Текущее состояние: <div class='badge'>${currentState}</div><br/>Текущий стек: <div class='badge'>${stack}</div>`] // clear logs
            curSymb = input[i] ? input[i] : ''  // get current input symbol
            if(Object.keys(dmpa).includes(currentState)){ // check if current state defined in dmpa
                let stateContent = dmpa[currentState]
                
                if (Object.keys(stateContent).includes(curSymb)){ // check if we have transition by symbol
                    let stackVariants = stateContent[curSymb]
                    let stackTops = Object.keys(stackVariants)                    
                    
                    let top = stackTops.find((top) => stack.startsWith(top))
                    console.log(top)
                    
                    if(top){ // if we found needed stack top 
                        let newState = stackVariants[top][0]
                        let replacementZ = stackVariants[top][1]
                        console.log(newState, replacementZ)
                        let newStack = stack.replace(top, replacementZ)
                        logs = [...logs, `<strong class=''>[+] УСПЕХ</strong> Переход из <div class='badge'>${currentState}</div> по символу <div class='badge'>${curSymb}</div> и текущему стеку <div class='badge'>${stack}</div> произошёл в <div class='badge'>${newState}</div>;<br/>Обновлённый стек: <div class='badge'>${newStack}</div>`]
                        currentState = newState
                        stack = newStack
                    }else{
                        logs = [...logs, `<strong class='underline'>[!] ОШИБКА</strong> Переход из <div class='badge'>${currentState}</div> по символу <div class='badge'>${curSymb}</div> и текущему стеку <div class='badge'>${stack}</div> не определён`]
                        return
                    }

                }else{
                    logs = [...logs, `<strong class='underline'>[!] ОШИБКА</strong> Переход из <div class='badge'>${currentState}</div> по символу <div class='badge'>${curSymb}</div> не определён`]
                    return
                }

            }else{
                logs = [...logs, `<strong class='underline'>[!] ОШИБКА</strong> Состояние <div class='badge'>${currentState}</div> не в ДМПА!`]
                return
            }
            curSymb = ''
        }
        if (currentState === 'q0' && stack === ''){
            logs = [...logs, `<strong class='underline'>[+] УСПЕХ</strong> Стек опустошен и автомат вернулся в q0`]
            return
        }
    }

    let userDMPA: DMPA | null = null
    
    async function handleFileChange(event: Event) {
		//const file = (event.target as HTMLInputElement)?.files[0];
		const file = (event.target as HTMLInputElement).files?.[0] as File | null;
        if (file) {
			const dkaJson = await file.text();
			userDMPA = JSON.parse(dkaJson) as DMPA;
			console.log(userDMPA);
		}
	}

</script>

<div class="flex w-full flex-col gap-4 p-6 lg:p-12">
	<h2 class="text-3xl font-bold">Лабораторная 3</h2>
	<p class="text-2xl italic">Пример</p>

	<div class="flex flex-col gap-8 lg:flex-row">
        <!-- EXAMPLE AUTOMATON -->
		<div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="card-title mb-2">Автомат:</div>
                <div class='flex flex-wrap gap-1 mb-2'>
                    <strong class=''>Состояние : </strong>
                    <div class='badge'>(входной символ, верхушка стека)</div>
                    ->
                    <div class='badge'>(новое состояние, новая верхушка стека)</div>
                </div>
                {#each Object.keys(exDMPA) as exState}
                    <div class='flex flex-wrap gap-1'>
                        <strong class=''>{exState} : </strong>
                        {#each Object.keys(exDMPA[exState]) as exStateInput}
                            {#each Object.keys(exDMPA[exState][exStateInput]) as exStateInputStack}
                                <div class='badge'>('{exStateInput}', '{exStateInputStack}') -> ({exDMPA[exState][exStateInput][exStateInputStack][0]}, '{exDMPA[exState][exStateInput][exStateInputStack][1]}')</div>, 
                            {/each}
                        {/each}
                    </div>
                {/each}


                <label for='exInput' class='w-1/2 mt-4'>Введите цепочку:</label>
				<input  id='exInput' type='text' class="input input-bordered" bind:value={exInput} on:input={
                    () => {
                        logs = []
                        userInput = ''
                        checkInputWithDMPA(exDMPA, exInput)
                    }
                }/>
			</div>

		</div>
        <!-- EXAMPLE OUTPUT -->
        <div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="card-title mb-2">Вывод:</div>
				<div class="flex flex-wrap gap-2 overflow-scroll">
                    {#if exInput}
                        {#each logs as log}
                            <div class="" bind:innerHTML={log} contenteditable="true"></div>
                        {/each}    
                    {/if}
					
				</div>
			</div>
		</div>
	</div>


    <p class="text-2xl italic">Пользовательский ввод</p>

	<div class="flex flex-col gap-8 lg:flex-row ">
        <!-- USER AUTOMATON -->
		<div class="h-fit card bg-base-200 shadow-xl lg:w-1/2">
			<div class="h-fit card-body gap-4">
				<div class="card-title mb-2">Автомат:</div>
				<label for='dmpaFileInput' class='btn bg-base-100 shadow-xl'>Загрузите ДМПА</label>
                <input type="file" id="dmpaFileInput" class='hidden' accept=".json" on:change={handleFileChange} />
                
                <div class='h-fit flex flex-wrap gap-1 mb-2'>
                    <strong class=''>Состояние : </strong>
                    <div class='badge'>(входной символ, верхушка стека)</div>
                    ->
                    <div class='badge'>(новое состояние, новая верхушка стека)</div>
                </div>
                {#if userDMPA}
                    {#each Object.keys(userDMPA) as exState}
                        <div class='flex flex-wrap gap-1'>
                            <strong class=''>{exState} : </strong>
                            {#each Object.keys(userDMPA[exState]) as exStateInput}
                                {#each Object.keys(userDMPA[exState][exStateInput]) as exStateInputStack}
                                    <div class='badge'>('{exStateInput}', '{exStateInputStack}') -> ({userDMPA[exState][exStateInput][exStateInputStack][0]}, '{userDMPA[exState][exStateInput][exStateInputStack][1]}')</div>, 
                                {/each}
                            {/each}
                        </div>
                    {/each}
                {/if}


                <label for='userInput' class='w-1/2 mt-4'>Введите цепочку:</label>
				<input  id='userInput' type='text' class="input input-bordered" bind:value={userInput} on:input={
                    () => {
                        logs = []
                        exInput = ''
                        checkInputWithDMPA(userDMPA, userInput)
                    }
                }/>
			</div>

		</div>
        <!-- USER OUTPUT -->
        <div class="card bg-base-200 shadow-xl lg:w-1/2">
			<div class="card-body">
				<div class="card-title mb-2">Вывод:</div>
				<div class=" flex flex-wrap gap-2 divide-y divide-base-300 overflow-y-auto">
					{#if userInput}
                        {#each logs as log}
                            <div class="" bind:innerHTML={log} contenteditable="true"></div>
                        {/each}    
                    {/if}
				</div>
			</div>
		</div>
	</div>
</div>
