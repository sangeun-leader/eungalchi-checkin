import { useState, useEffect } from "react";

const STUDENTS = [
  { id:1,  name:"김주하",     class:"도원중3 최강4실",    grade:"중3", school:"도원중", teacher:"김도은", parent:"010-4026-3217" },
  { id:2,  name:"백재후",     class:"도원중3 최강4실",    grade:"중3", school:"도원중", teacher:"김도은", parent:"010-8426-0114" },
  { id:3,  name:"윤도윤",     class:"도원중3 최강4실",    grade:"중3", school:"도원중", teacher:"김도은", parent:"010-3543-0086" },
  { id:4,  name:"조연서",     class:"도원중3 최강4실",    grade:"중3", school:"도원중", teacher:"김도은", parent:"010-2734-9287" },
  { id:5,  name:"이승아",     class:"도원중3 최강4실",    grade:"중3", school:"도원중", teacher:"김도은", parent:"010-3189-2450" },
  { id:6,  name:"장수현",     class:"도원중3 최강4실",    grade:"중3", school:"도원중", teacher:"김도은", parent:"010-2528-8032" },
  { id:7,  name:"이소이",     class:"도원중3 최강4실",    grade:"중3", school:"도원중", teacher:"김도은", parent:"010-7228-8463" },
  { id:8,  name:"이민정",     class:"도원중3 보라돌이",   grade:"중3", school:"도원중", teacher:"박혜린", parent:"010-8840-9693" },
  { id:9,  name:"권율하",     class:"도원중3 보라돌이",   grade:"중3", school:"도원중", teacher:"박혜린", parent:"010-3710-8070" },
  { id:10, name:"박도은",     class:"도원중3 보라돌이",   grade:"중3", school:"도원중", teacher:"박혜린", parent:"010-8560-1575" },
  { id:11, name:"이서현",     class:"도원중3 보라돌이",   grade:"중3", school:"도원중", teacher:"박혜린", parent:"010-8565-1018" },
  { id:12, name:"이신민",     class:"도원중3 보라돌이",   grade:"중3", school:"도원중", teacher:"박혜린", parent:"010-2818-7023" },
  { id:13, name:"이서빈",     class:"도원중3 보라돌이",   grade:"중3", school:"도원중", teacher:"박혜린", parent:"010-2514-0173" },
  { id:14, name:"김서영",     class:"도원중3 보라돌이",   grade:"중3", school:"도원중", teacher:"박혜린", parent:"010-2948-4329" },
  { id:15, name:"이서준",     class:"도원중3 공주",       grade:"중3", school:"도원중", teacher:"노미진", parent:"010-2672-1697" },
  { id:16, name:"원세희",     class:"도원중3 공주",       grade:"중3", school:"도원중", teacher:"노미진", parent:"010-2004-5055" },
  { id:17, name:"이하영",     class:"도원중3 공주",       grade:"중3", school:"도원중", teacher:"노미진", parent:"010-2535-8850" },
  { id:18, name:"윤하연",     class:"도원중3 공주",       grade:"중3", school:"도원중", teacher:"노미진", parent:"010-2725-2294" },
  { id:19, name:"황서후",     class:"도원중3 공주",       grade:"중3", school:"도원중", teacher:"노미진", parent:"010-9304-8390" },
  { id:20, name:"김효현",     class:"도원중3 공주",       grade:"중3", school:"도원중", teacher:"노미진", parent:"010-6677-4668" },
  { id:21, name:"한승주",     class:"도원중3 공주",       grade:"중3", school:"도원중", teacher:"노미진", parent:"010-8831-7820" },
  { id:22, name:"류아인",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-4119-1722" },
  { id:23, name:"김도엽",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-5027-1935" },
  { id:24, name:"정은우",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-6383-0275" },
  { id:25, name:"허종욱",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-3812-0476" },
  { id:26, name:"김민지",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-2355-1741" },
  { id:27, name:"원종우",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-4626-3049" },
  { id:28, name:"박도하",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-3554-9094" },
  { id:29, name:"조민채",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-9891-7470" },
  { id:30, name:"김해림",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-9390-9524" },
  { id:31, name:"허태민",     class:"도원중2 노사모",     grade:"중2", school:"도원중", teacher:"노미진", parent:"010-8355-4589" },
  { id:32, name:"한채은",     class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-8573-8915" },
  { id:33, name:"강아인",     class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-9118-2428" },
  { id:34, name:"송채은",     class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-8566-6716" },
  { id:35, name:"최유리",     class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-2501-4558" },
  { id:36, name:"손지안",     class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-3751-7770" },
  { id:37, name:"이서연",     class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-2519-7893" },
  { id:38, name:"이훤",       class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-3535-2739" },
  { id:39, name:"전은나",     class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-9975-1010" },
  { id:40, name:"최민",       class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-9005-7928" },
  { id:41, name:"양재욱",     class:"도원중2 금갈치",     grade:"중2", school:"도원중", teacher:"김도은", parent:"010-9938-2846" },
  { id:42, name:"김가빈",     class:"도원중1 도원참치",   grade:"중1", school:"도원중", teacher:"노미진", parent:"010-9378-8965" },
  { id:43, name:"이해린",     class:"도원중1 도원참치",   grade:"중1", school:"도원중", teacher:"노미진", parent:"010-4061-6116" },
  { id:44, name:"정경서",     class:"도원중1 도원참치",   grade:"중1", school:"도원중", teacher:"노미진", parent:"010-9253-5958" },
  { id:45, name:"조예현",     class:"도원중1 도원참치",   grade:"중1", school:"도원중", teacher:"노미진", parent:"010-7279-7831" },
  { id:46, name:"김민규",     class:"도원중1 도원참치",   grade:"중1", school:"도원중", teacher:"노미진", parent:"010-2641-5905" },
  { id:47, name:"이지아",     class:"도원중1 도원참치",   grade:"중1", school:"도원중", teacher:"노미진", parent:"010-9998-1463" },
  { id:48, name:"최민준",     class:"도원중1 도원참치",   grade:"중1", school:"도원중", teacher:"노미진", parent:"010-2012-7571" },
  { id:49, name:"이채린",     class:"도원중1 도원참치",   grade:"중1", school:"도원중", teacher:"노미진", parent:"010-3526-8904" },
  { id:50, name:"김민정",     class:"도원중1 강쥐",       grade:"중1", school:"도원중", teacher:"김도은", parent:"010-8853-0081" },
  { id:51, name:"조현서",     class:"도원중1 강쥐",       grade:"중1", school:"도원중", teacher:"김도은", parent:"010-2864-4752" },
  { id:52, name:"박지솔",     class:"도원중1 강쥐",       grade:"중1", school:"도원중", teacher:"김도은", parent:"010-6672-6123" },
  { id:53, name:"고소현",     class:"도원중1 강쥐",       grade:"중1", school:"도원중", teacher:"김도은", parent:"010-6690-9757" },
  { id:54, name:"신현승",     class:"도원중1 강쥐",       grade:"중1", school:"도원중", teacher:"김도은", parent:"010-6504-6382" },
  { id:55, name:"황나겸",     class:"도원중1 강쥐",       grade:"중1", school:"도원중", teacher:"김도은", parent:"010-9337-2384" },
  { id:56, name:"조유정",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-7192-0830" },
  { id:57, name:"김교선",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-4811-3452" },
  { id:58, name:"정희원(큰)", class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-8689-3246" },
  { id:59, name:"서채원",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-3524-3859" },
  { id:60, name:"함윤슬",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-2924-2825" },
  { id:61, name:"석아윤",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-7927-3172" },
  { id:62, name:"박현서",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-9567-3333" },
  { id:63, name:"정연진",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-7134-5393" },
  { id:64, name:"정희원(작)", class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-6642-1767" },
  { id:65, name:"이시은",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-2505-6829" },
  { id:66, name:"조민재",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-5097-2697" },
  { id:67, name:"한석주",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-8831-7820" },
  { id:68, name:"김도완",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-2797-4869" },
  { id:69, name:"김채린",     class:"도원고3",            grade:"고3", school:"도원고", teacher:"김상은", parent:"010-6543-5795" },
  { id:70, name:"이상헌",     class:"도원고2 하츄핑",     grade:"고2", school:"도원고", teacher:"박혜린", parent:"010-6277-1676" },
  { id:71, name:"김서준",     class:"도원고2 하츄핑",     grade:"고2", school:"도원고", teacher:"박혜린", parent:"010-2344-2771" },
  { id:72, name:"허단",       class:"도원고2 하츄핑",     grade:"고2", school:"도원고", teacher:"박혜린", parent:"010-2237-7276" },
  { id:73, name:"김성년",     class:"도원고2 하츄핑",     grade:"고2", school:"도원고", teacher:"박혜린", parent:"010-4321-0027" },
  { id:74, name:"안서령",     class:"도원고2 하츄핑",     grade:"고2", school:"도원고", teacher:"박혜린", parent:"010-3005-7836" },
  { id:75, name:"김그린",     class:"도원고2 하츄핑",     grade:"고2", school:"도원고", teacher:"박혜린", parent:"010-3173-2129" },
  { id:76, name:"박결",       class:"도원고2 하츄핑",     grade:"고2", school:"도원고", teacher:"박혜린", parent:"010-9175-8286" },
  { id:77, name:"황지후",     class:"도원고2 하츄핑",     grade:"고2", school:"도원고", teacher:"박혜린", parent:"010-2728-0805" },
  { id:78, name:"최한결",     class:"도원고2 하츄핑",     grade:"고2", school:"도원고", teacher:"박혜린", parent:"010-2634-4297" },
  { id:79, name:"이나경",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-5028-3957" },
  { id:80, name:"송시은",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-8566-6716" },
  { id:81, name:"권민찬",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-6315-2530" },
  { id:82, name:"이시훈",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-3642-0923" },
  { id:83, name:"서민지",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-2537-7908" },
  { id:84, name:"김민승",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-6565-7842" },
  { id:85, name:"김태민",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-6598-9182" },
  { id:86, name:"김소희",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-4069-3830" },
  { id:87, name:"박상현",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-4006-2905" },
  { id:88, name:"노준표",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-4919-2997" },
  { id:89, name:"이다현",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-7364-5585" },
  { id:90, name:"이하윤",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-2699-4860" },
  { id:91, name:"이상훈",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-8297-7008" },
  { id:92, name:"최승민",     class:"도원고2 마이멜로디", grade:"고2", school:"도원고", teacher:"김상은", parent:"010-8215-1035" },
  { id:93, name:"강다연",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-5790-7755" },
  { id:94, name:"우재영",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-4507-5646" },
  { id:95, name:"김민준",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-8560-9516" },
  { id:96, name:"신은민",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-9247-5373" },
  { id:97, name:"조다은",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-8774-2878" },
  { id:98, name:"김도현",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-4188-8661" },
  { id:99, name:"이준혁",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-2674-7517" },
  { id:100,name:"전시현",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-4106-8780" },
  { id:101,name:"전병윤",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-2928-1468" },
  { id:102,name:"손민찬",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-2001-7981" },
  { id:103,name:"이서준",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-3526-8904" },
  { id:104,name:"권동현",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-6561-5618" },
  { id:105,name:"박시형",     class:"도원고1 흰둥이",     grade:"고1", school:"도원고", teacher:"김상은", parent:"010-9966-0070" },
  { id:106,name:"장경원",     class:"도원고1 어피치",     grade:"고1", school:"도원고", teacher:"노미진", parent:"010-9299-7516" },
  { id:107,name:"이동인",     class:"도원고1 어피치",     grade:"고1", school:"도원고", teacher:"노미진", parent:"010-4546-2159" },
  { id:108,name:"박지민",     class:"도원고1 어피치",     grade:"고1", school:"도원고", teacher:"노미진", parent:"010-3536-0416" },
  { id:109,name:"이시윤",     class:"도원고1 어피치",     grade:"고1", school:"도원고", teacher:"노미진", parent:"010-2504-3340" },
  { id:110,name:"박세희",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-9364-8759" },
  { id:111,name:"박가현",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-2060-7028" },
  { id:112,name:"박민주",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-3175-4819" },
  { id:113,name:"서주원",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-3524-3859" },
  { id:114,name:"전현화",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-3057-3125" },
  { id:115,name:"최민규",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-8554-3996" },
  { id:116,name:"남동희",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-7913-1391" },
  { id:117,name:"강유준",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-2020-5005" },
  { id:118,name:"김아람",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-5294-5478" },
  { id:119,name:"이나연",     class:"대곡중3 최대",       grade:"중3", school:"대곡중", teacher:"박혜린", parent:"010-4893-7333" },
  { id:120,name:"이다영",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-2064-1234" },
  { id:121,name:"권수민",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-3127-6273" },
  { id:122,name:"최민서",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-7474-3979" },
  { id:123,name:"박주하",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-3003-0686" },
  { id:124,name:"신유준",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-2807-8906" },
  { id:125,name:"권기범",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-6711-0204" },
  { id:126,name:"이다인",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-7797-3951" },
  { id:127,name:"장유리",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-7465-7771" },
  { id:128,name:"장단아",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-2806-5607" },
  { id:129,name:"한지유",     class:"대곡중2 상상",       grade:"중2", school:"대곡중", teacher:"박혜린", parent:"010-6414-3134" },
  { id:130,name:"이도경",     class:"대곡중2 귤",         grade:"중2", school:"대곡중", teacher:"김도은", parent:"010-5361-2859" },
  { id:131,name:"서아란",     class:"대곡중2 귤",         grade:"중2", school:"대곡중", teacher:"김도은", parent:"010-2537-7908" },
  { id:132,name:"곽설화",     class:"대곡중2 귤",         grade:"중2", school:"대곡중", teacher:"김도은", parent:"010-7922-9873" },
  { id:133,name:"윤성재",     class:"대곡중1 마루",       grade:"중1", school:"대곡중", teacher:"박혜린", parent:"010-2888-3482" },
  { id:134,name:"장주원",     class:"대곡중1 마루",       grade:"중1", school:"대곡중", teacher:"박혜린", parent:"010-4431-0424" },
  { id:135,name:"강동우",     class:"대곡중1 마루",       grade:"중1", school:"대곡중", teacher:"박혜린", parent:"010-7143-1772" },
  { id:136,name:"박도운",     class:"대곡중1 마루",       grade:"중1", school:"대곡중", teacher:"박혜린", parent:"010-3512-0229" },
  { id:137,name:"석민찬",     class:"대곡중1 마루",       grade:"중1", school:"대곡중", teacher:"박혜린", parent:"010-2935-3486" },
  { id:138,name:"이호",       class:"대곡중1 마루",       grade:"중1", school:"대곡중", teacher:"박혜린", parent:"010-3742-3552" },
  { id:139,name:"안서율",     class:"대곡중1 대갈치",     grade:"중1", school:"대곡중", teacher:"노미진", parent:"010-9391-0130" },
  { id:140,name:"배준혁",     class:"대곡중1 대갈치",     grade:"중1", school:"대곡중", teacher:"노미진", parent:"010-5445-3086" },
  { id:141,name:"정예주",     class:"대곡중1 대갈치",     grade:"중1", school:"대곡중", teacher:"노미진", parent:"010-8209-0903" },
  { id:142,name:"김소율",     class:"대곡중1 대갈치",     grade:"중1", school:"대곡중", teacher:"노미진", parent:"010-6520-6907" },
  { id:143,name:"심지훈",     class:"대곡중1 대갈치",     grade:"중1", school:"대곡중", teacher:"노미진", parent:"010-9673-0922" },
  { id:144,name:"김나경",     class:"대곡중1 대갈치",     grade:"중1", school:"대곡중", teacher:"노미진", parent:"010-9948-7777" },
  { id:145,name:"박소율",     class:"대곡중1 대갈치",     grade:"중1", school:"대곡중", teacher:"노미진", parent:"010-7621-0603" },
  { id:146,name:"이종규",     class:"대곡고3",            grade:"고3", school:"대곡고", teacher:"김상은", parent:"010-9331-8112" },
  { id:147,name:"석예진",     class:"대곡고3",            grade:"고3", school:"대곡고", teacher:"김상은", parent:"010-6259-7021" },
  { id:148,name:"송재환",     class:"대곡고3",            grade:"고3", school:"대곡고", teacher:"김상은", parent:"010-2823-6233" },
  { id:149,name:"이태형",     class:"대곡고3",            grade:"고3", school:"대곡고", teacher:"김상은", parent:"010-4478-8803" },
  { id:150,name:"천혜린",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-5280-4483" },
  { id:151,name:"박도윤",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-2060-7028" },
  { id:152,name:"노연희",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-4579-4211" },
  { id:153,name:"이정민",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-9491-2097" },
  { id:154,name:"문현솔",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-6283-4540" },
  { id:155,name:"설비진",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-7442-1480" },
  { id:156,name:"이하윤",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-4502-5660" },
  { id:157,name:"김은지",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-4141-8369" },
  { id:158,name:"이유진",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-9375-9765" },
  { id:159,name:"권나인",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-9043-6699" },
  { id:160,name:"김민지",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-9779-9898" },
  { id:161,name:"김예슬",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"010-2803-3464" },
  { id:162,name:"서윤빈",     class:"대곡고2 쿠로미",     grade:"고2", school:"대곡고", teacher:"김상은", parent:"" },
  { id:163,name:"선경준",     class:"대곡고2 춘식이",     grade:"고2", school:"대곡고", teacher:"박혜린", parent:"010-2820-7835" },
  { id:164,name:"김근태",     class:"대곡고2 춘식이",     grade:"고2", school:"대곡고", teacher:"박혜린", parent:"010-9654-0447" },
  { id:165,name:"배재민",     class:"대곡고2 춘식이",     grade:"고2", school:"대곡고", teacher:"박혜린", parent:"010-5445-3086" },
  { id:166,name:"최현민",     class:"대곡고2 춘식이",     grade:"고2", school:"대곡고", teacher:"박혜린", parent:"010-9368-6756" },
  { id:167,name:"채서현",     class:"대곡고2 춘식이",     grade:"고2", school:"대곡고", teacher:"박혜린", parent:"010-9387-7855" },
  { id:168,name:"강석준",     class:"대곡고2 춘식이",     grade:"고2", school:"대곡고", teacher:"박혜린", parent:"010-4100-4213" },
  { id:169,name:"이준혁",     class:"대곡고2 춘식이",     grade:"고2", school:"대곡고", teacher:"박혜린", parent:"010-8572-3185" },
  { id:170,name:"이보민",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-3633-5755" },
  { id:171,name:"조성철",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-4718-5565" },
  { id:172,name:"정다연",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-9367-1430" },
  { id:173,name:"손주형",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-2537-7243" },
  { id:174,name:"강동하",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-3826-7536" },
  { id:175,name:"박서현",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-8575-6247" },
  { id:176,name:"정지영",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-3113-0666" },
  { id:177,name:"조부겸",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-5125-1790" },
  { id:178,name:"조예준",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-7279-7831" },
  { id:179,name:"최현승",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-8569-7679" },
  { id:180,name:"김지윤",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-6516-5901" },
  { id:181,name:"김지효",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-6516-5901" },
  { id:182,name:"신명진",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-6504-6382" },
  { id:183,name:"정지훈",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"010-4302-0777" },
  { id:184,name:"김민용",     class:"대곡고1 짱구",       grade:"고1", school:"대곡고", teacher:"김상은", parent:"" },
  { id:185,name:"천아영",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-9095-4043" },
  { id:186,name:"김동현",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-9214-7728" },
  { id:187,name:"배서현",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-4521-9937" },
  { id:188,name:"김민정",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-3383-8523" },
  { id:189,name:"김명준",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-2598-6375" },
  { id:190,name:"최주하",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-4740-6605" },
  { id:191,name:"남지유",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-4347-3878" },
  { id:192,name:"정동운",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-2528-0575" },
  { id:193,name:"권효은",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-6640-3408" },
  { id:194,name:"이건호",     class:"대곡고1 라이언",     grade:"고1", school:"대곡고", teacher:"노미진", parent:"010-9394-7540" },
];

// ── 색상 팔레트 (따뜻하고 밝은 톤) ──
const C = {
  bg:       "#FFF8F0",       // 크림 배경
  bgCard:   "#FFFFFF",       // 카드 흰색
  bgSub:    "#FFF3E6",       // 연한 오렌지 배경
  border:   "#FDDCB5",       // 따뜻한 테두리
  borderSub:"#FFE8CC",
  primary:  "#F97316",       // 오렌지
  primaryDk:"#EA6A0A",
  primaryLt:"#FFF0E6",
  amber:    "#F59E0B",
  amberLt:  "#FFFBEB",
  green:    "#16A34A",
  greenLt:  "#F0FDF4",
  blue:     "#2563EB",
  blueLt:   "#EFF6FF",
  red:      "#DC2626",
  redLt:    "#FEF2F2",
  text:     "#1C0A00",       // 따뜻한 진갈색
  textMd:   "#7C4A1E",       // 중간 갈색
  textSub:  "#A87650",       // 연한 갈색
  textFaint:"#D4A97A",
};

const GRADE_CLR = { "중1":"#3B82F6","중2":"#10B981","중3":"#8B5CF6","고1":"#F97316","고2":"#EC4899","고3":"#EF4444" };
const TEACHERS = ["전체","노미진","박혜린","김상은","김도은"];
const todayStr = () => new Date().toISOString().slice(0,10);
const fmt = d => new Date(d).toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
const fmtDateShort = d => { const dt=new Date(d); const days=["일","월","화","수","목","금","토"]; return `${String(dt.getMonth()+1).padStart(2,"0")}월 ${String(dt.getDate()).padStart(2,"0")}일(${days[dt.getDay()]})`; };
const fmtNotif = d => { const dt=new Date(d); const days=["일","월","화","수","목","금","토"]; return `${String(dt.getMonth()+1).padStart(2,"0")}월 ${String(dt.getDate()).padStart(2,"0")}일(${days[dt.getDay()]}) ${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}:${String(dt.getSeconds()).padStart(2,"0")}`; };
const elapsed = (a,b) => { const m=Math.floor((new Date(b)-new Date(a))/60000),s=Math.floor(((new Date(b)-new Date(a))%60000)/1000); return m>0?`${m}분 ${s}초`:`${s}초`; };
const toE164 = p => p.replace(/-/g,"").replace(/^0/,"82");
const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const toCs = str => [...str].map(c=>{ const code=c.charCodeAt(0); return (code>=0xAC00&&code<=0xD7A3)?CHOSUNG[Math.floor((code-0xAC00)/588)]:c; }).join('');
const kmatch = (q,t) => !q?false:t.includes(q)||toCs(t).includes(toCs(q));

const stor = {
  get: k => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):null; } catch { return null; } },
  set: (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} },
};

async function sendSMS(apiKey,apiSecret,from,to,text) {
  const date=new Date().toISOString(), salt=Math.random().toString(36).slice(2,18);
  const enc=new TextEncoder(), k=await crypto.subtle.importKey("raw",enc.encode(apiSecret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("HMAC",k,enc.encode(date+salt));
  const hex=Array.from(new Uint8Array(sig)).map(b=>b.toString(16).padStart(2,"0")).join("");
  const res=await fetch("https://api.solapi.com/messages/v4/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${hex}`},body:JSON.stringify({message:{to:toE164(to),from:toE164(from),text}})});
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.errorMessage||`HTTP ${res.status}`);}
}

function exportCSV(date,records,retakeIds) {
  const header="날짜,이름,반,학년,학교,담당강사,재시대상,입실시각,퇴실시각,소요시간,상태";
  const rows=[];
  records.forEach(r=>{const s=STUDENTS.find(x=>x.id===r.studentId);if(!s)return;const isRt=retakeIds.includes(s.id);rows.push([date,s.name,s.class,s.grade,s.school,s.teacher,isRt?"O":"",r.inTime?fmt(r.inTime):"",r.outTime?fmt(r.outTime):"",r.outTime?elapsed(r.inTime,r.outTime):"",r.outTime?"퇴실완료":"입실중"].join(","));});
  retakeIds.forEach(id=>{if(!records.find(r=>r.studentId===id)){const s=STUDENTS.find(x=>x.id===id);if(!s)return;rows.push([date,s.name,s.class,s.grade,s.school,s.teacher,"O","","","","미응시"].join(","));}});
  const csv="\uFEFF"+header+"\n"+rows.join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));a.download=`은갈치영어학원_재시_${date}.csv`;a.click();
}

export default function App() {
  const [view,setView]=useState("checkin");
  const [mode,setMode]=useState("in");
  const [search,setSearch]=useState("");
  const [retakeSearch,setRetakeSearch]=useState("");
  const [selDate,setSelDate]=useState(todayStr());
  const [records,setRecords]=useState([]);
  const [retakeIds,setRetakeIds]=useState([]);
  const [now,setNow]=useState(new Date());
  const [successInfo,setSuccessInfo]=useState(null);
  const [teacherFilter,setTeacherFilter]=useState("전체");
  const [adminUnlocked,setAdminUnlocked]=useState(false);
  const [adminPass,setAdminPass]=useState("");
  const [adminError,setAdminError]=useState(false);
  const [settings,setSettings]=useState({apiKey:"",apiSecret:"",from:"",adminPass:"1234"});
  const [tmpSettings,setTmpSettings]=useState({apiKey:"",apiSecret:"",from:"",adminPass:"1234"});
  const [savedMsg,setSavedMsg]=useState(false);

  useEffect(()=>{const s=stor.get("settings:eungalchi")||{apiKey:"",apiSecret:"",from:"",adminPass:"1234"};setSettings(s);setTmpSettings(s);},[]);
  useEffect(()=>{setRecords(stor.get(`checkins:${selDate}`)||[]);setRetakeIds(stor.get(`retake:${selDate}`)||[]);},[selDate]);
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  const isConfigured=settings.apiKey&&settings.apiSecret&&settings.from;
  const getRecord=id=>records.find(r=>r.studentId===id);
  const isInside=id=>{const r=getRecord(id);return r&&!r.outTime;};
  const isDone=id=>{const r=getRecord(id);return r&&!!r.outTime;};

  const handleCheckin=async student=>{
    const rec=getRecord(student.id);
    if(rec&&!rec.outTime){setSuccessInfo({type:"already_in",student,time:rec.inTime});setView("success");setSearch("");return;}
    if(rec&&rec.outTime){setSuccessInfo({type:"already_out",student,inTime:rec.inTime,outTime:rec.outTime});setView("success");setSearch("");return;}
    const inTime=new Date().toISOString();
    const updated=[{id:Date.now(),studentId:student.id,inTime,outTime:null},...records];
    setRecords(updated);stor.set(`checkins:${selDate}`,updated);
    let ns="simulated";
    if(isConfigured&&student.parent){try{await sendSMS(settings.apiKey,settings.apiSecret,settings.from,student.parent,`은갈치영어학원 ${student.name} 학생이 ${fmtNotif(inTime)}에 재시실에 입실하였습니다.`);ns="sent";}catch{ns="failed";}}
    else if(!student.parent)ns="no_parent";
    setSuccessInfo({type:"in",student,time:inTime,notifStatus:ns});setView("success");setSearch("");
  };

  const handleCheckout=async student=>{
    const rec=getRecord(student.id);
    if(!rec||rec.outTime){setSuccessInfo({type:"not_in",student});setView("success");setSearch("");return;}
    const outTime=new Date().toISOString();
    const updated=records.map(r=>r.studentId===student.id?{...r,outTime}:r);
    setRecords(updated);stor.set(`checkins:${selDate}`,updated);
    let ns="simulated";
    if(isConfigured&&student.parent){try{await sendSMS(settings.apiKey,settings.apiSecret,settings.from,student.parent,`은갈치영어학원 ${student.name} 학생이 ${fmtNotif(outTime)}에 재시실에 퇴실하였습니다.`);ns="sent";}catch{ns="failed";}}
    else if(!student.parent)ns="no_parent";
    setSuccessInfo({type:"out",student,inTime:rec.inTime,outTime,notifStatus:ns});setView("success");setSearch("");
  };

  const handleSelect=s=>mode==="in"?handleCheckin(s):handleCheckout(s);

  const addToRetake=s=>{if(retakeIds.includes(s.id))return;const u=[...retakeIds,s.id];setRetakeIds(u);stor.set(`retake:${selDate}`,u);setRetakeSearch("");};
  const removeFromRetake=id=>{const u=retakeIds.filter(x=>x!==id);setRetakeIds(u);stor.set(`retake:${selDate}`,u);};
  const handleAdminLogin=()=>{if(adminPass===settings.adminPass){setAdminUnlocked(true);setAdminError(false);setTmpSettings({...settings});setView("dashboard");}else setAdminError(true);};
  const saveSettings=()=>{setSettings({...tmpSettings});stor.set("settings:eungalchi",tmpSettings);setSavedMsg(true);setTimeout(()=>setSavedMsg(false),2000);};

  const filteredStudents=search.length>0?STUDENTS.filter(s=>kmatch(search,s.name)||kmatch(search,s.class)):[];
  const retakeFiltered=retakeSearch.length>0?STUDENTS.filter(s=>(kmatch(retakeSearch,s.name)||kmatch(retakeSearch,s.class))&&!retakeIds.includes(s.id)):[];
  const allIds=[...new Set([...retakeIds,...records.map(r=>r.studentId)])];
  const unified=allIds.map(id=>{const student=STUDENTS.find(s=>s.id===id);const rec=records.find(r=>r.studentId===id);const inRetake=retakeIds.includes(id);const status=rec?.outTime?"done":rec?"inside":inRetake?"pending":"extra";return{student,rec,inRetake,status};}).filter(x=>x.student).filter(x=>teacherFilter==="전체"||x.student.teacher===teacherFilter);
  const pending=unified.filter(x=>x.status==="pending");
  const inside=unified.filter(x=>x.status==="inside");
  const done=unified.filter(x=>x.status==="done");
  const dateShortcuts=[{label:"오늘",val:todayStr()},{label:"어제",val:new Date(Date.now()-86400000).toISOString().slice(0,10)},{label:"그제",val:new Date(Date.now()-172800000).toISOString().slice(0,10)}];
  const TABS=[{k:"checkin",l:"✏️ 체크인"},{k:"retake",l:"📋 재시명단"},{k:"dashboard",l:"📊 현황판"}];

  const S = {
    page:{minHeight:"100vh",background:C.bg,fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",color:C.text,maxWidth:800,margin:"0 auto"},
    card:{background:C.bgCard,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:16,boxShadow:"0 2px 8px rgba(249,115,22,0.08)"},
    cardHead:{padding:"13px 20px",background:C.bgSub,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"},
    inp:{width:"100%",background:C.bgCard,border:`2px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:17,outline:"none",padding:"13px 16px",transition:"border 0.2s"},
    row:{transition:"all 0.15s",cursor:"pointer"},
    btn:{cursor:"pointer",transition:"all 0.2s",border:"none"},
  };

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        input,select,button{font-family:inherit}
        input::placeholder{color:${C.textFaint}}
        .row:hover{background:${C.primaryLt} !important;transform:translateX(4px)}
        .btn:hover{opacity:0.85}
        .pulse{animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .pop{animation:pop 0.4s cubic-bezier(.34,1.56,.64,1)}@keyframes pop{from{transform:scale(0.6);opacity:0}to{transform:scale(1);opacity:1}}
        .fish{animation:swim 3s ease-in-out infinite;display:inline-block}@keyframes swim{0%,100%{transform:translateX(0)}50%{transform:translateX(6px) rotate(5deg)}}
        .inp:focus{border-color:${C.primary} !important;box-shadow:0 0 0 3px ${C.primaryLt}}
        .slide{animation:slide 0.25s ease}@keyframes slide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── 헤더 ── */}
      <div style={{background:`linear-gradient(135deg,#FFF0E0,#FFE4C8)`,borderBottom:`2px solid ${C.border}`,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(249,115,22,0.12)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span className="fish" style={{fontSize:30}}>🐟</span>
          <div>
            <div style={{fontWeight:900,fontSize:20,color:C.primary}}>은갈치영어학원</div>
            <div style={{fontSize:12,color:C.textSub}}>재시 입퇴실 관리 시스템</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:15,fontWeight:700,color:C.textMd,fontVariantNumeric:"tabular-nums"}}>{fmt(now)}</div>
          <div style={{fontSize:12,color:C.textSub}}>{fmtDateShort(now)}</div>
        </div>
      </div>

      {/* ── 탭 ── */}
      <div style={{display:"flex",background:C.bgCard,borderBottom:`2px solid ${C.border}`}}>
        {TABS.map(t=>{
          const a=view===t.k||(view==="success"&&t.k==="checkin");
          return <button key={t.k} className="btn" onClick={()=>{if((t.k==="retake"||t.k==="dashboard")&&!adminUnlocked){setView("adminLogin");}else setView(t.k);}}
            style={{flex:1,padding:"14px 0",fontSize:15,fontWeight:700,background:a?C.primaryLt:"transparent",color:a?C.primary:C.textSub,borderBottom:a?`3px solid ${C.primary}`:"3px solid transparent"}}>
            {t.l}
          </button>;
        })}
      </div>

      {/* ── 체크인 ── */}
      {view==="checkin"&&(
        <div style={{padding:18,maxWidth:600,margin:"0 auto"}}>
          {/* 모드 토글 */}
          <div style={{display:"flex",gap:8,marginBottom:16,background:C.bgCard,borderRadius:14,padding:6,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            {[{k:"in",l:"🚪 입실 체크인",bg:C.primary},{k:"out",l:"🏃 퇴실 체크아웃",bg:C.green}].map(m=>(
              <button key={m.k} className="btn" onClick={()=>setMode(m.k)}
                style={{flex:1,padding:"12px 0",borderRadius:10,fontSize:15,fontWeight:700,background:mode===m.k?m.bg:"transparent",color:mode===m.k?"#fff":C.textSub,boxShadow:mode===m.k?"0 2px 8px rgba(0,0,0,0.15)":"none"}}>
                {m.l}
              </button>
            ))}
          </div>

          {!isConfigured&&<div style={{background:"#FFFBEB",border:`1px solid ${C.amber}`,borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#92400E",fontWeight:500}}>⚠️ 알림톡 미설정 — 현황판 설정에서 솔라피 API를 입력해주세요</div>}

          {/* 재시 대상 빠른 표시 */}
          {mode==="in"&&retakeIds.length>0&&(
            <div style={{...S.card,marginBottom:14}}>
              <div style={S.cardHead}><span style={{fontSize:14,fontWeight:700,color:C.amber}}>📋 오늘 재시 대상 ({retakeIds.length}명)</span></div>
              <div style={{padding:"10px 14px",display:"flex",flexWrap:"wrap",gap:8}}>
                {retakeIds.map(id=>{
                  const s=STUDENTS.find(x=>x.id===id); if(!s)return null;
                  const insd=isInside(id),dnd=isDone(id);
                  return <span key={id} className={insd||dnd?"":"row"} onClick={()=>!insd&&!dnd&&handleCheckin(s)}
                    style={{fontSize:14,padding:"6px 14px",borderRadius:20,cursor:insd||dnd?"default":"pointer",fontWeight:600,
                      background:dnd?C.greenLt:insd?"#F0FFF4":C.amberLt,
                      color:dnd?C.green:insd?"#15803D":C.amber,
                      border:`1px solid ${dnd?"#86EFAC":insd?"#4ADE80":"#FCD34D"}`}}>
                    {dnd?"✅":insd?"🟢":"⏳"} {s.name}
                  </span>;
                })}
              </div>
            </div>
          )}

          {/* 검색 */}
          <div style={{background:C.bgCard,borderRadius:14,padding:16,border:`1px solid ${C.border}`,marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:18}}>🔍</span>
              <input autoFocus className="inp" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="이름/반 검색 (초성 가능 — ㄱㅈㅎ)"
                style={{paddingLeft:44,fontSize:17,border:`2px solid ${C.border}`,borderRadius:12}} />
            </div>
          </div>

          {search.length>0&&(
            <div style={S.card}>
              {filteredStudents.length===0
                ? <div style={{padding:40,textAlign:"center",color:C.textFaint,fontSize:16}}>😅 검색 결과가 없어요</div>
                : filteredStudents.map((s,i)=>{
                    const insd=isInside(s.id),dnd=isDone(s.id),isRt=retakeIds.includes(s.id),rec=getRecord(s.id);
                    let action;
                    if(mode==="in"){
                      if(insd) action=<span style={{fontSize:13,color:C.green,fontWeight:700}}>🟢 입실중 {fmt(rec.inTime)}</span>;
                      else if(dnd) action=<span style={{fontSize:13,color:C.textFaint}}>✅ 퇴실완료</span>;
                      else action=<div style={{background:C.primary,color:"#fff",padding:"8px 18px",borderRadius:20,fontSize:14,fontWeight:700,boxShadow:"0 2px 6px rgba(249,115,22,0.4)"}}>입실</div>;
                    } else {
                      if(insd) action=<div style={{background:C.green,color:"#fff",padding:"8px 18px",borderRadius:20,fontSize:14,fontWeight:700,boxShadow:"0 2px 6px rgba(22,163,74,0.4)"}}>퇴실</div>;
                      else if(dnd) action=<span style={{fontSize:13,color:C.textFaint}}>이미 퇴실</span>;
                      else action=<span style={{fontSize:13,color:C.textFaint}}>미입실</span>;
                    }
                    const clickable=mode==="in"?!insd&&!dnd:insd;
                    return (
                      <div key={s.id} className={clickable?"row btn":""} onClick={()=>clickable&&handleSelect(s)}
                        style={{padding:"14px 18px",borderBottom:i<filteredStudents.length-1?`1px solid ${C.borderSub}`:"none",display:"flex",alignItems:"center",justifyContent:"space-between",background:dnd?"#F9FAFB":insd?C.greenLt:C.bgCard,opacity:!clickable&&!insd?0.5:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:42,height:42,borderRadius:12,background:GRADE_CLR[s.grade]+"18",border:`2px solid ${GRADE_CLR[s.grade]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:GRADE_CLR[s.grade]}}>{s.grade}</div>
                          <div>
                            <div style={{fontWeight:700,fontSize:17,display:"flex",alignItems:"center",gap:6,color:C.text}}>
                              {s.name}
                              {isRt&&<span style={{fontSize:11,background:C.amberLt,color:C.amber,borderRadius:6,padding:"1px 7px",border:`1px solid #FCD34D`}}>재시</span>}
                            </div>
                            <div style={{fontSize:13,color:C.textSub,marginTop:1}}>{s.class} · {s.teacher}</div>
                          </div>
                        </div>
                        {action}
                      </div>
                    );
                  })}
            </div>
          )}

          {search.length===0&&(
            <div style={{textAlign:"center",padding:"48px 0",color:C.textFaint}}>
              <div style={{fontSize:52,marginBottom:10}}>🐟</div>
              <div style={{fontSize:15,color:C.textSub}}>재시대상 {retakeIds.length}명 · 입실중 {records.filter(r=>!r.outTime).length}명 · 퇴실완료 {records.filter(r=>r.outTime).length}명</div>
            </div>
          )}
        </div>
      )}

      {/* ── 성공 화면 ── */}
      {view==="success"&&successInfo&&(
        <div style={{padding:20,maxWidth:440,margin:"48px auto"}}>
          <div className="pop" style={{background:C.bgCard,border:`2px solid ${successInfo.type==="in"?C.green:successInfo.type==="out"?C.primary:C.amber}`,borderRadius:24,padding:"36px 28px",textAlign:"center",boxShadow:"0 8px 32px rgba(249,115,22,0.15)"}}>
            <div style={{fontSize:60,marginBottom:12}}>{successInfo.type==="in"?"🚪":successInfo.type==="out"?"🏃":"⚠️"}</div>
            <div style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:4}}>{successInfo.student.name}</div>
            <div style={{fontSize:14,color:C.textSub,marginBottom:20}}>{successInfo.student.class}</div>

            {successInfo.type==="in"&&<div style={{background:C.greenLt,border:`1px solid #86EFAC`,borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.green,fontWeight:800,fontSize:18}}>✅ 입실 완료!</div><div style={{color:"#15803D",fontSize:14,marginTop:4}}>{fmt(successInfo.time)}</div></div>}
            {successInfo.type==="out"&&<div style={{background:C.primaryLt,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.primary,fontWeight:800,fontSize:18}}>🏃 퇴실 완료!</div><div style={{color:C.primaryDk,fontSize:14,marginTop:4}}>{fmt(successInfo.outTime)}</div><div style={{color:C.textMd,fontSize:13,marginTop:4}}>소요시간: {elapsed(successInfo.inTime,successInfo.outTime)}</div></div>}
            {successInfo.type==="already_in"&&<div style={{background:C.amberLt,border:`1px solid #FCD34D`,borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.amber,fontWeight:700,fontSize:16}}>이미 입실 중입니다</div><div style={{color:"#92400E",fontSize:13,marginTop:4}}>입실시각: {fmt(successInfo.time)}</div></div>}
            {successInfo.type==="already_out"&&<div style={{background:"#F9FAFB",border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.textSub,fontWeight:700,fontSize:16}}>이미 퇴실 완료</div><div style={{color:C.textFaint,fontSize:13,marginTop:4}}>{fmt(successInfo.inTime)} → {fmt(successInfo.outTime)}</div></div>}
            {successInfo.type==="not_in"&&<div style={{background:C.amberLt,border:`1px solid #FCD34D`,borderRadius:14,padding:"14px 16px",marginBottom:14}}><div style={{color:C.amber,fontWeight:700,fontSize:16}}>입실 기록이 없어요</div><div style={{color:"#92400E",fontSize:13,marginTop:4}}>먼저 입실 체크인이 필요합니다</div></div>}

            {(successInfo.type==="in"||successInfo.type==="out")&&(
              <div style={{background:C.bgSub,border:`1px solid ${C.borderSub}`,borderRadius:12,padding:"10px 14px",marginBottom:16,textAlign:"left"}}>
                <span style={{fontSize:13,color:C.textSub}}>📱 알림톡 </span>
                <span style={{fontSize:13,fontWeight:700,color:successInfo.notifStatus==="sent"?C.green:successInfo.notifStatus==="failed"?C.red:C.amber}}>
                  {successInfo.notifStatus==="sent"?"✅ 발송완료":successInfo.notifStatus==="failed"?"❌ 실패":successInfo.notifStatus==="no_parent"?"— 번호없음":"🔵 시뮬레이션"}
                </span>
              </div>
            )}

            <button className="btn" onClick={()=>setView("checkin")}
              style={{width:"100%",padding:15,background:C.primary,color:"#fff",borderRadius:14,fontSize:16,fontWeight:700,boxShadow:"0 4px 12px rgba(249,115,22,0.4)"}}>
              확인
            </button>
          </div>
        </div>
      )}

      {/* ── 관리자 로그인 ── */}
      {view==="adminLogin"&&(
        <div style={{padding:20,maxWidth:360,margin:"72px auto"}}>
          <div style={{background:C.bgCard,borderRadius:22,padding:36,border:`1px solid ${C.border}`,textAlign:"center",boxShadow:"0 4px 20px rgba(249,115,22,0.1)"}}>
            <div style={{fontSize:44,marginBottom:14}}>🔒</div>
            <div style={{fontWeight:900,fontSize:20,color:C.text,marginBottom:22}}>관리자 인증</div>
            <input type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdminLogin()}
              placeholder="비밀번호"
              style={{width:"100%",background:C.bgSub,border:`2px solid ${adminError?C.red:C.border}`,borderRadius:12,color:C.text,fontSize:18,outline:"none",padding:"13px 16px",textAlign:"center",letterSpacing:8,marginBottom:10}}/>
            {adminError&&<div style={{color:C.red,fontSize:14,marginBottom:10,fontWeight:600}}>비밀번호가 틀렸습니다</div>}
            <button className="btn" onClick={handleAdminLogin}
              style={{width:"100%",padding:14,background:C.primary,color:"#fff",borderRadius:12,fontSize:16,fontWeight:700,boxShadow:"0 4px 12px rgba(249,115,22,0.35)",marginBottom:10}}>
              로그인
            </button>
            <button className="btn" onClick={()=>setView("checkin")} style={{background:"none",color:C.textSub,fontSize:14}}>취소</button>
          </div>
        </div>
      )}

      {/* ── 재시 명단 ── */}
      {view==="retake"&&(
        <div style={{padding:18,maxWidth:600,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            {dateShortcuts.map(d=>(
              <button key={d.val} className="btn" onClick={()=>setSelDate(d.val)}
                style={{padding:"9px 18px",borderRadius:20,fontSize:14,fontWeight:700,background:selDate===d.val?C.primary:C.bgCard,color:selDate===d.val?"#fff":C.textMd,border:`1px solid ${selDate===d.val?C.primary:C.border}`,boxShadow:selDate===d.val?"0 2px 8px rgba(249,115,22,0.3)":"none"}}>
                {d.label}
              </button>
            ))}
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)}
              style={{flex:1,minWidth:140,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:14,outline:"none",padding:"9px 12px"}}/>
          </div>

          <div style={S.card}>
            <div style={S.cardHead}>
              <span style={{fontSize:15,fontWeight:700,color:C.amber}}>📋 {selDate} 재시 대상자</span>
              <span style={{fontSize:14,color:C.textSub,fontWeight:600}}>{retakeIds.length}명 등록</span>
            </div>
            <div style={{padding:16}}>
              <div style={{position:"relative",marginBottom:12}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>➕</span>
                <input value={retakeSearch} onChange={e=>setRetakeSearch(e.target.value)}
                  placeholder="학생 이름 검색 후 추가 (초성 가능)"
                  style={{width:"100%",background:C.bgSub,border:`2px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:16,outline:"none",padding:"12px 14px 12px 42px"}}/>
              </div>

              {retakeSearch.length>0&&(
                <div style={{background:C.bgSub,borderRadius:12,border:`1px solid ${C.border}`,marginBottom:12,maxHeight:200,overflowY:"auto"}}>
                  {retakeFiltered.length===0
                    ? <div style={{padding:20,textAlign:"center",color:C.textFaint,fontSize:14}}>검색 결과 없음</div>
                    : retakeFiltered.slice(0,8).map((s,i)=>(
                      <div key={s.id} className="row btn" onClick={()=>addToRetake(s)}
                        style={{padding:"12px 16px",borderBottom:i<Math.min(retakeFiltered.length,8)-1?`1px solid ${C.borderSub}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <span style={{fontWeight:700,fontSize:16,color:C.text}}>{s.name}</span>
                          <span style={{color:C.textSub,fontSize:13,marginLeft:8}}>{s.class}</span>
                        </div>
                        <span style={{fontSize:13,background:C.primary,color:"#fff",borderRadius:8,padding:"4px 12px",fontWeight:700}}>추가</span>
                      </div>
                    ))}
                </div>
              )}

              {retakeIds.length===0
                ? <div style={{padding:32,textAlign:"center",color:C.textFaint,fontSize:15}}>등록된 학생이 없습니다<br/><span style={{fontSize:13}}>위에서 검색해 추가하세요</span></div>
                : retakeIds.map(id=>{
                    const s=STUDENTS.find(x=>x.id===id); if(!s)return null;
                    const insd=isInside(id),dnd=isDone(id);
                    return (
                      <div key={id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 4px",borderBottom:`1px solid ${C.borderSub}`}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:18}}>{dnd?"✅":insd?"🟢":"⏳"}</span>
                          <div>
                            <span style={{fontWeight:700,fontSize:16,color:dnd?C.green:insd?"#15803D":C.amber}}>{s.name}</span>
                            <span style={{color:C.textSub,fontSize:13,marginLeft:8}}>{s.class}</span>
                          </div>
                        </div>
                        <button className="btn" onClick={()=>removeFromRetake(id)}
                          style={{background:C.redLt,color:C.red,border:`1px solid #FECACA`,borderRadius:8,padding:"5px 14px",fontSize:13,fontWeight:700}}>
                          삭제
                        </button>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      )}

      {/* ── 현황판 ── */}
      {view==="dashboard"&&(
        <div style={{padding:18,maxWidth:700,margin:"0 auto"}}>
          {/* 날짜 */}
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            {dateShortcuts.map(d=>(
              <button key={d.val} className="btn" onClick={()=>setSelDate(d.val)}
                style={{padding:"9px 18px",borderRadius:20,fontSize:14,fontWeight:700,background:selDate===d.val?C.primary:C.bgCard,color:selDate===d.val?"#fff":C.textMd,border:`1px solid ${selDate===d.val?C.primary:C.border}`,boxShadow:selDate===d.val?"0 2px 8px rgba(249,115,22,0.3)":"none"}}>
                {d.label}
              </button>
            ))}
            <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)}
              style={{flex:1,minWidth:140,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:14,outline:"none",padding:"9px 12px"}}/>
            <button className="btn" onClick={()=>exportCSV(selDate,records,retakeIds)}
              style={{padding:"9px 18px",borderRadius:20,fontSize:14,fontWeight:700,background:C.green,color:"#fff",border:"none",boxShadow:"0 2px 8px rgba(22,163,74,0.35)"}}>
              ⬇️ CSV
            </button>
          </div>

          {/* 강사 필터 */}
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {TEACHERS.map(t=>(
              <button key={t} className="btn" onClick={()=>setTeacherFilter(t)}
                style={{padding:"7px 16px",borderRadius:20,fontSize:14,fontWeight:700,background:teacherFilter===t?"#7C3AED":C.bgCard,color:teacherFilter===t?"#fff":C.textMd,border:`1px solid ${teacherFilter===t?"#7C3AED":C.border}`,boxShadow:teacherFilter===t?"0 2px 8px rgba(124,58,237,0.3)":"none"}}>
                {t}
              </button>
            ))}
          </div>

          {/* 통계 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
            {[{l:"⏳ 미응시",v:pending.length,c:C.amber,bg:C.amberLt,bd:"#FCD34D"},{l:"🟢 입실중",v:inside.length,c:C.green,bg:C.greenLt,bd:"#86EFAC"},{l:"✅ 퇴실완료",v:done.length,c:C.primary,bg:C.primaryLt,bd:C.border}].map(s=>(
              <div key={s.l} style={{background:s.bg,borderRadius:14,padding:"16px 12px",border:`1px solid ${s.bd}`,textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
                <div style={{fontSize:32,fontWeight:900,color:s.c}}>{s.v}</div>
                <div style={{fontSize:13,color:C.textMd,marginTop:3,fontWeight:600}}>{s.l}</div>
              </div>
            ))}
          </div>

          {selDate===todayStr()&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div className="pulse" style={{width:8,height:8,borderRadius:"50%",background:C.green}}/><span style={{fontSize:13,color:C.textSub,fontWeight:600}}>실시간 · {fmtDateShort(now)}</span></div>}

          {/* 미응시 */}
          {pending.length>0&&(
            <div style={S.card}>
              <div style={{...S.cardHead,background:C.amberLt,borderBottom:`1px solid #FCD34D`}}>
                <span style={{fontSize:14,fontWeight:700,color:C.amber}}>⏳ 응시예정 (미입실)</span>
                <span style={{fontSize:14,color:C.amber,fontWeight:700}}>{pending.length}명</span>
              </div>
              {pending.map((x,i)=>(
                <div key={x.student.id} style={{padding:"13px 18px",borderBottom:i<pending.length-1?`1px solid ${C.borderSub}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:C.amber}}/>
                    <span style={{fontWeight:700,fontSize:16,color:C.text}}>{x.student.name}</span>
                    <span style={{color:C.textSub,fontSize:13}}>{x.student.class}</span>
                  </div>
                  <span style={{fontSize:13,color:C.textMd,fontWeight:600}}>{x.student.teacher}</span>
                </div>
              ))}
            </div>
          )}

          {/* 입실중 */}
          {inside.length>0&&(
            <div style={S.card}>
              <div style={{...S.cardHead,background:C.greenLt,borderBottom:"1px solid #86EFAC"}}>
                <span style={{fontSize:14,fontWeight:700,color:C.green}}>🟢 현재 입실 중</span>
                <span style={{fontSize:14,color:C.green,fontWeight:700}}>{inside.length}명</span>
              </div>
              {inside.map((x,i)=>(
                <div key={x.student.id} className="slide" style={{padding:"13px 18px",borderBottom:i<inside.length-1?`1px solid ${C.borderSub}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:C.green}}/>
                    <div>
                      <span style={{fontWeight:700,fontSize:16,color:C.text}}>{x.student.name}</span>
                      <span style={{color:C.textSub,fontSize:13,marginLeft:8}}>{x.student.class}</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,color:C.green,fontWeight:600}}>입실 {fmt(x.rec.inTime)}</div>
                    <div style={{fontSize:12,color:C.textFaint}}>경과 {elapsed(x.rec.inTime,now)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 퇴실완료 */}
          {done.length>0&&(
            <div style={S.card}>
              <div style={{...S.cardHead,background:C.primaryLt,borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:14,fontWeight:700,color:C.primary}}>✅ 퇴실 완료</span>
                <span style={{fontSize:14,color:C.textSub,fontWeight:600}}>{done.length}명</span>
              </div>
              {done.map((x,i)=>(
                <div key={x.student.id} style={{padding:"13px 18px",borderBottom:i<done.length-1?`1px solid ${C.borderSub}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:C.primary}}/>
                    <div>
                      <span style={{fontWeight:700,fontSize:16,color:C.text}}>{x.student.name}</span>
                      <span style={{color:C.textSub,fontSize:13,marginLeft:8}}>{x.student.class}</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,color:C.textMd}}>{fmt(x.rec.inTime)} → {fmt(x.rec.outTime)}</div>
                    <div style={{fontSize:12,color:C.textFaint}}>{elapsed(x.rec.inTime,x.rec.outTime)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {unified.length===0&&<div style={{padding:56,textAlign:"center",color:C.textFaint}}><div style={{fontSize:44,marginBottom:12}}>📋</div><div style={{fontSize:16}}>해당 날짜에 기록이 없습니다</div></div>}

          {/* 설정 */}
          <div style={S.card}>
            <div style={S.cardHead}><span style={{fontSize:15,fontWeight:700,color:C.primary}}>⚙️ 솔라피 알림톡 설정</span></div>
            <div style={{padding:18}}>
              {[{l:"API Key",k:"apiKey",t:"text",p:"NCSNXXXXXXXXXXXXXX"},{l:"API Secret",k:"apiSecret",t:"password",p:"••••••••••••"},{l:"발신번호",k:"from",t:"text",p:"010-0000-0000"},{l:"관리자 비밀번호",k:"adminPass",t:"password",p:"기본: 1234"}].map(f=>(
                <div key={f.k} style={{marginBottom:14}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.textMd,marginBottom:6}}>{f.l}</div>
                  <input type={f.t} placeholder={f.p} value={tmpSettings[f.k]||""} onChange={e=>setTmpSettings(p=>({...p,[f.k]:e.target.value}))}
                    style={{width:"100%",background:C.bgSub,border:`2px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:15,outline:"none",padding:"12px 14px"}}/>
                </div>
              ))}
              <button className="btn" onClick={saveSettings}
                style={{width:"100%",padding:14,background:savedMsg?C.green:C.primary,color:"#fff",borderRadius:12,fontSize:16,fontWeight:700,boxShadow:`0 4px 12px rgba(249,115,22,0.35)`,marginTop:4}}>
                {savedMsg?"✅ 저장됐습니다!":"저장"}
              </button>
              <div style={{marginTop:14,fontSize:13,color:C.textFaint,lineHeight:1.8}}>
                ① solapi.com 가입 → ② 잔액충전 → ③ 발신번호등록 → ④ API키발급 → ⑤ 위에 입력<br/>
                SMS 건당 약 9~11원
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
