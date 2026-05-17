-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : sam. 16 mai 2026 à 18:20
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@CHARACTER_SET_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Base de données : `RoomBook`
CREATE DATABASE IF NOT EXISTS `RoomBook`;
USE `RoomBook`;

CREATE TABLE `employes` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `departement` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `employes` (`id`, `nom`, `email`, `departement`) VALUES
(1, 'Ahmed Benali', 'ahmed@entreprise.com', 'Informatique'),
(2, 'Sara El Amrani', 'sara@entreprise.com', 'Marketing'),
(3, 'Youssef Alaoui', 'youssef@entreprise.com', 'Finance'),
(4, 'Imane Tazi', 'imane@entreprise.com', 'RH'),
(5, 'Karim Naciri', 'karim@entreprise.com', 'Développement');

CREATE TABLE `salles` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `capacite` int(11) NOT NULL,
  `equipements` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `salles` (`id`, `nom`, `capacite`, `equipements`) VALUES
(1, 'Salle A', 20, 'Projecteur, Tableau blanc'),
(2, 'Salle B', 10, 'TV, Climatisation'),
(3, 'Salle C', 30, 'Projecteur, Tableau interactif'),
(4, 'Salle Réunion VIP', 15, 'Écran géant, Visioconférence'),
(5, 'Open Space Meeting', 8, 'Table ronde, WiFi');

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `salle_id` int(11) DEFAULT NULL,
  `employe_id` int(11) DEFAULT NULL,
  `date_reservation` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `titre` varchar(200) DEFAULT NULL,
  `statut` enum('en_attente','confirmee','annulee') DEFAULT 'en_attente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `reservations` (`id`, `salle_id`, `employe_id`, `date_reservation`, `heure_debut`, `heure_fin`, `titre`, `statut`) VALUES
(2, 1, 1, '2026-04-12', '10:00:00', '11:30:00', 'Réunion projet', 'confirmee'),
(3, 2, 2, '2026-04-12', '11:00:00', '12:30:00', 'Présentation marketing', 'en_attente'),
(4, 3, 3, '2026-04-13', '14:00:00', '16:00:00', 'Formation interne', 'confirmee'),
(5, 4, 4, '2026-04-14', '10:00:00', '11:00:00', 'Entretien RH', 'annulee'),
(6, 5, 5, '2026-04-15', '15:00:00', '17:00:00', 'Sprint planning', 'confirmee');

ALTER TABLE `employes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `salles`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salle_id` (`salle_id`),
  ADD KEY `employe_id` (`employe_id`);

ALTER TABLE `employes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `salles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`salle_id`) REFERENCES `salles` (`id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`employe_id`) REFERENCES `employes` (`id`);
COMMIT;
