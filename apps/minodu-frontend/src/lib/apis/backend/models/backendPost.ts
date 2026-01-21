import type { BackendCategory } from './backendCategory';

export interface BackendTag {
	id: number;
	name: string;
	image: string;
}

export interface BackendPost {
	id: number;
	author: string;
	category: BackendCategory;
	title: string;
	description: string;
	image: string;
	attachment: string;
	attachment_kb: string;
	attachment_pdf: string;
	tags: BackendTag[];
}
