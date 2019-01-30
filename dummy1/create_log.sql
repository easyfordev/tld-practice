CREATE TABLE `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dlt_index` int(11) DEFAULT NULL,
  `ecuid` varchar(10) DEFAULT NULL,
  `apid` varchar(10) DEFAULT NULL,
  `subtype` varchar(10) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84023 DEFAULT CHARSET=latin1;

