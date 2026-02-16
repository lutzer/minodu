export interface BackendPartner {
	id: number;
	name: string;
	adresse: string;
	phone: string;
}

export interface BackendProduct {
	id: number;
	name: string;
	description: string;
	salesUnit: string;
	image: string;
	price: number;
}

export interface BackendProductDemand {
	id: number;
	quantity: number;
	partner: BackendPartner;
	product: BackendProduct;
	deadline: string;
	isArchived: boolean;
	archivedAt: string | null;
	createdAt: string;
	updatedAt: string;
}
