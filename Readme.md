
# Music Room
A Music playlist sharing crossplatform app in react-native & nodeJs 

## Usage

``git clone https://github.com/Alhuin/MusicRoom.git``<br/>
``cd MusicRoom``<br/>
``npm install``<br/>
``npm start``<br/>

in another shell instance :<br/>
``react-native run-ios``

## Views

 - Inscription ( premiere visite )
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
A[Premiere visite] --> B[Inscription : Oauth2 / Email - passwd -> Mail confirmation]
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
