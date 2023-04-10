export interface IProduct {
	_id?: string;
	name?: string;
	price?: number | string;
	discount?: number;
	slug?: string;
	thumbnail?: string | object;
	description?: string;
	attributes?: [];
	assets?: [];
	status?: number;
	categoryId?: string;
	brandId?: string;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string;
	deleted?: boolean;
	_v?: string;
}
