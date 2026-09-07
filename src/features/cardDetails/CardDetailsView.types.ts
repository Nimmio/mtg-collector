export type Card = {
	id: string;
	name?: string;
	set_name?: string;
	set?: string;
	collector_number?: string;
	released_at?: string;
	rarity?: string;
	artist?: string;
	mana_cost?: string;
	type_line?: string;
	oracle_text?: string;
	power?: string;
	toughness?: string;
	image_uris?: Record<string, string>;
	prints_search_uri?: string;
	oracle_id?: string;
	card_faces?: Array<{
		name?: string;
		image_uris?: Record<string, string>;
		mana_cost?: string;
		type_line?: string;
		oracle_text?: string;
	}>;
};

export type Printing = Card & { id: string };
export type Finish = "nonfoil" | "foil";

export type CardDetailsViewProps = {
	id: string;
	onSynchronize?: (synchronize: () => Promise<boolean>) => void;
	onBack?: () => void;
	showNavigation?: boolean;
	showVersions?: boolean;
	modal?: boolean;
};
