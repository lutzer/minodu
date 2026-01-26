import type { Language, Optional } from './types';

type TranslationStrings = {
	[key: string]: {
		fr: string;
		kb: string;
	};
};

const translations: TranslationStrings = {
	// Navigation
	'nav.home': {
		fr: 'Accueil',
		kb: 'Ahabanza'
	},
	'nav.forum': {
		fr: 'Forum',
		kb: 'Inama'
	},
	'nav.weather': {
		fr: 'Météo',
		kb: 'Ikirere'
	},
	'nav.agriculture': {
		fr: 'Agriculture',
		kb: 'Ubuhinzi'
	},
	'nav.market': {
		fr: 'Marché',
		kb: 'Isoko'
	},

	// Chatbot
	'chatbot.title': {
		fr: 'Chatbot',
		kb: 'Chatbot'
	},
	'chatbot.forPost': {
		fr: 'Chatbot pour id',
		kb: 'Chatbot ku id'
	},
	'chatbot.question': {
		fr: 'Question',
		kb: 'Ikibazo'
	},
	'chatbot.answer': {
		fr: 'Réponse',
		kb: 'Igisubizo'
	},

	// Actions
	'action.record': {
		fr: 'Enregistrer',
		kb: 'Fata amajwi'
	},
	'action.stop': {
		fr: 'Arrêter',
		kb: 'Hagarika'
	},
	'action.cancel': {
		fr: 'Annuler',
		kb: 'Kureka'
	},
	'action.send': {
		fr: 'Envoyer',
		kb: 'Ohereza'
	},
	'action.submit': {
		fr: 'Soumettre',
		kb: 'Ohereza'
	},
	'action.clearChat': {
		fr: 'Effacer le chat',
		kb: 'Siba ikiganiro'
	},
	'action.ok': {
		fr: 'Ok',
		kb: 'Yego'
	},
	'action.delete': {
		fr: 'Supprimer',
		kb: 'Supprimer'
	},

	// Forum
	'forum.noPosts': {
		fr: 'Pas encore de messages. Cliquez sur le bouton ci-dessous pour commencer une conversation.',
		kb: 'Nta butumwa buriho. Kanda kuri buto hepfo utangire ikiganiro.'
	},
	'forum.processingFile': {
		fr: 'Traitement du fichier',
		kb: 'Gutunganya dosiye'
	},
	'forum.errorProcessingFile': {
		fr: 'Erreur lors du traitement du fichier',
		kb: 'Ikosa mu gutunganya dosiye'
	},
	'forum.createAuthor': {
		fr: 'Créer un auteur',
		kb: 'Kora umwanditsi'
	},
	'forum.name': {
		fr: 'Nom',
		kb: 'Izina'
	},
	'forum.avatar': {
		fr: 'Avatar',
		kb: 'Ishusho'
	},
	'forum.yourName' : {
		fr: 'Votre nom',
		kb: 'Votre nom'
	},
	'forum.deleteAuthor' : {
		fr: 'Supprimer le profil ?',
		kb: 'Supprimer le profil ?'
	},

	// Agriculture
	'agriculture.noPosts': {
		fr: 'Pas de messages dans la catégorie sélectionnée. Veuillez sélectionner une autre catégorie.',
		kb: 'Nta butumwa mu cyiciro wahisemo. Hitamo ikindi cyiciro.'
	},

	// Accessibility / Alt texts
	'alt.playPauseAudio': {
		fr: "Bouton pour démarrer/mettre en pause l'audio",
		kb: 'Buto yo gutangira/guhagarika amajwi'
	},
	'alt.audioProgress': {
		fr: 'Progression audio',
		kb: 'Aho amajwi ageze'
	},
	'alt.speakPageInfo': {
		fr: 'Bouton pour lire les informations de la page',
		kb: "Buto yo gusoma amakuru y'urupapuro"
	},
	'alt.switchLanguage': {
		fr: 'Bouton pour changer de langue',
		kb: 'Buto yo guhindura ururimi'
	},
	'alt.submitForumPost': {
		fr: 'Soumettre le message du forum',
		kb: "Ohereza ubutumwa bw'inama"
	},
	'alt.deleteForumPost': {
		fr: 'Supprimer le message du forum',
		kb: "Siba ubutumwa bw'inama"
	},
	'alt.chatbotIcon': {
		fr: 'Icône du chatbot',
		kb: 'Ishusho ya chatbot'
	},
	'alt.avatarOfUser': {
		fr: "Avatar de l'utilisateur",
		kb: "Ishusho y'ukoresha"
	},
	'alt.avatarImage': {
		fr: "Image d'un avatar",
		kb: "Image d'un avatar"
	},
	'alt.imageFor': {
		fr: 'Image pour',
		kb: 'Ishusho ya'
	},
	'alt.noDescription': {
		fr: 'Pas de description',
		kb: 'Nta bisobanuro'
	},
	'alt.tilesShowingApps': {
		fr: '4 tuiles minodu montrant différentes applications',
		kb: '4 tiles za minodu zerekana porogaramu zitandukanye'
	},
	'alt.rainyCloud': {
		fr: 'Un nuage pluvieux dans le ciel',
		kb: 'Igicu gifite imvura mu kirere'
	},
	'alt.speechBubble': {
		fr: 'Deux personnes et une bulle de dialogue',
		kb: "Abantu babiri n'igishushanyo cy'ikiganiro"
	}
};

export function t(key: string, language: Optional<Language>): string {
	if (!language) {
		return '';
	}
	const translation = translations[key];
	if (!translation) {
		console.warn(`Translation missing for key: ${key}`);
		return key;
	}
	return translation[language];
}

export default translations;
