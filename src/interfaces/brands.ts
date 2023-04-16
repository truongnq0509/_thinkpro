export interface IBrand {
	_id?: string;
	name?: string;
	slug?: string;
	image?: {
		path: string;
		filename: string;
	};
	children?: IBrand[];
	description?: string;
	createdAt?: string;
	updatedAt?: string;
	_v?: string;
}
