CREATE TABLE `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dlt_index` int(11) DEFAULT NULL,
  `ecuid` varchar(10) DEFAULT NULL,
  `apid` varchar(10) DEFAULT NULL,
  `subtype` varchar(10) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42738 DEFAULT CHARSET=latin1;
CREATE TABLE `history_meta` (
  `hid` int(11) NOT NULL AUTO_INCREMENT,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `itv` int(11) DEFAULT NULL,
  PRIMARY KEY (`hid`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;
CREATE TABLE `history_data` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `hid` int(11) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `attr` varchar(40) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`did`)
) ENGINE=InnoDB AUTO_INCREMENT=1485 DEFAULT CHARSET=latin1;
