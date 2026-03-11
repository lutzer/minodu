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
		kb: 'needs-translation'
	},
	'nav.forum': {
		fr: 'Forum',
		kb: 'needs-translation'
	},
	'nav.weather': {
		fr: 'Météo',
		kb: 'needs-translation'
	},
	'nav.agriculture': {
		fr: 'Agriculture',
		kb: 'needs-translation'
	},
	'nav.market': {
		fr: 'Marché',
		kb: 'needs-translation'
	},

	// Chatbot
	'chatbot.title': {
		fr: 'Chatbot',
		kb: 'needs-translation'
	},
	'chatbot.forPost': {
		fr: 'Chatbot pour id',
		kb: 'needs-translation'
	},
	'chatbot.question': {
		fr: 'Question',
		kb: 'needs-translation'
	},
	'chatbot.answer': {
		fr: 'Réponse',
		kb: 'needs-translation'
	},
	'chatbot.noMessages': {
		fr: "Il n'y a pas encore de messages dans cette conversation",
		kb: 'needs-translation'
	},
	'chatbot.you': {
		fr: 'Vous',
		kb: 'needs-translation'
	},
	'chatbot.botName': {
		fr: 'Minodu Bot',
		kb: 'needs-translation'
	},
	'chatbot.cancelButton': {
		fr: 'Annuler la réponse',
		kb: 'needs-translation'
	},

	// Actions
	'action.record': {
		fr: 'Enregistrer',
		kb: 'needs-translation'
	},
	'action.stop': {
		fr: 'Arrêter',
		kb: 'needs-translation'
	},
	'action.cancel': {
		fr: 'Annuler',
		kb: 'needs-translation'
	},
	'action.send': {
		fr: 'Envoyer',
		kb: 'needs-translation'
	},
	'action.submit': {
		fr: 'Soumettre',
		kb: 'needs-translation'
	},
	'action.clearChat': {
		fr: 'Effacer le chat',
		kb: 'needs-translation'
	},
	'action.ok': {
		fr: 'Ok',
		kb: 'needs-translation'
	},
	'action.delete': {
		fr: 'Supprimer',
		kb: 'needs-translation'
	},

	// Forum
	'forum.loadingText': {
		fr: 'Chargement des messages...',
		kb: 'needs-translation'
	},
	'forum.noPosts': {
		fr: 'Pas encore de messages. Cliquez sur le bouton ci-dessous pour commencer une conversation.',
		kb: 'needs-translation'
	},
	'forum.processingFile': {
		fr: 'Traitement du fichier',
		kb: 'needs-translation'
	},
	'forum.errorProcessingFile': {
		fr: 'Erreur lors du traitement du fichier',
		kb: 'needs-translation'
	},
	'forum.createAuthor': {
		fr: 'Créer un auteur',
		kb: 'needs-translation'
	},
	'forum.name': {
		fr: 'Nom',
		kb: 'needs-translation'
	},
	'forum.avatar': {
		fr: 'Avatar',
		kb: 'needs-translation'
	},
	'forum.yourName': {
		fr: 'Votre nom',
		kb: 'needs-translation'
	},
	'forum.deleteAuthor': {
		fr: 'Supprimer le profil ?',
		kb: 'needs-translation'
	},
	'forum.transcription': {
		fr: 'Transcription',
		kb: 'needs-translation'
	},
	'forum.deletePost': {
		fr: 'Supprimer le message',
		kb: 'needs-translation'
	},
	'forum.errorFileTooLarge': {
		fr: 'Le fichier est trop volumineux (max 5 Mo)',
		kb: 'needs-translation'
	},
	'forum.errorFileUpload': {
		fr: "Erreur lors de l'envoi du fichier",
		kb: 'needs-translation'
	},
	'forum.errorTextTooLong': {
		fr: 'Le texte est trop long (max 5000 caractères)',
		kb: 'needs-translation'
	},
	'forum.errorCreatePost': {
		fr: 'Erreur lors de la création du message',
		kb: 'needs-translation'
	},
	'forum.takePhoto': {
		fr: 'Prendre une photo',
		kb: 'needs-translation'
	},
	'forum.galleryPhoto': {
		fr: 'Galerie de photos',
		kb: 'needs-translation'
	},
	'forum.recordAudio': {
		fr: "Enregistrer l'audio",
		kb: 'needs-translation'
	},

	// Agriculture
	'agriculture.loadingText': {
		fr: 'Chargement des articles...',
		kb: 'needs-translation'
	},
	'agriculture.noPosts': {
		fr: 'Pas de messages dans la catégorie sélectionnée. Veuillez sélectionner une autre catégorie.',
		kb: 'needs-translation'
	},

	// Market
	'market.loadingText': {
		fr: 'Chargement du marché...',
		kb: 'needs-translation'
	},
	'market.noDemands': {
		fr: 'Pas de demandes de produits disponibles.',
		kb: 'needs-translation'
	},
	'market.phone-icon': {
		fr: "Appelez l'administrateur.",
		kb: 'needs-translation'
	},
	'product.demand-image': {
		fr: 'Image du produit demandé',
		kb: 'needs-translation'
	},
	'product.demand-hand-product': {
		fr: 'Quantité demandée',
		kb: 'needs-translation'
	},
	'product.demand-hand-money': {
		fr: 'Prix proposé',
		kb: 'needs-translation'
	},

	// Weather
	'weather.loadingText': {
		fr: 'Chargement de la météo...',
		kb: 'needs-translation'
	},
	'weather.cloud': {
		fr: 'Nuage avec précipitations',
		kb: 'needs-translation'
	},
	'weather.pressureArrow': {
		fr: 'Indicateur de pression',
		kb: 'needs-translation'
	},
	'weather.bird': {
		fr: 'Oiseau météo',
		kb: 'needs-translation'
	},
	'weather.thermometer': {
		fr: 'Thermomètre',
		kb: 'needs-translation'
	},

	// Accessibility / Alt texts
	'alt.playPauseAudio': {
		fr: "Bouton pour démarrer/mettre en pause l'audio",
		kb: 'needs-translation'
	},
	'alt.audioProgress': {
		fr: 'Progression audio',
		kb: 'needs-translation'
	},
	'alt.speakPageInfo': {
		fr: 'Bouton pour lire les informations de la page',
		kb: 'needs-translation'
	},
	'alt.switchLanguage': {
		fr: 'Bouton pour changer de langue',
		kb: 'needs-translation'
	},
	'alt.submitForumPost': {
		fr: 'Soumettre le message du forum',
		kb: 'needs-translation'
	},
	'alt.deleteForumPost': {
		fr: 'Supprimer le message du forum',
		kb: 'needs-translation'
	},
	'alt.chatbotIcon': {
		fr: 'Icône du chatbot',
		kb: 'needs-translation'
	},
	'alt.avatarOfUser': {
		fr: "Avatar de l'utilisateur",
		kb: 'needs-translation'
	},
	'alt.avatarImage': {
		fr: "Image d'un avatar",
		kb: 'needs-translation'
	},
	'alt.imageFor': {
		fr: 'Image pour',
		kb: 'needs-translation'
	},
	'alt.noDescription': {
		fr: 'Pas de description',
		kb: 'needs-translation'
	},
	'alt.tilesShowingApps': {
		fr: '4 tuiles minodu montrant différentes applications',
		kb: 'needs-translation'
	},
	'alt.rainyCloud': {
		fr: 'Un nuage pluvieux dans le ciel',
		kb: 'needs-translation'
	},
	'alt.speechBubble': {
		fr: 'Deux personnes et une bulle de dialogue',
		kb: 'needs-translation'
	},
	'alt.backForumPost': {
		fr: 'retour',
		kb: 'needs-translation'
	},
	'alt.createForumPost': {
		fr: 'Créer un nouveau message',
		kb: 'needs-translation'
	},
	'alt.iconAudioPost': {
		fr: 'Icône pour les messages audio',
		kb: 'needs-translation'
	},
	'alt.iconImagePost': {
		fr: 'Icône pour les messages photo',
		kb: 'needs-translation'
	},
	'alt.iconTextPost': {
		fr: 'Icône pour les messages texte',
		kb: 'needs-translation'
	},
	'alt.clearChatIcon': {
		fr: 'Icône pour effacer la conversation',
		kb: 'needs-translation'
	},
	'alt.expand': {
		fr: 'Développer',
		kb: 'needs-translation'
	},
	'alt.collapse': {
		fr: 'Réduire',
		kb: 'needs-translation'
	},
	'alt.categoryIcon': {
		fr: 'Icône de catégorie pour',
		kb: 'needs-translation'
	},
	'alt.cancelResponse': {
		fr: 'Annuler la réponse du chatbot',
		kb: 'needs-translation'
	},
	'alt.compassNeedle': {
		fr: 'Aiguille de boussole',
		kb: 'needs-translation'
	},
	'alt.soilImage': {
		fr: 'Image du sol',
		kb: 'needs-translation'
	},
	'alt.windTree': {
		fr: 'Arbre au vent',
		kb: 'needs-translation'
	},
	'alt.pressureLine': {
		fr: 'Ligne de pression',
		kb: 'needs-translation'
	},
	'alt.floatingButton': {
		fr: 'Bouton flottant',
		kb: 'needs-translation'
	},
	'alt.closeDialog': {
		fr: 'Fermer le dialogue',
		kb: 'needs-translation'
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
