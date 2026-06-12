// Los 48 equipos del Mundial 2026 (Estados Unidos · Canadá · México) con los
// grupos del sorteo oficial. Las convocatorias completas (26 jugadores reales
// por equipo) viven en realSquads.js; aquí va la metainformación de cada
// selección y las valoraciones de sus figuras.

export const TEAMS = [
  // ─────────── GRUPO A ───────────
  {
    id: 'mex', name: 'México', code: 'MEX', flag: '🇲🇽', confed: 'CONCACAF', group: 'A',
    rating: 80, nick: 'El Tri', host: true, colors: ['#006341', '#8f1c2e'],
    stars: { 'Santiago Giménez': 82, 'Edson Álvarez': 81, 'Gilberto Mora': 80, 'Raúl Jiménez': 80, 'César Montes': 78, 'Guillermo Ochoa': 76 },
  },
  {
    id: 'cze', name: 'República Checa', code: 'CZE', flag: '🇨🇿', confed: 'UEFA', group: 'A',
    rating: 76, nick: 'Leones de Bohemia', playoff: true, colors: ['#d7141a', '#11457e'],
    stars: { 'Patrik Schick': 82, 'Tomáš Souček': 79, 'Adam Hložek': 77, 'Vladimír Coufal': 75 },
  },
  {
    id: 'rsa', name: 'Sudáfrica', code: 'RSA', flag: '🇿🇦', confed: 'CAF', group: 'A',
    rating: 73, nick: 'Bafana Bafana', colors: ['#007749', '#ffb612'],
    stars: { 'Ronwen Williams': 78, 'Lyle Foster': 76, 'Teboho Mokoena': 75 },
  },
  {
    id: 'kor', name: 'Corea del Sur', code: 'KOR', flag: '🇰🇷', confed: 'AFC', group: 'A',
    rating: 78, nick: 'Guerreros Taegeuk', colors: ['#cd2e3a', '#0047a0'],
    stars: { 'Son Heung-min': 85, 'Kim Min-jae': 85, 'Lee Kang-in': 83, 'Hwang Hee-chan': 79 },
  },

  // ─────────── GRUPO B ───────────
  {
    id: 'can', name: 'Canadá', code: 'CAN', flag: '🇨🇦', confed: 'CONCACAF', group: 'B',
    rating: 78, nick: 'Les Rouges', host: true, colors: ['#d52b1e', '#1d1d1b'],
    stars: { 'Alphonso Davies': 85, 'Jonathan David': 84, 'Tajon Buchanan': 79, 'Stephen Eustáquio': 78 },
  },
  {
    id: 'sui', name: 'Suiza', code: 'SUI', flag: '🇨🇭', confed: 'UEFA', group: 'B',
    rating: 80, nick: 'La Nati', colors: ['#da291c', '#ffffff'],
    stars: { 'Granit Xhaka': 84, 'Manuel Akanji': 84, 'Dan Ndoye': 80, 'Breel Embolo': 79, 'Gregor Kobel': 85 },
  },
  {
    id: 'bih', name: 'Bosnia y Herzegovina', code: 'BIH', flag: '🇧🇦', confed: 'UEFA', group: 'B',
    rating: 75, nick: 'Los Dragones', playoff: true, colors: ['#002395', '#fecb00'],
    stars: { 'Edin Džeko': 80, 'Ermedin Demirović': 79, 'Sead Kolašinac': 77, 'Amar Dedić': 77, 'Nikola Vasilj': 75 },
  },
  {
    id: 'qat', name: 'Catar', code: 'QAT', flag: '🇶🇦', confed: 'AFC', group: 'B',
    rating: 72, nick: 'Al-Annabi', colors: ['#8a1538', '#ffffff'],
    stars: { 'Akram Afif': 79, 'Almoez Ali': 76, 'Meshaal Barsham': 73 },
  },

  // ─────────── GRUPO C ───────────
  {
    id: 'bra', name: 'Brasil', code: 'BRA', flag: '🇧🇷', confed: 'CONMEBOL', group: 'C',
    rating: 89, nick: 'La Canarinha', colors: ['#fedf00', '#009739'],
    stars: { 'Vinícius Júnior': 92, 'Raphinha': 91, 'Neymar': 87, 'Alisson': 87, 'Bruno Guimarães': 86, 'Marquinhos': 85, 'Casemiro': 84 },
  },
  {
    id: 'mar', name: 'Marruecos', code: 'MAR', flag: '🇲🇦', confed: 'CAF', group: 'C',
    rating: 84, nick: 'Leones del Atlas', colors: ['#c1272d', '#006233'],
    stars: { 'Achraf Hakimi': 90, 'Brahim Díaz': 85, 'Yassine Bounou': 85, 'Bilal El Khannouss': 81, 'Azzedine Ounahi': 80, 'Ayoub El Kaabi': 79 },
  },
  {
    id: 'sco', name: 'Escocia', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confed: 'UEFA', group: 'C',
    rating: 76, nick: 'Tartan Army', colors: ['#005eb8', '#ffffff'],
    stars: { 'Scott McTominay': 85, 'Andy Robertson': 83, 'John McGinn': 80, 'Angus Gunn': 74 },
  },
  {
    id: 'hai', name: 'Haití', code: 'HAI', flag: '🇭🇹', confed: 'CONCACAF', group: 'C',
    rating: 69, nick: 'Les Grenadiers', colors: ['#00209f', '#d21034'],
    stars: { 'Danley Jean Jacques': 74, 'Duckens Nazon': 72, 'Frantzdy Pierrot': 72 },
  },

  // ─────────── GRUPO D ───────────
  {
    id: 'usa', name: 'Estados Unidos', code: 'USA', flag: '🇺🇸', confed: 'CONCACAF', group: 'D',
    rating: 80, nick: 'The Stars and Stripes', host: true, colors: ['#1f4096', '#bf0d3e'],
    stars: { 'Christian Pulisic': 86, 'Antonee Robinson': 82, 'Weston McKennie': 81, 'Tyler Adams': 80, 'Folarin Balogun': 79, 'Matt Freese': 76 },
  },
  {
    id: 'tur', name: 'Turquía', code: 'TUR', flag: '🇹🇷', confed: 'UEFA', group: 'D',
    rating: 81, nick: 'Ay-Yıldızlılar', playoff: true, colors: ['#e30a17', '#ffffff'],
    stars: { 'Arda Güler': 87, 'Hakan Çalhanoğlu': 86, 'Kenan Yıldız': 86, 'Ferdi Kadıoğlu': 80, 'Altay Bayındır': 77 },
  },
  {
    id: 'aus', name: 'Australia', code: 'AUS', flag: '🇦🇺', confed: 'AFC', group: 'D',
    rating: 76, nick: 'Socceroos', colors: ['#ffb81c', '#00843d'],
    stars: { 'Mathew Ryan': 77, 'Harry Souttar': 76, 'Jackson Irvine': 76, 'Mathew Leckie': 74 },
  },
  {
    id: 'par', name: 'Paraguay', code: 'PAR', flag: '🇵🇾', confed: 'CONMEBOL', group: 'D',
    rating: 76, nick: 'La Albirroja', colors: ['#d52b1e', '#0038a8'],
    stars: { 'Julio Enciso': 80, 'Miguel Almirón': 78, 'Gustavo Gómez': 78, 'Antonio Sanabria': 77 },
  },

  // ─────────── GRUPO E ───────────
  {
    id: 'ger', name: 'Alemania', code: 'GER', flag: '🇩🇪', confed: 'UEFA', group: 'E',
    rating: 86, nick: 'Die Mannschaft', colors: ['#0a0a0a', '#dd0000'],
    stars: { 'Jamal Musiala': 90, 'Florian Wirtz': 90, 'Joshua Kimmich': 87, 'Antonio Rüdiger': 85, 'Nick Woltemade': 84, 'Oliver Baumann': 80 },
  },
  {
    id: 'ecu', name: 'Ecuador', code: 'ECU', flag: '🇪🇨', confed: 'CONMEBOL', group: 'E',
    rating: 79, nick: 'La Tri', colors: ['#ffdd00', '#034ea2'],
    stars: { 'Moisés Caicedo': 89, 'Willian Pacho': 85, 'Piero Hincapié': 84, 'Kendry Páez': 79, 'Enner Valencia': 76 },
  },
  {
    id: 'civ', name: 'Costa de Marfil', code: 'CIV', flag: '🇨🇮', confed: 'CAF', group: 'E',
    rating: 77, nick: 'Los Elefantes', colors: ['#f77f00', '#009e60'],
    stars: { 'Amad Diallo': 82, 'Evan Ndicka': 81, 'Franck Kessié': 80, 'Simon Adingra': 78, 'Yahia Fofana': 75 },
  },
  {
    id: 'cuw', name: 'Curazao', code: 'CUW', flag: '🇨🇼', confed: 'CONCACAF', group: 'E',
    rating: 70, nick: 'La Familia Azul', colors: ['#002b7f', '#f9e814'],
    stars: { 'Tahith Chong': 74, 'Juninho Bacuna': 74, 'Eloy Room': 71 },
  },

  // ─────────── GRUPO F ───────────
  {
    id: 'ned', name: 'Países Bajos', code: 'NED', flag: '🇳🇱', confed: 'UEFA', group: 'F',
    rating: 87, nick: 'La Oranje', colors: ['#ff7f00', '#21468b'],
    stars: { 'Virgil van Dijk': 89, 'Frenkie de Jong': 87, 'Cody Gakpo': 85, 'Tijjani Reijnders': 85, 'Denzel Dumfries': 84, 'Bart Verbruggen': 83, 'Memphis Depay': 81 },
  },
  {
    id: 'jpn', name: 'Japón', code: 'JPN', flag: '🇯🇵', confed: 'AFC', group: 'F',
    rating: 82, nick: 'Samurai Blue', colors: ['#00287d', '#dc0024'],
    stars: { 'Takefusa Kubo': 85, 'Ritsu Dōan': 82, 'Zion Suzuki': 81, 'Junya Itō': 80, 'Daichi Kamada': 80, 'Ayase Ueda': 80, 'Takehiro Tomiyasu': 79 },
  },
  {
    id: 'swe', name: 'Suecia', code: 'SWE', flag: '🇸🇪', confed: 'UEFA', group: 'F',
    rating: 81, nick: 'Blågult', playoff: true, colors: ['#006aa7', '#fecc02'],
    stars: { 'Alexander Isak': 89, 'Viktor Gyökeres': 88, 'Anthony Elanga': 82, 'Lucas Bergvall': 82, 'Victor Lindelöf': 78 },
  },
  {
    id: 'tun', name: 'Túnez', code: 'TUN', flag: '🇹🇳', confed: 'CAF', group: 'F',
    rating: 74, nick: 'Águilas de Cartago', colors: ['#e70013', '#ffffff'],
    stars: { 'Hannibal Mejbri': 76, 'Elias Achouri': 75, 'Montassar Talbi': 75, 'Aymen Dahmen': 72 },
  },

  // ─────────── GRUPO G ───────────
  {
    id: 'bel', name: 'Bélgica', code: 'BEL', flag: '🇧🇪', confed: 'UEFA', group: 'G',
    rating: 84, nick: 'Diablos Rojos', colors: ['#ed2939', '#fdda24'],
    stars: { 'Thibaut Courtois': 89, 'Kevin De Bruyne': 87, 'Jérémy Doku': 86, 'Romelu Lukaku': 83, 'Amadou Onana': 82, 'Arthur Theate': 80 },
  },
  {
    id: 'egy', name: 'Egipto', code: 'EGY', flag: '🇪🇬', confed: 'CAF', group: 'G',
    rating: 78, nick: 'Los Faraones', colors: ['#ce1126', '#0a0a0a'],
    stars: { 'Mohamed Salah': 89, 'Omar Marmoush': 84, 'Zizo': 77, 'Trézéguet': 76, 'Mohamed El Shenawy': 76 },
  },
  {
    id: 'irn', name: 'Irán', code: 'IRN', flag: '🇮🇷', confed: 'AFC', group: 'G',
    rating: 77, nick: 'Team Melli', colors: ['#239f40', '#da0000'],
    stars: { 'Mehdi Taremi': 80, 'Alireza Beiranvand': 75, 'Alireza Jahanbakhsh': 75, 'Saeid Ezatolahi': 74 },
  },
  {
    id: 'nzl', name: 'Nueva Zelanda', code: 'NZL', flag: '🇳🇿', confed: 'OFC', group: 'G',
    rating: 69, nick: 'All Whites', colors: ['#000000', '#ffffff'],
    stars: { 'Chris Wood': 79, 'Marko Stamenić': 73, 'Liberato Cacace': 73, 'Max Crocombe': 69 },
  },

  // ─────────── GRUPO H ───────────
  {
    id: 'esp', name: 'España', code: 'ESP', flag: '🇪🇸', confed: 'UEFA', group: 'H',
    rating: 93, nick: 'La Roja', colors: ['#aa151b', '#f1bf00'],
    stars: { 'Lamine Yamal': 93, 'Pedri': 92, 'Rodri': 90, 'Nico Williams': 87, 'Dani Olmo': 86, 'Fabián Ruiz': 86, 'Unai Simón': 85, 'Mikel Oyarzabal': 85 },
  },
  {
    id: 'uru', name: 'Uruguay', code: 'URU', flag: '🇺🇾', confed: 'CONMEBOL', group: 'H',
    rating: 83, nick: 'La Celeste', colors: ['#55b5e5', '#0a0a0a'],
    stars: { 'Federico Valverde': 90, 'Ronald Araújo': 85, 'Darwin Núñez': 83, 'Rodrigo Bentancur': 82, 'Manuel Ugarte': 81, 'Sergio Rochet': 79 },
  },
  {
    id: 'ksa', name: 'Arabia Saudí', code: 'KSA', flag: '🇸🇦', confed: 'AFC', group: 'H',
    rating: 73, nick: 'Halcones Verdes', colors: ['#165d31', '#ffffff'],
    stars: { 'Salem Al-Dawsari': 78, 'Firas Al-Buraikan': 74, 'Mohamed Kanno': 73 },
  },
  {
    id: 'cpv', name: 'Cabo Verde', code: 'CPV', flag: '🇨🇻', confed: 'CAF', group: 'H',
    rating: 71, nick: 'Tiburones Azules', colors: ['#003893', '#cf2027'],
    stars: { 'Logan Costa': 78, 'Ryan Mendes': 73, 'Jamiro Monteiro': 73, 'Vozinha': 70 },
  },

  // ─────────── GRUPO I ───────────
  {
    id: 'fra', name: 'Francia', code: 'FRA', flag: '🇫🇷', confed: 'UEFA', group: 'I',
    rating: 92, nick: 'Les Bleus', colors: ['#002395', '#ed2939'],
    stars: { 'Kylian Mbappé': 94, 'Ousmane Dembélé': 91, 'Michael Olise': 88, 'William Saliba': 87, 'Aurélien Tchouaméni': 86, 'Mike Maignan': 86, 'Désiré Doué': 86 },
  },
  {
    id: 'nor', name: 'Noruega', code: 'NOR', flag: '🇳🇴', confed: 'UEFA', group: 'I',
    rating: 83, nick: 'Løvene', colors: ['#ba0c2f', '#00205b'],
    stars: { 'Erling Haaland': 93, 'Martin Ødegaard': 87, 'Antonio Nusa': 82, 'Alexander Sørloth': 82, 'Kristoffer Ajer': 78, 'Ørjan Nyland': 75 },
  },
  {
    id: 'sen', name: 'Senegal', code: 'SEN', flag: '🇸🇳', confed: 'CAF', group: 'I',
    rating: 80, nick: 'Leones de la Teranga', colors: ['#00853f', '#fdef42'],
    stars: { 'Sadio Mané': 83, 'Nicolas Jackson': 82, 'Pape Matar Sarr': 82, 'Iliman Ndiaye': 81, 'Édouard Mendy': 81, 'Kalidou Koulibaly': 80 },
  },
  {
    id: 'irq', name: 'Irak', code: 'IRQ', flag: '🇮🇶', confed: 'AFC', group: 'I',
    rating: 70, nick: 'Leones de Mesopotamia', playoff: true, colors: ['#007a3d', '#ce1126'],
    stars: { 'Aymen Hussein': 73, 'Ali Al-Hamadi': 72, 'Zidane Iqbal': 72 },
  },

  // ─────────── GRUPO J ───────────
  {
    id: 'arg', name: 'Argentina', code: 'ARG', flag: '🇦🇷', confed: 'CONMEBOL', group: 'J',
    rating: 92, nick: 'La Albiceleste', champion: 2022, colors: ['#75aadb', '#f6b40e'],
    stars: { 'Lionel Messi': 93, 'Julián Alvarez': 90, 'Lautaro Martínez': 89, 'Enzo Fernández': 88, 'Alexis Mac Allister': 88, 'Emiliano Martínez': 87, 'Cristian Romero': 86 },
  },
  {
    id: 'aut', name: 'Austria', code: 'AUT', flag: '🇦🇹', confed: 'UEFA', group: 'J',
    rating: 80, nick: 'Das Team', colors: ['#ed2939', '#ffffff'],
    stars: { 'David Alaba': 82, 'Marcel Sabitzer': 81, 'Konrad Laimer': 80, 'Xaver Schlager': 79, 'Marko Arnautović': 78 },
  },
  {
    id: 'alg', name: 'Argelia', code: 'ALG', flag: '🇩🇿', confed: 'CAF', group: 'J',
    rating: 78, nick: 'Los Zorros del Desierto', colors: ['#006633', '#d21034'],
    stars: { 'Riyad Mahrez': 82, 'Amine Gouiri': 81, 'Rayan Aït-Nouri': 81, 'Mohamed Amoura': 81, 'Aïssa Mandi': 77 },
  },
  {
    id: 'jor', name: 'Jordania', code: 'JOR', flag: '🇯🇴', confed: 'AFC', group: 'J',
    rating: 71, nick: 'Al-Nashama', colors: ['#007a3d', '#ce1126'],
    stars: { 'Musa Al-Taamari': 77, 'Ali Olwan': 73, 'Mahmoud Al-Mardi': 72, 'Yazeed Abulaila': 70 },
  },

  // ─────────── GRUPO K ───────────
  {
    id: 'por', name: 'Portugal', code: 'POR', flag: '🇵🇹', confed: 'UEFA', group: 'K',
    rating: 89, nick: 'Seleção das Quinas', colors: ['#006600', '#ff0000'],
    stars: { 'Vitinha': 89, 'Bruno Fernandes': 87, 'Rúben Dias': 87, 'Cristiano Ronaldo': 86, 'Bernardo Silva': 86, 'Rafael Leão': 86, 'Diogo Costa': 85 },
  },
  {
    id: 'col', name: 'Colombia', code: 'COL', flag: '🇨🇴', confed: 'CONMEBOL', group: 'K',
    rating: 83, nick: 'Los Cafeteros', colors: ['#fcd116', '#003893'],
    stars: { 'Luis Díaz': 88, 'Daniel Muñoz': 83, 'James Rodríguez': 81, 'Richard Ríos': 81, 'Jefferson Lerma': 79, 'David Ospina': 76 },
  },
  {
    id: 'cod', name: 'RD del Congo', code: 'COD', flag: '🇨🇩', confed: 'CAF', group: 'K',
    rating: 74, nick: 'Los Leopardos', playoff: true, colors: ['#007fff', '#f7d618'],
    stars: { 'Yoane Wissa': 81, 'Chancel Mbemba': 78, 'Cédric Bakambu': 76, 'Lionel Mpasi': 72 },
  },
  {
    id: 'uzb', name: 'Uzbekistán', code: 'UZB', flag: '🇺🇿', confed: 'AFC', group: 'K',
    rating: 73, nick: 'Lobos Blancos', colors: ['#0099b5', '#ce1126'],
    stars: { 'Abdukodir Khusanov': 81, 'Eldor Shomurodov': 76, 'Abbosbek Fayzullaev': 76 },
  },

  // ─────────── GRUPO L ───────────
  {
    id: 'eng', name: 'Inglaterra', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confed: 'UEFA', group: 'L',
    rating: 90, nick: 'The Three Lions', colors: ['#ffffff', '#cf081f'],
    stars: { 'Jude Bellingham': 91, 'Harry Kane': 91, 'Bukayo Saka': 89, 'Declan Rice': 88, 'Jordan Pickford': 85, 'Marcus Rashford': 84, 'John Stones': 84 },
  },
  {
    id: 'cro', name: 'Croacia', code: 'CRO', flag: '🇭🇷', confed: 'UEFA', group: 'L',
    rating: 83, nick: 'Vatreni', colors: ['#ff0000', '#171796'],
    stars: { 'Joško Gvardiol': 86, 'Luka Modrić': 85, 'Mateo Kovačić': 83, 'Dominik Livaković': 81, 'Andrej Kramarić': 80 },
  },
  {
    id: 'gha', name: 'Ghana', code: 'GHA', flag: '🇬🇭', confed: 'CAF', group: 'L',
    rating: 75, nick: 'Black Stars', colors: ['#006b3f', '#fcd116'],
    stars: { 'Antoine Semenyo': 84, 'Iñaki Williams': 80, 'Thomas Partey': 79, 'Kamaldeen Sulemana': 78, 'Jordan Ayew': 77 },
  },
  {
    id: 'pan', name: 'Panamá', code: 'PAN', flag: '🇵🇦', confed: 'CONCACAF', group: 'L',
    rating: 73, nick: 'La Marea Roja', colors: ['#da121a', '#072357'],
    stars: { 'Adalberto Carrasquilla': 77, 'Michael Amir Murillo': 76, 'José Fajardo': 73, 'Orlando Mosquera': 72 },
  },
]

export const GROUPS = 'ABCDEFGHIJKL'.split('')

export const TEAM_BY_ID = Object.fromEntries(TEAMS.map(t => [t.id, t]))

export const groupTeams = g => TEAMS.filter(t => t.group === g)

export const STADIUMS = [
  'Estadio Azteca · Ciudad de México',
  'Estadio Akron · Guadalajara',
  'Estadio BBVA · Monterrey',
  'MetLife Stadium · Nueva York',
  'SoFi Stadium · Los Ángeles',
  'AT&T Stadium · Dallas',
  'NRG Stadium · Houston',
  'Mercedes-Benz Stadium · Atlanta',
  'Hard Rock Stadium · Miami',
  'Arrowhead Stadium · Kansas City',
  'Lincoln Financial Field · Filadelfia',
  "Levi's Stadium · San Francisco",
  'Lumen Field · Seattle',
  'Gillette Stadium · Boston',
  'BMO Field · Toronto',
  'BC Place · Vancouver',
]

export const FINAL_STADIUM = 'MetLife Stadium · Nueva York'
