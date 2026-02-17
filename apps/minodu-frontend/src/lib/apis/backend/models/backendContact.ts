export interface BackendContact {
	id: number;
	fullname: string;
	gender: string | null;
	phone: string;
	role: {
		id: number;
		name: string;
	};
	status: {
		id: number;
		name: string;
	};
	isContactPerson: boolean;
	lastConnexion: string | null;
}
