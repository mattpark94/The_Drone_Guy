-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2023 at 07:30 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `drone_guy_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `drone_booking`
--

CREATE TABLE `drone_booking` (
  `booking_id` int(128) NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time(6) NOT NULL,
  `booking_status` varchar(128) NOT NULL,
  `booking_duration` int(11) NOT NULL,
  `booking_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `drone_booking`
--

INSERT INTO `drone_booking` (`booking_id`, `booking_date`, `booking_time`, `booking_status`, `booking_duration`, `booking_user_id`) VALUES
(19, '2023-11-17', '09:00:00.000000', 'booked', 1, 26),
(20, '2023-11-24', '10:00:00.000000', 'booked', 1, 26),
(21, '2023-11-28', '17:00:00.000000', 'booked', 1, 26),
(23, '2023-12-04', '10:00:00.000000', 'booked', 1, 26),
(24, '2023-12-12', '18:00:00.000000', 'booked', 1, 30),
(26, '2023-12-19', '11:00:00.000000', 'booked', 1, 26);

-- --------------------------------------------------------

--
-- Table structure for table `drone_users`
--

CREATE TABLE `drone_users` (
  `user_id` int(11) NOT NULL,
  `user_first_name` varchar(128) NOT NULL,
  `user_last_name` varchar(128) NOT NULL,
  `user_email` varchar(128) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_type` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `drone_users`
--

INSERT INTO `drone_users` (`user_id`, `user_first_name`, `user_last_name`, `user_email`, `user_password`, `user_type`) VALUES
(1, 'admin', 'test', 'admin@test.com', '$2b$10$vBqK03AXDht9o3WvrJAW2OeLYMQh185MYgD.D7gPMRWdMD9eIATlq', 'admin'),
(26, 'change', 'change', 'user@test.com', '$2b$10$BIEc6U4KRCgCyA4Qz7TUouxW1LxibjZ9fgI8mJ7fhF3nGvj6pE8bq', 'user'),
(29, 'change', 'change', 'three@user.com', '$2b$10$r10YRjXv2baRDBqvfYgQ.e8nYVvcBz/NkAIx04Y710zI2B9t1gEjq', 'user'),
(30, 'four ', 'user', 'four@user.com', '$2b$10$LcZI3Ej00QIQFb2t4NNfzuKjq4lUFAclbvu58R3f5CzCQKQnt.nEW', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `drone_booking`
--
ALTER TABLE `drone_booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `booking_user_id` (`booking_user_id`);

--
-- Indexes for table `drone_users`
--
ALTER TABLE `drone_users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `drone_booking`
--
ALTER TABLE `drone_booking`
  MODIFY `booking_id` int(128) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `drone_users`
--
ALTER TABLE `drone_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `drone_booking`
--
ALTER TABLE `drone_booking`
  ADD CONSTRAINT `drone_booking_ibfk_1` FOREIGN KEY (`booking_user_id`) REFERENCES `drone_users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
