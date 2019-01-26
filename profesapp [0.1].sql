-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-01-2019 a las 03:42:36
-- Versión del servidor: 10.1.35-MariaDB
-- Versión de PHP: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `profesapp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `files`
--

CREATE TABLE `files` (
  `idfile` int(11) NOT NULL,
  `idresource` int(11) NOT NULL,
  `filename` char(255) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `files`
--

INSERT INTO `files` (`idfile`, `idresource`, `filename`) VALUES
(3, 11, 'IMG_20190105_052240.jpg'),
(4, 11, 'sqljoinj.peg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resource`
--

CREATE TABLE `resource` (
  `idresource` int(11) NOT NULL,
  `idteacher` int(11) NOT NULL,
  `title` char(255) COLLATE latin1_spanish_ci NOT NULL,
  `author` char(255) COLLATE latin1_spanish_ci NOT NULL,
  `description` char(255) COLLATE latin1_spanish_ci DEFAULT NULL,
  `text` text COLLATE latin1_spanish_ci
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `resource`
--

INSERT INTO `resource` (`idresource`, `idteacher`, `title`, `author`, `description`, `text`) VALUES
(11, 1, 'asdfasdf', 'asdfasdf', 'asdfasdfas', 'dfasdfasdfa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resource_tag`
--

CREATE TABLE `resource_tag` (
  `idresource` int(11) NOT NULL,
  `idtag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `review`
--

CREATE TABLE `review` (
  `idresourcedad` int(11) NOT NULL,
  `idresourceson` int(11) NOT NULL,
  `idroot` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag`
--

CREATE TABLE `tag` (
  `idtag` int(11) NOT NULL,
  `tag` char(255) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teacher`
--

CREATE TABLE `teacher` (
  `idteacher` int(11) NOT NULL,
  `name` char(255) COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci;

--
-- Volcado de datos para la tabla `teacher`
--

INSERT INTO `teacher` (`idteacher`, `name`) VALUES
(1, 'testprofesor');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`idfile`),
  ADD KEY `idresource` (`idresource`) USING BTREE;

--
-- Indices de la tabla `resource`
--
ALTER TABLE `resource`
  ADD PRIMARY KEY (`idresource`) USING BTREE,
  ADD KEY `idteacher` (`idteacher`) USING BTREE;

--
-- Indices de la tabla `resource_tag`
--
ALTER TABLE `resource_tag`
  ADD PRIMARY KEY (`idresource`,`idtag`),
  ADD KEY `idforeings` (`idtag`,`idresource`) USING BTREE;

--
-- Indices de la tabla `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`idresourcedad`,`idresourceson`) USING BTREE,
  ADD KEY `idresourceson` (`idresourceson`,`idresourcedad`) USING BTREE;

--
-- Indices de la tabla `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`idtag`);

--
-- Indices de la tabla `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`idteacher`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `files`
--
ALTER TABLE `files`
  MODIFY `idfile` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `resource`
--
ALTER TABLE `resource`
  MODIFY `idresource` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `tag`
--
ALTER TABLE `tag`
  MODIFY `idtag` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`);

--
-- Filtros para la tabla `resource`
--
ALTER TABLE `resource`
  ADD CONSTRAINT `resource_ibfk_1` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`);

--
-- Filtros para la tabla `resource_tag`
--
ALTER TABLE `resource_tag`
  ADD CONSTRAINT `resource_tag_ibfk_1` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`),
  ADD CONSTRAINT `resource_tag_ibfk_2` FOREIGN KEY (`idtag`) REFERENCES `tag` (`idtag`);

--
-- Filtros para la tabla `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`idresourcedad`) REFERENCES `resource` (`idresource`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`idresourceson`) REFERENCES `resource` (`idresource`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
