
# Music Room
A Music playlist sharing crossplatform app in react-native & nodeJs 

## Set Up de l'environnement

### Back

``cd MusicRoom/Back``<br/>
``npm install``<br/>
installer mongodb https://docs.mongodb.com/manual/installation/<br/>
``mkdir /data/db``<br/>
``mongod`` (lance une instance de la base de données)<br/> 
``npm start`` (va lancer le serveur express sur le port 3000)<br/>
``./ngrock http 3000`` ( assigne une adresse externe au serveur qui tourne sur le port 3000)<br/>

PS: tout ça même pas besoin de le faire pour vous si je le run de chez moi.

###Front

``cd MusicRoom/Front``<br/>
``export ANDROID_SDK_ROOT=/Users/julien/Library/Android/sdk`` (sur mac)<br/>
``npm install``<br/>
``npm start``<br/>
Connexion au Back : changer l’adresse du serveur ngrock dans API/Api.js ligne 1<br/>

dans un autre terminal, dans /Front :<br/>
``react-native run-android``<br/>

dans un autre terminal, encore dans /Front : 	<br/>
``react-native log-android`` (affichera les sorties de la console)<br/><br/>

doc de l’Api https://documenter.getpostman.com/view/6579841/S1a7UQAv?version=latest#authentication<br/>

## Views

 - Connexion ( premiere visite )
 - Connexion ( visites futures )
 - Choix du service 
	 - **Music Track Vote** : Génération live d’enchainement de musiques par vote. 
	 - **Music Control Delegation** : Délégation du contrôle de l’écoute. 
	 -  **Music Playlist Editor** : Édition de playlists à plusieurs en temps réel.
 - Page de profil
 - Page modification des comptes liés

## Structure

```mermaid
graph LR
A[Premiere visite] --> B[Connexion : Oauth2 / Email - passwd -> Mail confirmation]
B --> C[Rattacher compte Deezer +? Autre réseau]
C --> E
D[Visites futures] --> E[Connexion: Oauth2 / Email-passwd]

```

---

```mermaid
graph TD
A[Home] --> B[Choix du service]
A -->F[Page de Profil]
F -->G[Modifier comptes liés]
F -->H[Changer de mot de passe]
B --> C[Music Track Vote]
B --> D[Music Control Delegation]
B --> E[Music Playlist Editor]

```
