
	/**
	 *
	 * @param alphavit - base alphavit
	 * @param subStr - fixed substring, that should be in grammatic
	 * @param leftSide - choose the type of created grammatic
	 */
	function generateGrammatic(alphavit: string[], subStr: string, side: string): Grammar {
		if (![...subStr].every((char) => alphavit.includes(char))) {
			alert(`Substring '${subStr}' couldn't be created with alphavit [${alphavit}]`);
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
	function generateDKA(gram: Grammar, mult: number, side: string) {
		if (side !== 'r' && side !== 'l') {
			alert('Side should be left or right');
			throw new Error('Side should be left or right');
		}

		let states = {};

		if (side === 'r') {
			//working with right side grammatic
			for (let VN in gram.P) {
				let idx: number = 0; // using idx for generating q indexes and remainder calculing
				let currentState: string = `q_${VN}_${idx % mult}`;
				for (; idx < mult; idx++) {
					// generate states for each remainder
					let nextRemainder: number = (idx + 1) % mult;

					for (let variant of gram.P[VN]) {
						// creating states from each rule transition

						let nextState: string = `q_{}`;
					}
				}
			}
		}

		for (let VN in gram.P) {
			// for each rule
			let idx = 0; // idx % mult = current remainder; (idx + 1) % mult = nex remainder
			for (; idx < mult; idx++) {
				// generate state for each remainder of division
				let currentState: string = `q_${VN}_${idx % mult}`; // means q_(CURRENT_VN)_(CURRENT_REMAINDER)
				let nextRemainder: number = (idx + 1) % mult;

				// find
				gram.VN.some((NT) => {
					if (gram.P[VN][0].includes(NT)) {
						//console.log(`current state: ${currentState}\nnext state: q_${NT}_${nextRemainder}`);
					}
				});

				for (let variant of gram.P[VN]) {
					//console.log(variant);
				}

				//console.log(`${currentState} [${gram.P[VN]}]`);
			}
		}
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

		for (let key in gram.P) {
			// sort so shortest will be first to let algorithm work right
			gram.P[key].sort((a, b) => a.length - b.length);
		}

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

		/* here we will optimize grammatic:
         - from one rule we by one symbol we can go in one new rule (determinism) new state > current state
         - S is always state, where WE DONT HAVE substring
         - A is always state, where WE HAVE substring
         - if we dont have substring, go to S 
        */

		for (let VN in newRules) {
			for (let variant of newRules[VN]) {
				console.log(variant.includes(VN), variant, VN); // check if this variant pass in current state
			}
		}

		let newGrammar: Grammar = gram;

		newGrammar.P = newRules;
		newGrammar.VN = Object.keys(newRules);

		return newGrammar;
	}


	async function handleFileChange(event: Event) {
		//const file = (event.target as HTMLInputElement)?.files[0];
		const file = (event.target as HTMLInputElement).files?.[0] as File | null;
		if (file) {
			const dkaJson = await file.text();
			userGrammar = JSON.parse(dkaJson) as Grammar;
			console.log(userGrammar);
		}
	}

	let test1: Grammar = {
		VT: ['0', '1'],
		VN: ['S', 'A'],
		P: {
			S: ['001A', '0S', '1S'],
			A: ['0A', '1A', '0', '1']
		},
		S: 'S'
	};