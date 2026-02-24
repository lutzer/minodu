import type { BackendProductDemand } from '$lib/apis/backend/models/backendProductDemand';

export const mockProductDemands: BackendProductDemand[] = [
	{
		id: 1,
		quantity: 50,
		partner: {
			id: 1,
			name: 'Cooperative Agricole Musanze',
			adresse: 'Musanze, Northern Province',
			phone: '+250 788 123 456'
		},
		product: {
			id: 1,
			name: 'Ibirayi (Pommes de terre)',
			description: 'Pommes de terre fraîches de qualité supérieure',
			salesUnit: 'kg',
			image: '/images/products/potatoes.jpg',
			price: 500
		},
		deadline: '2026-03-15T00:00:00.000Z',
		isArchived: false,
		archivedAt: null,
		createdAt: '2026-02-10T08:00:00.000Z',
		updatedAt: '2026-02-10T08:00:00.000Z'
	},
	{
		id: 2,
		quantity: 100,
		partner: {
			id: 2,
			name: 'Marche Central Kigali',
			adresse: 'Nyarugenge, Kigali',
			phone: '+250 788 234 567'
		},
		product: {
			id: 2,
			name: 'Ibishyimbo (Haricots)',
			description: 'Haricots secs de haute qualité',
			salesUnit: 'kg',
			image: '/images/products/beans.jpg',
			price: 800
		},
		deadline: '2026-03-20T00:00:00.000Z',
		isArchived: false,
		archivedAt: null,
		createdAt: '2026-02-12T10:30:00.000Z',
		updatedAt: '2026-02-12T10:30:00.000Z'
	},
	{
		id: 3,
		quantity: 200,
		partner: {
			id: 3,
			name: 'Restaurant Chez Marie',
			adresse: 'Huye, Southern Province',
			phone: '+250 788 345 678'
		},
		product: {
			id: 3,
			name: 'Ibitoki (Bananes)',
			description: 'Bananes plantains pour la cuisine',
			salesUnit: 'kg',
			image: '/images/products/bananas.jpg',
			price: 400
		},
		deadline: '2026-02-28T00:00:00.000Z',
		isArchived: false,
		archivedAt: null,
		createdAt: '2026-02-08T14:15:00.000Z',
		updatedAt: '2026-02-08T14:15:00.000Z'
	},
	{
		id: 4,
		quantity: 30,
		partner: {
			id: 1,
			name: 'Cooperative Agricole Musanze',
			adresse: 'Musanze, Northern Province',
			phone: '+250 788 123 456'
		},
		product: {
			id: 4,
			name: 'Amata (Lait)',
			description: 'Lait frais de vache',
			salesUnit: 'litre',
			image: '/images/products/milk.jpg',
			price: 600
		},
		deadline: '2026-02-25T00:00:00.000Z',
		isArchived: false,
		archivedAt: null,
		createdAt: '2026-02-15T09:00:00.000Z',
		updatedAt: '2026-02-15T09:00:00.000Z'
	},
	{
		id: 5,
		quantity: 75,
		partner: {
			id: 4,
			name: 'Hotel des Mille Collines',
			adresse: 'Kiyovu, Kigali',
			phone: '+250 788 456 789'
		},
		product: {
			id: 5,
			name: 'Imboga (Legumes)',
			description: 'Assortiment de legumes frais',
			salesUnit: 'kg',
			image: '/images/products/vegetables.jpg',
			price: 350
		},
		deadline: '2026-03-01T00:00:00.000Z',
		isArchived: false,
		archivedAt: null,
		createdAt: '2026-02-14T11:45:00.000Z',
		updatedAt: '2026-02-14T11:45:00.000Z'
	},
	{
		id: 6,
		quantity: 25,
		partner: {
			id: 5,
			name: 'Ecole Primaire Nyamirambo',
			adresse: 'Nyamirambo, Kigali',
			phone: '+250 788 567 890'
		},
		product: {
			id: 6,
			name: 'Amagi (Oeufs)',
			description: 'Oeufs frais de poule',
			salesUnit: 'piece',
			image: '/images/products/eggs.jpg',
			price: 150
		},
		deadline: '2026-03-10T00:00:00.000Z',
		isArchived: false,
		archivedAt: null,
		createdAt: '2026-02-16T07:30:00.000Z',
		updatedAt: '2026-02-16T07:30:00.000Z'
	},
	{
		id: 7,
		quantity: 40,
		partner: {
			id: 2,
			name: 'Marche Central Kigali',
			adresse: 'Nyarugenge, Kigali',
			phone: '+250 788 234 567'
		},
		product: {
			id: 7,
			name: 'Umuceri (Riz)',
			description: 'Riz local de qualite',
			salesUnit: 'kg',
			image: '/images/products/rice.jpg',
			price: 1200
		},
		deadline: '2026-03-25T00:00:00.000Z',
		isArchived: false,
		archivedAt: null,
		createdAt: '2026-02-13T16:20:00.000Z',
		updatedAt: '2026-02-13T16:20:00.000Z'
	},
	{
		id: 8,
		quantity: 60,
		partner: {
			id: 3,
			name: 'Restaurant Chez Marie',
			adresse: 'Huye, Southern Province',
			phone: '+250 788 345 678'
		},
		product: {
			id: 1,
			name: 'Ibirayi (Pommes de terre)',
			description: 'Pommes de terre fraîches de qualité supérieure',
			salesUnit: 'kg',
			image: '/images/products/potatoes.jpg',
			price: 500
		},
		deadline: '2026-03-05T00:00:00.000Z',
		isArchived: false,
		archivedAt: null,
		createdAt: '2026-02-11T13:00:00.000Z',
		updatedAt: '2026-02-11T13:00:00.000Z'
	}
];
