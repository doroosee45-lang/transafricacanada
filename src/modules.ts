export const modules: Record<string,{title:string; description:string; features:string[]}> = {
colis:{title:'Mes colis',description:'Suivez vos colis et consultez leur historique.',features:['Référence et statut','Chronologie des événements','Expédition et livraison']},
expeditions:{title:'Expéditions',description:'Consultez les étapes de transport.',features:['Parcours et étapes','Informations de vol disponibles','Anomalies et arrivée']},
devis:{title:'Devis et factures',description:'Retrouvez vos documents et leurs conditions.',features:['Devis et expiration','Factures et justificatifs','Historique']},
paiements:{title:'Paiements',description:'Consultez les paiements confirmés par le service financier.',features:['Montant et devise','État vérifié par le serveur','Reçus']},
notifications:{title:'Notifications',description:'Retrouvez les mises à jour de vos opérations.',features:['Événements des colis','Devis et paiements','Actions attendues']},
agences:{title:'Agences',description:'Consultez les coordonnées et horaires des agences.',features:['Pays et adresse','Horaires','Coordonnées']},
profil:{title:'Mon profil',description:'Gérez vos informations et vos adresses.',features:['Coordonnées','Adresses','Préférences de communication']},
support:{title:'Assistance',description:'Contactez le support concernant vos opérations.',features:['Questions','Réclamations','Historique des échanges']},
operations:{title:'Opérations terrain',description:'Accédez aux tâches attribuées.',features:['Opérations affectées','Réception et prise en charge','Historique des actions']},
scan:{title:'Scanner un colis',description:'Lisez un QR code ; son association à un colis nécessite le service.',features:['Lecture QR','Vérification des autorisations à intégrer','Actions nécessitant le service']},
livraison:{title:'Livraison et preuves',description:'Enregistrez une preuve uniquement lorsque vous y êtes autorisé.',features:['Photographie ou signature','Validation du justificatif','Confirmation serveur']},
synchronisation:{title:'Synchronisation',description:'Suivez les opérations terrain en attente de validation.',features:['Opérations en attente','Opérations rejetées','Gestion des conflits']},
supervision:{title:'Supervision',description:'Consultez les indicateurs autorisés pour votre périmètre.',features:['Activité des agences','Opérations en attente','Anomalies et rapports']}
};
