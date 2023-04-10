export interface IBrand {
	_id?: string;
	name?: string;
	slug?: string;
	image?: string;
	children?: IBrand[];
	description?: string;
	createdAt?: string;
	updatedAt?: string;
	_v?: string;
}
