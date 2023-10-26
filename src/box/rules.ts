export interface RuleSet {
	weight?: number
	priority?: number
	if: RuleSetGrid
	then: RuleSetGrid
}

export type RuleSetGrid = [string, string, string]


export function compile_rules(rule_sets: RuleSet[], tiles: string[]) {
	for (const rule_set of rule_sets) {
		// TODO
	}
}
