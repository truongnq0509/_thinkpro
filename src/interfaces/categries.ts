export interface ICategory {
	_id?: string;
	name?: string;
	slug?: string;
	image?: {
		path: string;
		filename: string;
	};
	description?: string;
	createdAt?: string;
	updatedAt?: string;
	_v?: string;
}
