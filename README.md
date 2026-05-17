# RoomBook - Gestion de Réservations de Salles

Ce projet propose une interface front-end pour consulter et réserver des salles avec gestion de conflits horaires.

## Fichiers
- `index.html` : interface unique avec planning et formulaire de réservation.
- `index.css` : styles de l'application.
- `index.js` : logique JavaScript de gestion des réservations.
- `RoomBook.sql` : script SQL de la base de données MySQL/MariaDB.

## Fonctionnalités
- Affichage d'un planning hebdomadaire par salle.
- Formulaire de réservation avec sélection de salle, employé, date, heure et statut.
- Détection des conflits horaires avant insertion.
- Liste filtrable des réservations existantes.
- Données de démonstration basées sur le script SQL fourni.

## Import SQL
Pour charger la base de données dans MySQL/MariaDB :

```sql
CREATE DATABASE RoomBook;
USE RoomBook;
SOURCE RoomBook.sql;
```

## Notes
La version front-end simule la logique côté serveur en JavaScript. Les données sont initialisées à partir du script SQL.
