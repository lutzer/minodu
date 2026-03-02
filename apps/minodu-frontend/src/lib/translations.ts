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
	'chatbot.noMessages': {
		fr: "Il n'y a pas encore de messages dans cette conversation",
		kb: 'Nta butumwa buriho muri iki kiganiro'
	},
	'chatbot.you': {
		fr: 'Vous',
		kb: 'Wowe'
	},
	'chatbot.botName': {
		fr: 'Minodu Bot',
		kb: 'Minodu Bot'
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
	'forum.yourName': {
		fr: 'Votre nom',
		kb: 'Votre nom'
	},
	'forum.deleteAuthor': {
		fr: 'Supprimer le profil ?',
		kb: 'Supprimer le profil ?'
	},
	'forum.transcription': {
		fr: 'Transcription',
		kb: 'Transcription'
	},
	'forum.deletePost': {
		fr: 'Supprimer le message',
		kb: 'Supprimer le message'
	},
	'forum.errorFileTooLarge': {
		fr: 'Le fichier est trop volumineux (max 5 Mo)',
		kb: 'Dosiye irenze urugero (max 5 Mo)'
	},
	'forum.errorFileUpload': {
		fr: "Erreur lors de l'envoi du fichier",
		kb: 'Ikosa mu kohereza dosiye'
	},
	'forum.errorTextTooLong': {
		fr: 'Le texte est trop long (max 5000 caractères)',
		kb: 'Inyandiko ni ndende cyane (max 5000)'
	},
	'forum.errorCreatePost': {
		fr: 'Erreur lors de la création du message',
		kb: 'Ikosa mu gukora ubutumwa'
	},

	// Agriculture
	'agriculture.noPosts': {
		fr: 'Pas de messages dans la catégorie sélectionnée. Veuillez sélectionner une autre catégorie.',
		kb: 'Nta butumwa mu cyiciro wahisemo. Hitamo ikindi cyiciro.'
	},

	// Market
	'market.noDemands': {
		fr: 'Pas de demandes de produits disponibles.',
		kb: 'Nta bisabwa biboneka.'
	},
	'market.phone-icon': {
		fr: 'Appelez l\'administrateur.',
		kb: 'Nta bisabwa biboneka.'
	},
	'product.demand-image': {
		fr: 'Image du produit demandé',
		kb: 'Ishusho y\'igicuruzwa gisabwa'
	},
	'product.demand-hand-product': {
		fr: 'Quantité demandée',
		kb: 'Ingano isabwa'
	},
	'product.demand-hand-money': {
		fr: 'Prix proposé',
		kb: 'Igiciro gitangwa'
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
	},
	'alt.backForumPost': {
		fr: 'retour',
		kb: 'retour'
	},
	'alt.createForumPost': {
		fr: 'Créer un nouveau message',
		kb: 'Kora ubutumwa bushya'
	},
	'alt.iconAudioPost': {
		fr: 'Icône pour les messages audio',
		kb: 'Ishusho yo kohereza amajwi'
	},
	'alt.iconImagePost': {
		fr: 'Icône pour les messages photo',
		kb: 'Ishusho yo kohereza ifoto'
	},
	'alt.iconTextPost': {
		fr: 'Icône pour les messages texte',
		kb: 'Ishusho yo kohereza inyandiko'
	},
	'alt.clearChatIcon': {
		fr: 'Icône pour effacer la conversation',
		kb: 'Ishusho yo gusiba ikiganiro'
	},
	'alt.expand': {
		fr: 'Développer',
		kb: 'Kwerekana byose'
	},
	'alt.collapse': {
		fr: 'Réduire',
		kb: 'Kugabanya'
	},
	'alt.categoryIcon': {
		fr: 'Icône de catégorie pour',
		kb: 'Ishusho yicyiciro cya'
	},
	'alt.cancelResponse': {
		fr: 'Annuler la réponse du chatbot',
		kb: 'annuler la réponse du chatbot'
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
