import { RuleSet } from './box/rules'

export const base_rule_tiles = ['B', 'S', 'W', 'V']

export const base_rule_sets = [
	{
		if: [
			'? ? ?',
			'? S ?',
			'? . ?',
		],
		then: [
			'? ? ?',
			'? . ?',
			'? S ?',
		],
	},
	{
		if: [
			'? ? ?',
			'? S ?',
			'? # .',
		],
		then: [
			'? ? ?',
			'? . ?',
			'? # S',
		],
	},
	{
		if: [
			'? ? ?',
			'? S ?',
			'. # ?',
		],
		then: [
			'? ? ?',
			'? . ?',
			'S # ?',
		],
	},
] as RuleSet[]
