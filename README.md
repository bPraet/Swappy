# Swappy
Troc "Tinder-Like"


L’installation du projet est extrêmement simple, il faut que vous ayez nodeJS et npm installés au préalable, ce sont les seuls prérequis. Ensuite, voici la marche à suivre:

Le projet est séparé en 2 dossiers principaux: le backend contient l’API et le frontend l’application React. 
Pour le reste, node_modules contient les dépendances du projet, package.json & package-lock.json contiennent les indications sur les dépendances à installer si vous ne les avez pas et le Readme est identique à ce chapitre sur l’installation.
Pour installer ces fameuses dépendances il faut que vous vous rendiez dans le dossier backend puis frontend et que vous fassiez la commande npm install

Et voilà, si vous voulez lancer le projet avec les serveurs de développement il vous suffit de faire un npm run start dans chacun des dossiers, par défaut les ports utilisés sont: 8000 pour l’API et 3000 pour l’application web. 

Pour ce qui est de l’application mobile, il suffit d’installer le fichier .apk sur votre téléphone !

Pour un déploiement réel il faudra compiler le projet et faire un npm run build avant afin d’avoir la version optimisée de production. La base de données est également déjà en ligne, c’est donc celle utilisée par défaut. 
