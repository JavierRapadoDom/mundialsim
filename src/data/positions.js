// Posiciones específicas (demarcaciones) y sistema de adaptación posicional.
//
// Cada jugador tiene un CONJUNTO de demarcaciones que puede ocupar sin
// penalización (la primera es la principal). Las figuras llevan sus posiciones
// reales curadas (NATURAL_POS); el resto se infiere de forma determinista.
//
// Si alineas a un jugador fuera de TODAS sus demarcaciones sufre una
// penalización en su media SOLO para ese partido (penaltyForSet), mayor cuanto
// más lejos juegue de su sitio.

export const SPEC_LABEL = {
  PT: 'PT', DFC: 'DFC', LD: 'LD', LI: 'LI',
  MCD: 'MCD', MC: 'MC', MCO: 'MCO', MD: 'MD', MI: 'MI',
  ED: 'ED', EI: 'EI', DC: 'DC',
}

export const SPEC_FULL = {
  PT: 'Portero',
  DFC: 'Defensa central', LD: 'Lateral derecho', LI: 'Lateral izquierdo',
  MCD: 'Mediocentro defensivo', MC: 'Mediocentro', MCO: 'Mediapunta',
  MD: 'Interior/banda derecha', MI: 'Interior/banda izquierda',
  ED: 'Extremo derecho', EI: 'Extremo izquierdo', DC: 'Delantero centro',
}

// Línea general de cada demarcación
export const SPEC_LINE = {
  PT: 'POR',
  DFC: 'DEF', LD: 'DEF', LI: 'DEF',
  MCD: 'MED', MC: 'MED', MCO: 'MED', MD: 'MED', MI: 'MED',
  ED: 'DEL', EI: 'DEL', DC: 'DEL',
}

// Posición en el campo (línea de profundidad y banda) para medir distancias
const POS_VEC = {
  PT: { line: 0, side: 0 },
  DFC: { line: 1, side: 0 }, LD: { line: 1, side: 1.1 }, LI: { line: 1, side: -1.1 },
  MCD: { line: 2, side: 0 }, MC: { line: 2.4, side: 0 },
  MD: { line: 2.4, side: 1.1 }, MI: { line: 2.4, side: -1.1 }, MCO: { line: 3, side: 0 },
  ED: { line: 3.5, side: 1 }, EI: { line: 3.5, side: -1 }, DC: { line: 4, side: 0 },
}

// Penalización (puntos de media) por jugar en una demarcación distinta
export function posPenalty(natural, slot) {
  if (!natural || !slot || natural === slot) return 0
  const a = POS_VEC[natural], b = POS_VEC[slot]
  if (!a || !b) return 0
  // Mezclar portero con jugador de campo (o viceversa) es inviable
  if ((natural === 'PT') !== (slot === 'PT')) return 30
  const pen = 1.8 * Math.abs(a.line - b.line) + 1.5 * Math.abs(a.side - b.side)
  return Math.min(8, Math.round(pen))
}

// Penalización mínima del jugador en una casilla, considerando TODAS sus
// demarcaciones naturales (si la casilla es una de ellas → 0).
export function penaltyForSet(posSet, slot) {
  if (!posSet || !posSet.length) return 0
  let min = Infinity
  for (const p of posSet) min = Math.min(min, posPenalty(p, slot))
  return min
}

// Etiqueta cualitativa del encaje de un jugador en su casilla
export function fitOf(posPen) {
  if (posPen <= 0) return { key: 'ok', label: 'En su posición', icon: '✓' }
  if (posPen <= 2) return { key: 'adapt', label: 'Adaptado', icon: '≈' }
  if (posPen <= 4) return { key: 'warn', label: 'Improvisado', icon: '!' }
  return { key: 'bad', label: 'Fuera de sitio', icon: '✗' }
}

// ───────── Demarcaciones reales de las figuras ─────────
// Valor: string (una sola posición) o array (principal + secundarias, todas sin
// penalización). Los nombres deben coincidir exactamente con realSquads.js.
export const NATURAL_POS = {
  // Grupo A
  'Santiago Giménez': 'DC', 'Edson Álvarez': ['MCD', 'DFC'], 'Gilberto Mora': ['MCO', 'MC'], 'Raúl Jiménez': 'DC', 'César Montes': 'DFC', 'Guillermo Ochoa': 'PT',
  'Patrik Schick': 'DC', 'Tomáš Souček': ['MC', 'MCD'], 'Adam Hložek': ['DC', 'EI'], 'Vladimír Coufal': 'LD',
  'Ronwen Williams': 'PT', 'Lyle Foster': 'DC', 'Teboho Mokoena': ['MC', 'MCD'],
  'Son Heung-min': ['EI', 'DC'], 'Kim Min-jae': 'DFC', 'Lee Kang-in': ['MCO', 'MC'], 'Hwang Hee-chan': ['DC', 'EI'],
  // Grupo B
  'Alphonso Davies': ['LI', 'EI'], 'Jonathan David': 'DC', 'Tajon Buchanan': ['ED', 'LD'], 'Stephen Eustáquio': ['MC', 'MCD'],
  'Granit Xhaka': ['MC', 'MCD'], 'Manuel Akanji': ['DFC', 'LD'], 'Dan Ndoye': ['ED', 'EI'], 'Breel Embolo': 'DC', 'Gregor Kobel': 'PT',
  'Edin Džeko': 'DC', 'Ermedin Demirović': ['DC', 'EI'], 'Sead Kolašinac': ['LI', 'DFC'], 'Amar Dedić': ['LD', 'MD'], 'Nikola Vasilj': 'PT',
  'Akram Afif': ['EI', 'MCO'], 'Almoez Ali': 'DC', 'Meshaal Barsham': 'PT',
  // Grupo C
  'Vinícius Júnior': ['EI', 'DC'], 'Raphinha': ['ED', 'EI'], 'Neymar': ['MCO', 'EI'], 'Alisson': 'PT', 'Bruno Guimarães': ['MC', 'MCD'], 'Marquinhos': ['DFC', 'MCD'],
  'Achraf Hakimi': ['LD', 'ED'], 'Brahim Díaz': ['MCO', 'ED'], 'Yassine Bounou': 'PT', 'Bilal El Khannouss': ['MCO', 'MC'], 'Azzedine Ounahi': ['MC', 'MCO'], 'Ayoub El Kaabi': 'DC',
  'Scott McTominay': ['MC', 'MCO'], 'Andy Robertson': ['LI', 'MI'], 'John McGinn': ['MC', 'MCO'], 'Angus Gunn': 'PT',
  'Danley Jean Jacques': ['MC', 'MCD'], 'Duckens Nazon': 'DC', 'Frantzdy Pierrot': 'DC',
  // Grupo D
  'Christian Pulisic': ['EI', 'ED'], 'Antonee Robinson': ['LI', 'MI'], 'Weston McKennie': ['MC', 'MD'], 'Tyler Adams': 'MCD', 'Folarin Balogun': 'DC', 'Matt Freese': 'PT',
  'Arda Güler': ['MCO', 'MC'], 'Hakan Çalhanoğlu': ['MCD', 'MC'], 'Kenan Yıldız': ['EI', 'MCO'], 'Ferdi Kadıoğlu': ['LI', 'LD'], 'Altay Bayındır': 'PT',
  'Mathew Ryan': 'PT', 'Harry Souttar': 'DFC', 'Jackson Irvine': ['MC', 'MCO'], 'Mathew Leckie': ['ED', 'DC'],
  'Julio Enciso': ['MCO', 'ED'], 'Miguel Almirón': ['ED', 'MCO'], 'Gustavo Gómez': 'DFC', 'Antonio Sanabria': 'DC',
  // Grupo E
  'Jamal Musiala': ['MCO', 'EI'], 'Florian Wirtz': ['MCO', 'EI'], 'Joshua Kimmich': ['MC', 'LD'], 'Antonio Rüdiger': ['DFC', 'LI'], 'Nick Woltemade': 'DC', 'Oliver Baumann': 'PT',
  'Moisés Caicedo': ['MCD', 'MC'], 'Willian Pacho': 'DFC', 'Piero Hincapié': ['DFC', 'LI'], 'Kendry Páez': ['MCO', 'MC'], 'Enner Valencia': 'DC',
  'Amad Diallo': ['ED', 'EI'], 'Evan Ndicka': ['DFC', 'LI'], 'Franck Kessié': ['MC', 'MCD'], 'Simon Adingra': ['EI', 'ED'], 'Yahia Fofana': 'PT',
  'Tahith Chong': ['MCO', 'ED'], 'Juninho Bacuna': ['MC', 'MCD'], 'Eloy Room': 'PT',
  // Grupo F
  'Virgil van Dijk': 'DFC', 'Frenkie de Jong': ['MC', 'MCD'], 'Cody Gakpo': ['EI', 'DC'], 'Tijjani Reijnders': ['MC', 'MCO'], 'Denzel Dumfries': ['LD', 'MD'], 'Bart Verbruggen': 'PT', 'Memphis Depay': ['DC', 'MCO'],
  'Takefusa Kubo': ['ED', 'MCO'], 'Ritsu Dōan': ['ED', 'EI'], 'Zion Suzuki': 'PT', 'Junya Itō': ['ED', 'MD'], 'Daichi Kamada': ['MCO', 'MC'], 'Ayase Ueda': 'DC', 'Takehiro Tomiyasu': ['DFC', 'LD'],
  'Alexander Isak': 'DC', 'Viktor Gyökeres': 'DC', 'Anthony Elanga': ['ED', 'EI'], 'Lucas Bergvall': ['MC', 'MCO'], 'Victor Lindelöf': ['DFC', 'LD'],
  'Hannibal Mejbri': ['MC', 'MCO'], 'Elias Achouri': ['EI', 'ED'], 'Montassar Talbi': 'DFC', 'Aymen Dahmen': 'PT',
  // Grupo G
  'Thibaut Courtois': 'PT', 'Kevin De Bruyne': ['MCO', 'MC'], 'Jérémy Doku': ['EI', 'ED'], 'Romelu Lukaku': 'DC', 'Amadou Onana': ['MC', 'MCD'], 'Arthur Theate': ['DFC', 'LI'],
  'Mohamed Salah': ['ED', 'DC'], 'Omar Marmoush': ['DC', 'EI'], 'Zizo': ['EI', 'MCO'], 'Trézéguet': ['EI', 'ED'], 'Mohamed El Shenawy': 'PT',
  'Mehdi Taremi': ['DC', 'MCO'], 'Alireza Beiranvand': 'PT', 'Alireza Jahanbakhsh': ['ED', 'MCO'], 'Saeid Ezatolahi': 'MCD',
  'Chris Wood': 'DC', 'Marko Stamenić': ['MC', 'MCD'], 'Liberato Cacace': ['LI', 'MI'], 'Max Crocombe': 'PT',
  // Grupo H
  'Lamine Yamal': ['ED', 'MCO'], 'Pedri': ['MC', 'MCO'], 'Rodri': ['MCD', 'MC'], 'Nico Williams': ['EI', 'ED'], 'Dani Olmo': ['MCO', 'EI'], 'Fabián Ruiz': ['MC', 'MCO'], 'Unai Simón': 'PT', 'Mikel Oyarzabal': ['DC', 'EI'],
  'Federico Valverde': ['MC', 'MD'], 'Ronald Araújo': ['DFC', 'LD'], 'Darwin Núñez': 'DC', 'Rodrigo Bentancur': ['MC', 'MCD'], 'Manuel Ugarte': 'MCD', 'Sergio Rochet': 'PT',
  'Salem Al-Dawsari': ['EI', 'MCO'], 'Firas Al-Buraikan': 'DC', 'Mohamed Kanno': ['MC', 'MCD'],
  'Logan Costa': 'DFC', 'Ryan Mendes': ['ED', 'EI'], 'Jamiro Monteiro': ['MC', 'MCO'], 'Vozinha': 'PT',
  // Grupo I
  'Kylian Mbappé': ['DC', 'EI'], 'Ousmane Dembélé': ['ED', 'DC'], 'Michael Olise': ['ED', 'MCO'], 'William Saliba': 'DFC', 'Aurélien Tchouaméni': ['MCD', 'DFC'], 'Mike Maignan': 'PT', 'Désiré Doué': ['MCO', 'ED'],
  'Erling Haaland': 'DC', 'Martin Ødegaard': ['MCO', 'MC'], 'Antonio Nusa': ['EI', 'ED'], 'Alexander Sørloth': 'DC', 'Kristoffer Ajer': ['DFC', 'LD'], 'Ørjan Nyland': 'PT',
  'Sadio Mané': ['EI', 'DC'], 'Nicolas Jackson': 'DC', 'Pape Matar Sarr': ['MC', 'MCO'], 'Iliman Ndiaye': ['DC', 'EI'], 'Édouard Mendy': 'PT', 'Kalidou Koulibaly': 'DFC',
  'Aymen Hussein': 'DC', 'Ali Al-Hamadi': 'DC', 'Zidane Iqbal': ['MC', 'MCO'],
  // Grupo J
  'Lionel Messi': ['MCO', 'ED'], 'Julián Alvarez': ['DC', 'MCO'], 'Lautaro Martínez': 'DC', 'Enzo Fernández': ['MC', 'MCO'], 'Alexis Mac Allister': ['MC', 'MCO'], 'Emiliano Martínez': 'PT', 'Cristian Romero': 'DFC',
  'David Alaba': ['DFC', 'LI'], 'Marcel Sabitzer': ['MC', 'MCO'], 'Konrad Laimer': ['MC', 'LD'], 'Xaver Schlager': ['MCD', 'MC'], 'Marko Arnautović': 'DC',
  'Riyad Mahrez': ['ED', 'MCO'], 'Amine Gouiri': ['DC', 'EI'], 'Rayan Aït-Nouri': ['LI', 'MI'], 'Mohamed Amoura': ['DC', 'EI'], 'Aïssa Mandi': 'DFC',
  'Musa Al-Taamari': ['ED', 'MCO'], 'Ali Olwan': 'DC', 'Mahmoud Al-Mardi': 'DC', 'Yazeed Abulaila': 'PT',
  // Grupo K
  'Vitinha': ['MC', 'MCO'], 'Bruno Fernandes': ['MCO', 'MC'], 'Rúben Dias': 'DFC', 'Cristiano Ronaldo': 'DC', 'Bernardo Silva': ['MCO', 'MC'], 'Rafael Leão': ['EI', 'DC'], 'Diogo Costa': 'PT',
  'Luis Díaz': ['EI', 'DC'], 'Daniel Muñoz': ['LD', 'MD'], 'James Rodríguez': ['MCO', 'MC'], 'Richard Ríos': ['MC', 'MCD'], 'Jefferson Lerma': ['MCD', 'MC'], 'David Ospina': 'PT',
  'Yoane Wissa': ['DC', 'EI'], 'Chancel Mbemba': 'DFC', 'Cédric Bakambu': 'DC', 'Lionel Mpasi': 'PT',
  'Abdukodir Khusanov': 'DFC', 'Eldor Shomurodov': 'DC', 'Abbosbek Fayzullaev': ['MCO', 'ED'],
  // Grupo L
  'Jude Bellingham': ['MCO', 'MC'], 'Harry Kane': ['DC', 'MCO'], 'Bukayo Saka': ['ED', 'EI'], 'Declan Rice': ['MCD', 'MC'], 'Jordan Pickford': 'PT', 'Marcus Rashford': ['EI', 'DC'], 'John Stones': ['DFC', 'MCD'],
  'Joško Gvardiol': ['DFC', 'LI'], 'Luka Modrić': ['MC', 'MCO'], 'Mateo Kovačić': ['MC', 'MCD'], 'Dominik Livaković': 'PT', 'Andrej Kramarić': ['DC', 'MCO'],
  'Antoine Semenyo': ['ED', 'DC'], 'Iñaki Williams': ['DC', 'ED'], 'Thomas Partey': ['MCD', 'MC'], 'Kamaldeen Sulemana': ['EI', 'ED'], 'Jordan Ayew': ['DC', 'ED'],
  'Adalberto Carrasquilla': ['MC', 'MCO'], 'Michael Amir Murillo': ['LD', 'ED'], 'José Fajardo': 'DC', 'Orlando Mosquera': 'PT',
}

// Demarcaciones reales del resto de convocados (laterales, extremos, pivotes,
// mediapuntas, interiores…). Lo no listado usa el central por defecto de su
// línea. Revisado plantilla por plantilla.
export const NATURAL_POS_EXTRA = {
  // México
  'Jorge Sánchez': ['LD', 'DFC'], 'Jesús Gallardo': 'LI', 'Israel Reyes': ['DFC', 'LD'], 'Mateo Chávez': 'LI', 'Orbelín Pineda': ['MCO', 'MC'], 'Luis Romo': ['MCD', 'DFC'], 'Álvaro Fidalgo': ['MCO', 'MC'], 'Érik Lira': 'MCD', 'Obed Vargas': 'MCD', 'Roberto Alvarado': ['ED', 'EI'], 'Alexis Vega': ['EI', 'MCO'], 'César Huerta': 'EI',
  // República Checa
  'David Jurásek': 'LI', 'Jaroslav Zelený': 'LI', 'David Douděra': 'LD', 'Lukáš Provod': ['EI', 'MCO'], 'Michal Sadílek': 'MCD', 'Lukáš Červ': 'MCD',
  // Sudáfrica
  'Khuliso Mudau': 'LD', 'Aubrey Modiba': 'LI', 'Themba Zwane': ['MCO', 'MC'], 'Sphephelo Sithole': 'MCD', 'Oswin Appollis': 'EI', 'Thapelo Maseko': 'ED', 'Relebohile Mofokeng': ['EI', 'MCO'],
  // Corea del Sur
  'Kim Moon-hwan': 'LD', 'Seol Young-woo': 'LD', 'Park Jin-seob': 'LI', 'Hwang In-beom': ['MC', 'MCO'], 'Lee Jae-sung': ['MCO', 'MC'], 'Yang Hyun-jun': ['ED', 'EI'], 'Bae Jun-ho': ['MCO', 'EI'], 'Lee Dong-gyeong': ['MI', 'MCO'],
  // Canadá
  'Richie Laryea': ['LD', 'MD'], 'Alistair Johnston': 'LD', 'Liam Millar': ['EI', 'MI'], 'Ismaël Koné': ['MC', 'MCO'], 'Jonathan Osorio': ['MCO', 'MC'], 'Jacob Shaffelburg': 'EI', 'Cyle Larin': 'DC',
  // Suiza
  'Silvan Widmer': 'LD', 'Ricardo Rodriguez': 'LI', 'Miro Muheim': 'LI', 'Denis Zakaria': 'MCD', 'Michel Aebischer': ['MC', 'LI'], 'Djibril Sow': 'MC', 'Fabian Rieder': ['MCO', 'MI'], 'Rubén Vargas': ['EI', 'MI'], 'Noah Okafor': ['EI', 'DC'], 'Christian Fassnacht': ['MD', 'MCO'],
  // Bosnia
  'Amir Hadžiahmetović': 'MCD', 'Ivan Šunjić': 'MCD', 'Ermin Mahmić': 'MCO', 'Esmir Bajraktarević': ['ED', 'EI'],
  // Catar
  'Homam Ahmed': 'LI', 'Lucas Mendes': 'LI', 'Ayoub Al-Oui': 'LD', 'Pedro Miguel': ['LD', 'DFC'], 'Ahmed Fathy': 'MCD', 'Karim Boudiaf': 'MCD', 'Abdulaziz Hatem': ['MD', 'MC'], 'Hassan Al-Haydos': ['MCO', 'ED'], 'Ahmed Alaaeldin': 'ED', 'Edmilson Junior': ['ED', 'MCO'],
  // Brasil
  'Danilo Luiz': ['LD', 'DFC'], 'Alex Sandro': 'LI', 'Douglas Santos': 'LI', 'Casemiro': 'MCD', 'Lucas Paquetá': ['MCO', 'MC'], 'Fabinho': 'MCD', 'Danilo Santos': 'MCD', 'Gabriel Martinelli': ['EI', 'DC'], 'Matheus Cunha': ['DC', 'MCO'], 'Luiz Henrique': ['ED', 'EI'], 'Rayan': ['ED', 'DC'],
  // Marruecos
  'Noussair Mazraoui': ['LD', 'LI'], 'Zakaria El Ouahdi': 'LD', 'Anass Salah-Eddine': 'LI', 'Sofyan Amrabat': 'MCD', 'Ayyoub Bouaddi': 'MCD', 'Ismael Saibari': ['MCO', 'MC'], 'Chemsdine Talbi': ['ED', 'EI'], 'Gessime Yassine': ['EI', 'MCO'], 'Soufiane Rahimi': ['EI', 'DC'], 'Ayoube Amaimouni': 'ED',
  // Escocia
  'Nathan Patterson': 'LD', 'Kieran Tierney': 'LI', 'Anthony Ralston': 'LD', 'Aaron Hickey': ['LD', 'LI'], 'Ryan Christie': ['MCO', 'MD'], 'Ben Gannon-Doak': ['ED', 'EI'], 'Ché Adams': 'DC',
  // Haití
  'Carlens Arcus': 'LD', 'Hannes Delcroix': ['DFC', 'LI'], 'Jean-Ricner Bellegarde': ['MC', 'MCO'], 'Carl Sainté': 'MCD', 'Derrick Etienne Jr.': ['ED', 'EI'], 'Ruben Providence': ['ED', 'EI'],
  // Estados Unidos
  'Alex Freeman': 'LD', 'Sergiño Dest': ['LD', 'LI'], 'Joe Scally': ['LD', 'LI'], 'Max Arfsten': 'LI', 'Giovanni Reyna': ['MCO', 'MC'], 'Sebastian Berhalter': 'MCD', 'Malik Tillman': ['MCO', 'MC'], 'Cristian Roldan': 'MC', 'Brenden Aaronson': ['MCO', 'EI'], 'Ricardo Pepi': 'DC', 'Timothy Weah': ['ED', 'LD'], 'Alejandro Zendejas': ['ED', 'EI'],
  // Turquía
  'Zeki Çelik': 'LD', 'Mert Müldür': ['LD', 'DFC'], 'Eren Elmalı': 'LI', 'Kaan Ayhan': ['DFC', 'MCD'], 'Orkun Kökçü': ['MC', 'MCO'], 'Salih Özcan': 'MCD', 'İsmail Yüksek': 'MCD', 'Kerem Aktürkoğlu': ['EI', 'ED'], 'İrfan Can Kahveci': ['MCO', 'MD'], 'Barış Alper Yılmaz': ['ED', 'DC'], 'Oğuz Aydın': 'ED', 'Yunus Akgün': ['ED', 'EI'], 'Can Uzun': ['MCO', 'DC'],
  // Australia
  'Aziz Behich': 'LI', 'Jason Geria': 'LD', 'Jordan Bos': 'LI', "Aiden O'Neill": 'MCD', 'Connor Metcalfe': ['MC', 'MCO'], 'Nestory Irankunda': ['ED', 'EI'], 'Awer Mabil': ['ED', 'EI'], 'Cristian Volpato': ['MCO', 'MD'], 'Ajdin Hrustic': ['MCO', 'MC'], 'Nishan Velupillay': ['ED', 'DC'],
  // Paraguay
  'Juan José Cáceres': 'LD', 'Júnior Alonso': ['DFC', 'LI'], 'Ramón Sosa': ['EI', 'ED'], 'Diego Gómez': ['MC', 'MCO'], 'Andrés Cubas': 'MCD', 'Braian Ojeda': 'MCD', 'Maurício': ['MCO', 'MD'], 'Kaku': ['MCO', 'EI'],
  // Alemania
  'Nathaniel Brown': 'LI', 'David Raum': 'LI', 'Leon Goretzka': 'MC', 'Leroy Sané': ['ED', 'EI'], 'Felix Nmecha': 'MC', 'Angelo Stiller': 'MCD', 'Aleksandar Pavlović': 'MCD', 'Pascal Groß': ['MC', 'MCO'], 'Nadiem Amiri': ['MCO', 'MC'], 'Kai Havertz': ['DC', 'MCO'], 'Maximilian Beier': ['DC', 'EI'], 'Jamie Leweling': ['ED', 'EI'],
  // Ecuador
  'Pervis Estupiñán': 'LI', 'Ángelo Preciado': 'LD', 'Alan Franco': ['MCD', 'DFC'], 'Alan Minda': ['EI', 'MI'], 'Denil Castillo': 'MCD', 'Pedro Vite': ['MCO', 'MC'], 'Gonzalo Plata': ['ED', 'EI'], 'Kevin Rodríguez': 'DC', 'Nilson Angulo': ['EI', 'ED'], 'John Yeboah': 'ED',
  // Costa de Marfil
  'Ghislain Konan': 'LI', 'Wilfried Singo': ['LD', 'DFC'], 'Guéla Doué': 'LD', 'Christopher Opéri': 'LI', 'Ibrahim Sangaré': 'MCD', 'Seko Fofana': ['MC', 'MCO'], 'Jean Michaël Seri': 'MC', 'Oumar Diakité': ['DC', 'ED'], 'Nicolas Pépé': ['ED', 'EI'], 'Yan Diomande': 'ED', 'Evann Guessand': ['DC', 'EI'],
  // Curazao
  'Joshua Brenet': 'LD', 'Sherel Floranus': ['LD', 'LI'], 'Shurandy Sambo': ['LD', 'LI'], 'Riechedly Bazoer': ['MCD', 'DFC'], 'Leandro Bacuna': ['MC', 'LD'], 'Livano Comenencia': ['LD', 'MD'], 'Brandley Kuwas': ['ED', 'EI'], 'Jearl Margaritha': ['ED', 'EI'], 'Gervane Kastaneer': 'ED', 'Sontje Hansen': ['ED', 'DC'], 'Kenji Gorré': ['MCO', 'EI'],
  // Países Bajos
  'Nathan Aké': ['DFC', 'LI'], 'Lutsharel Geertruida': ['LD', 'DFC'], 'Jorrel Hato': ['DFC', 'LI'], 'Mats Wieffer': ['MCD', 'DFC'], 'Marten de Roon': 'MCD', 'Teun Koopmeiners': ['MC', 'MCO'], 'Guus Til': ['MC', 'MCO'], 'Justin Kluivert': ['EI', 'ED'], 'Ryan Gravenberch': 'MC', 'Quinten Timber': 'MC', 'Donyell Malen': ['ED', 'EI'], 'Noa Lang': 'EI', 'Crysencio Summerville': ['EI', 'ED'], 'Wout Weghorst': 'DC',
  // Japón
  'Yūto Nagatomo': 'LI', 'Hiroki Itō': ['DFC', 'LI'], 'Junnosuke Suzuki': 'LD', 'Yukinari Sugawara': 'LD', 'Daizen Maeda': ['EI', 'DC'], 'Keito Nakamura': ['EI', 'ED'], 'Ao Tanaka': 'MC', 'Kaishū Sano': 'MCD', 'Yuito Suzuki': ['MCO', 'MC'], 'Shuto Machino': ['DC', 'EI'], 'Kento Shiogai': 'ED',
  // Suecia
  'Gabriel Gudmundsson': 'LI', 'Daniel Svensson': ['LI', 'LD'], 'Eric Smith': ['DFC', 'MCD'], 'Jesper Karlström': 'MCD', 'Yasin Ayari': ['MC', 'MCO'], 'Mattias Svanberg': 'MC', 'Ken Sema': ['MI', 'LI'], 'Benjamin Nygren': ['MCO', 'ED'], 'Taha Ali': ['ED', 'EI'],
  // Túnez
  'Ali Abdi': 'LI', 'Mortadha Ben Ouanes': 'LD', 'Yan Valery': 'LD', 'Ellyes Skhiri': 'MCD', 'Ismaël Gharbi': ['MCO', 'MC'], 'Rani Khedira': 'MCD', 'Sebastian Tounekti': ['EI', 'ED'], 'Hazem Mastouri': ['EI', 'ED'], 'Elias Saad': ['EI', 'ED'], 'Firas Chaouat': 'DC',
  // Bélgica
  'Thomas Meunier': 'LD', 'Timothy Castagne': ['LD', 'LI'], 'Maxim De Cuyper': 'LI', 'Zeno Debast': 'DFC', 'Joaquin Seys': ['LI', 'LD'], 'Axel Witsel': ['MCD', 'DFC'], 'Youri Tielemans': 'MC', 'Hans Vanaken': ['MCO', 'MC'], 'Nicolas Raskin': 'MCD', 'Alexis Saelemaekers': ['MD', 'ED'], 'Diego Moreira': ['EI', 'LI'], 'Leandro Trossard': ['EI', 'DC'], 'Dodi Lukébakio': ['ED', 'EI'], 'Charles De Ketelaere': ['MCO', 'DC'], 'Matias Fernandez-Pardo': 'EI',
  // Egipto
  'Mohamed Hany': 'LD', 'Ahmed Fatouh': 'LI', 'Karim Hafez': 'LI', 'Emam Ashour': ['MCO', 'MC'], 'Marwan Attia': 'MCD', 'Hamdy Fathy': 'MCD', 'Ibrahim Adel': ['ED', 'MCO'], 'Haissem Hassan': ['ED', 'EI'],
  // Irán
  'Ehsan Hajsafi': 'LI', 'Milad Mohammadi': 'LI', 'Ramin Rezaeian': 'LD', 'Saleh Hardani': 'LD', 'Saman Ghoddos': ['MCO', 'MC'], 'Rouzbeh Cheshmi': 'MCD', 'Mehdi Torabi': ['MC', 'ED'], 'Mohammad Mohebi': ['ED', 'EI'], 'Amirhossein Hosseinzadeh': ['EI', 'ED'], 'Mehdi Ghayedi': ['EI', 'ED'],
  // Nueva Zelanda
  'Francis de Vries': 'LI', 'Tim Payne': ['LD', 'DFC'], 'Michael Boxall': 'DFC', 'Elijah Just': ['EI', 'MI'], 'Sarpreet Singh': ['MCO', 'MC'], 'Ben Old': ['MCO', 'ED'], 'Alex Rufer': 'MCD', 'Joe Bell': 'MCD', 'Ryan Thomas': ['MCO', 'MD'], 'Kosta Barbarouses': ['ED', 'EI'],
  // España
  'Eric García': ['DFC', 'LD'], 'Marcos Llorente': ['LD', 'MC'], 'Marc Cucurella': 'LI', 'Pedro Porro': 'LD', 'Marc Pubill': 'LD', 'Álex Grimaldo': 'LI', 'Mikel Merino': ['MC', 'MCO'], 'Gavi': ['MCO', 'MC'], 'Martín Zubimendi': 'MCD', 'Álex Baena': ['MCO', 'EI'], 'Ferran Torres': ['DC', 'EI'], 'Borja Iglesias': 'DC', 'Yéremy Pino': ['ED', 'EI'],
  // Uruguay
  'Matías Viña': 'LI', 'Guillermo Varela': 'LD', 'Mathías Olivera': 'LI', 'Giorgian de Arrascaeta': ['MCO', 'MC'], 'Maximiliano Araújo': ['MI', 'EI'], 'Nicolás de la Cruz': ['MCO', 'MC'], 'Joaquín Piquerez': 'LI', 'Rodrigo Zalazar': ['MCO', 'MC'], 'Agustín Canobbio': ['ED', 'MD'], 'Juan Manuel Sanabria': 'LI', 'Brian Rodríguez': ['ED', 'EI'], 'Facundo Pellistri': 'ED',
  // Arabia Saudí
  'Saud Abdulhamid': 'LD', 'Jehad Thakri': 'LD', 'Mohammed Abu Al-Shamat': 'LI', 'Moteb Al-Harbi': 'LD', 'Nasser Al-Dawsari': ['MC', 'EI'], 'Musab Al-Juwayr': ['MCO', 'MC'], 'Abdullah Al-Khaibari': 'MCD', 'Ziyad Al-Johani': ['MD', 'ED'], 'Abdullah Al-Hamdan': ['DC', 'EI'], 'Sultan Mandash': ['ED', 'EI'], 'Khalid Al-Ghannam': ['EI', 'MCO'],
  // Cabo Verde
  'Stopira': ['LI', 'DFC'], 'Sidny Lopes Cabral': 'LI', 'Steven Moreira': 'LD', 'Wagner Pina': 'LD', 'Garry Rodrigues': ['ED', 'EI'], 'Kevin Pina': ['EI', 'MI'], 'João Paulo': 'MCD', 'Willy Semedo': ['MCO', 'ED'], 'Jovane Cabral': ['EI', 'DC'], 'Yannick Semedo': 'MCO', 'Telmo Arcanjo': ['MCO', 'MC'], 'Dailon Livramento': ['ED', 'DC'], 'Gilson Benchimol': 'EI',
  // Francia
  'Lucas Digne': 'LI', 'Jules Koundé': ['LD', 'DFC'], 'Théo Hernandez': 'LI', 'Lucas Hernandez': ['LI', 'DFC'], 'Malo Gusto': 'LD', "N'Golo Kanté": 'MCD', 'Adrien Rabiot': ['MC', 'MCO'], 'Manu Koné': 'MC', 'Warren Zaïre-Emery': 'MC', 'Rayan Cherki': ['MCO', 'ED'], 'Maghnes Akliouche': ['MCO', 'ED'], 'Marcus Thuram': ['DC', 'ED'], 'Bradley Barcola': ['EI', 'ED'],
  // Noruega
  'David Møller Wolfe': 'LI', 'Fredrik André Bjørkan': 'LI', 'Marcus Holmgren Pedersen': 'LD', 'Patrick Berg': 'MCD', 'Sander Berge': ['MC', 'MCD'], 'Kristian Thorstvedt': ['MC', 'MCO'], 'Andreas Schjelderup': ['EI', 'MCO'], 'Jens Petter Hauge': ['EI', 'ED'], 'Fredrik Aursnes': ['MC', 'LD'], 'Thelo Aasgaard': ['MCO', 'MC'], 'Oscar Bobb': ['ED', 'EI'], 'Jørgen Strand Larsen': 'DC', 'Julian Ryerson': ['LD', 'LI'],
  // Senegal
  'Krépin Diatta': ['LD', 'ED'], 'Antoine Mendy': 'LD', 'Ismail Jakobs': 'LI', 'El Hadji Malick Diouf': 'LI', 'Idrissa Gueye': 'MCD', 'Habib Diarra': ['MC', 'MCO'], 'Pathé Ciss': 'MCD', 'Pape Gueye': 'MCD', 'Lamine Camara': 'MC', 'Ismaïla Sarr': ['ED', 'EI'], 'Assane Diao': ['EI', 'ED'],
  // Irak
  'Hussein Ali': ['LI', 'DFC'], 'Akam Hashim': 'LD', 'Mustafa Saadoon': 'LI', 'Ibrahim Bayesh': ['MCO', 'MC'], 'Youssef Amyn': ['ED', 'EI'], 'Amir Al-Ammari': 'MC', 'Kevin Yakob': ['MCO', 'ED'], 'Zaid Ismail': 'MCD', 'Mohanad Ali': 'DC', 'Ahmed Qasem': ['ED', 'EI'], 'Ali Jasim': ['MCO', 'EI'],
  // Argentina
  'Nicolás Tagliafico': 'LI', 'Gonzalo Montiel': 'LD', 'Lisandro Martínez': ['DFC', 'LI'], 'Nahuel Molina': 'LD', 'Facundo Medina': ['DFC', 'LI'], 'Leandro Paredes': 'MCD', 'Rodrigo De Paul': ['MC', 'MD'], 'Giovani Lo Celso': ['MCO', 'MC'], 'Exequiel Palacios': 'MC', 'Nicolás González': ['EI', 'ED'], 'Valentín Barco': 'LI', 'Giuliano Simeone': ['ED', 'DC'], 'Nico Paz': ['MCO', 'MC'], 'Thiago Almada': ['MCO', 'EI'],
  // Austria
  'Stefan Posch': ['LD', 'DFC'], 'Phillipp Mwene': ['LI', 'LD'], 'Florian Grillitsch': 'MCD', 'Romano Schmid': ['MCO', 'MD'], 'Alexander Prass': ['LI', 'MI'], 'Nicolas Seiwald': 'MCD', 'Paul Wanner': ['MCO', 'MC'], 'Alessandro Schöpf': 'MCO', 'Carney Chukwuemeka': ['MC', 'MCO'], 'Patrick Wimmer': ['EI', 'ED'],
  // Argelia
  'Ramy Bensebaini': ['LI', 'DFC'], 'Jaouen Hadjam': 'LI', 'Rafik Belghali': 'LD', 'Ramiz Zerrouki': 'MCD', 'Hicham Boudaoui': ['MC', 'MCO'], 'Nabil Bentaleb': 'MCD', 'Ibrahim Maza': ['MCO', 'MC'], 'Houssem Aouar': ['MCO', 'MC'], 'Farès Chaïbi': ['MCO', 'ED'], 'Farès Ghedjemis': ['EI', 'DC'], 'Adil Boulbina': 'ED', 'Anis Hadj Moussa': ['ED', 'EI'],
  // Jordania
  'Abdallah Nasib': 'LD', 'Mohammad Abu Hashish': 'LI', 'Salim Obaid': 'LD', 'Husam Abu Dahab': 'LI', 'Ibrahim Sadeh': 'MCD', 'Noor Al-Rawabdeh': ['MCO', 'MC'], 'Amer Jamous': ['MD', 'MC'], 'Mohannad Abu Taha': 'MI', 'Ali Azaizeh': ['ED', 'MCO'], 'Odeh Al-Fakhouri': ['EI', 'ED'],
  // Portugal
  'João Cancelo': ['LD', 'LI'], 'Nélson Semedo': 'LD', 'Gonçalo Inácio': ['DFC', 'LI'], 'Nuno Mendes': 'LI', 'Diogo Dalot': ['LD', 'LI'], 'Renato Veiga': ['DFC', 'LI'], 'Samú Costa': 'MCD', 'Rúben Neves': 'MCD', 'João Neves': ['MC', 'MCD'], 'Matheus Nunes': ['MC', 'LD'], 'João Félix': ['MCO', 'EI'], 'Gonçalo Ramos': 'DC', 'Pedro Neto': ['ED', 'EI'], 'Gonçalo Guedes': ['EI', 'DC'], 'Francisco Trincão': ['ED', 'EI'], 'Francisco Conceição': ['ED', 'EI'],
  // Colombia
  'Santiago Arias': 'LD', 'Gustavo Puerta': ['MCD', 'LD'], 'Johan Mojica': 'LI', 'Deiver Machado': 'LI', 'Kevin Castaño': 'MCD', 'Jorge Carrascal': ['MCO', 'EI'], 'Juan Fernando Quintero': ['MCO', 'MC'], 'Jhon Arias': ['ED', 'MCO'], 'Juan Portilla': 'MCD', 'Jhon Córdoba': 'DC', 'Cucho Hernández': ['DC', 'EI'], 'Jaminton Campaz': ['EI', 'MCO'], 'Andrés Gómez': ['ED', 'EI'],
  // RD del Congo
  'Joris Kayembe': ['LI', 'LD'], 'Gédéon Kalulu': 'LD', 'Arthur Masuaku': 'LI', 'Aaron Wan-Bissaka': 'LD', 'Charles Pickel': 'MCD', "Ngal'ayel Mukau": 'MC', 'Samuel Moutoussamy': 'MC', 'Nathanaël Mbuku': ['EI', 'MCO'], 'Théo Bongonda': ['EI', 'ED'], 'Edo Kayembe': 'MCD', 'Noah Sadiki': 'MCD', 'Fiston Mayele': ['DC', 'ED'], 'Gaël Kakuta': ['MCO', 'EI'], 'Meschak Elia': ['ED', 'EI'],
  // Uzbekistán
  'Farrukh Sayfiev': 'LD', 'Khojiakbar Alijonov': 'LD', 'Jakhongir Urozov': 'LI', 'Otabek Shukurov': 'MCD', 'Odiljon Hamrobekov': ['MC', 'MCO'], 'Jaloliddin Masharipov': ['MCO', 'EI'], 'Jamshid Iskanderov': ['MCO', 'MD'], 'Akmal Mozgovoy': 'MI', 'Oston Urunov': ['MCO', 'EI'], 'Dostonbek Khamdamov': ['EI', 'ED'], 'Igor Sergeev': 'DC',
  // Inglaterra
  'Ezri Konsa': ['DFC', 'LD'], 'Reece James': 'LD', "Nico O'Reilly": ['LI', 'DFC'], 'Dan Burn': 'DFC', 'Djed Spence': ['LI', 'LD'], 'Tino Livramento': ['LD', 'LI'], 'Jordan Henderson': 'MC', 'Morgan Rogers': ['MCO', 'MC'], 'Elliot Anderson': 'MC', 'Eberechi Eze': ['MCO', 'EI'], 'Kobbie Mainoo': 'MC', 'Ivan Toney': 'DC', 'Anthony Gordon': ['EI', 'ED'], 'Ollie Watkins': 'DC', 'Noni Madueke': ['ED', 'EI'],
  // Croacia
  'Josip Stanišić': ['LD', 'DFC'], 'Kristijan Jakić': ['DFC', 'LD'], 'Mario Pašalić': ['MCO', 'MC'], 'Nikola Vlašić': ['MCO', 'MC'], 'Martin Baturina': ['MCO', 'MC'], 'Luka Sučić': ['MC', 'MCO'], 'Nikola Moro': 'MCD', 'Toni Fruk': 'MCO', 'Petar Sučić': 'MC', 'Ivan Perišić': ['EI', 'LI'], 'Marco Pašalić': ['ED', 'EI'], 'Igor Matanović': ['DC', 'EI'],
  // Ghana
  'Abdul Rahman Baba': 'LI', 'Gideon Mensah': 'LI', 'Alidu Seidu': ['LD', 'DFC'], 'Marvin Senaya': 'LD', 'Elisha Owusu': 'MCD', 'Caleb Yirenkyi': 'MC', 'Kwasi Sibo': 'MCD', 'Augustine Boakye': ['ED', 'MCO'], 'Abdul Fatawu': ['ED', 'EI'], 'Prince Kwabena Adu': 'EI', 'Ernest Nuamah': ['EI', 'ED'], 'Christopher Bonsu Baah': ['ED', 'DC'],
  // Panamá
  'Andrés Andrade': ['DFC', 'MCD'], 'César Blackman': 'LD', 'Eric Davis': 'LI', 'Carlos Harvey': ['MCD', 'MC'], 'Yoel Bárcenas': ['MD', 'MCO'], 'César Yanis': ['ED', 'MCO'], 'Alberto Quintero': ['MD', 'ED'], 'Aníbal Godoy': 'MCD', 'Cristian Martínez': ['MI', 'MCO'], 'José Luis Rodríguez': ['EI', 'ED'], 'Ismael Díaz': ['MCO', 'DC'], 'Cecilio Waterman': 'DC', 'Tomás Rodríguez': 'EI',
}

// Por defecto, un jugador no curado ocupa la posición CENTRAL de su línea (lo
// más habitual: central, mediocentro o delantero centro). Los laterales,
// extremos, interiores, pivotes y mediapuntas van curados en NATURAL_POS_EXTRA.
const INFER_DEFAULT = { POR: 'PT', DEF: 'DFC', MED: 'MC', DEL: 'DC' }
const INFER_ALT = { PT: [], DFC: [], MC: ['MCD'], DC: [] }

export function inferSpecific(generalPos) {
  return INFER_DEFAULT[generalPos] ?? 'MC'
}

// Conjunto de demarcaciones de un jugador (principal primero)
export function posSetFor(name, generalPos) {
  const entry = NATURAL_POS[name] ?? NATURAL_POS_EXTRA[name]
  if (entry) return Array.isArray(entry) ? entry : [entry]
  const inf = inferSpecific(generalPos)
  return [inf, ...(INFER_ALT[inf] || [])]
}

// ───────── Casillas de cada formación (con coordenadas en el campo) ─────────
// x: 0 (izquierda) → 100 (derecha) · y: 0 (portería rival) → 100 (portería propia)
export const FORMATION_SLOTS = {
  '4-3-3': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'LD', x: 84, y: 70 }, { pos: 'DFC', x: 61, y: 73 }, { pos: 'DFC', x: 39, y: 73 }, { pos: 'LI', x: 16, y: 70 },
    { pos: 'MCD', x: 50, y: 54 }, { pos: 'MC', x: 72, y: 46 }, { pos: 'MC', x: 28, y: 46 },
    { pos: 'ED', x: 82, y: 22 }, { pos: 'DC', x: 50, y: 16 }, { pos: 'EI', x: 18, y: 22 },
  ],
  '4-4-2': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'LD', x: 85, y: 70 }, { pos: 'DFC', x: 61, y: 73 }, { pos: 'DFC', x: 39, y: 73 }, { pos: 'LI', x: 15, y: 70 },
    { pos: 'MD', x: 83, y: 46 }, { pos: 'MC', x: 59, y: 49 }, { pos: 'MC', x: 41, y: 49 }, { pos: 'MI', x: 17, y: 46 },
    { pos: 'DC', x: 62, y: 18 }, { pos: 'DC', x: 38, y: 18 },
  ],
  '4-2-3-1': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'LD', x: 85, y: 70 }, { pos: 'DFC', x: 61, y: 73 }, { pos: 'DFC', x: 39, y: 73 }, { pos: 'LI', x: 15, y: 70 },
    { pos: 'MCD', x: 62, y: 57 }, { pos: 'MCD', x: 38, y: 57 },
    { pos: 'MD', x: 84, y: 33 }, { pos: 'MCO', x: 50, y: 31 }, { pos: 'MI', x: 16, y: 33 },
    { pos: 'DC', x: 50, y: 14 },
  ],
  '4-1-4-1': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'LD', x: 85, y: 70 }, { pos: 'DFC', x: 61, y: 73 }, { pos: 'DFC', x: 39, y: 73 }, { pos: 'LI', x: 15, y: 70 },
    { pos: 'MCD', x: 50, y: 58 },
    { pos: 'MD', x: 84, y: 40 }, { pos: 'MC', x: 64, y: 42 }, { pos: 'MC', x: 36, y: 42 }, { pos: 'MI', x: 16, y: 40 },
    { pos: 'DC', x: 50, y: 15 },
  ],
  '4-4-2 ◇': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'LD', x: 85, y: 70 }, { pos: 'DFC', x: 61, y: 73 }, { pos: 'DFC', x: 39, y: 73 }, { pos: 'LI', x: 15, y: 70 },
    { pos: 'MCD', x: 50, y: 60 }, { pos: 'MC', x: 74, y: 46 }, { pos: 'MC', x: 26, y: 46 }, { pos: 'MCO', x: 50, y: 34 },
    { pos: 'DC', x: 62, y: 16 }, { pos: 'DC', x: 38, y: 16 },
  ],
  '3-5-2': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'DFC', x: 68, y: 73 }, { pos: 'DFC', x: 50, y: 75 }, { pos: 'DFC', x: 32, y: 73 },
    { pos: 'MD', x: 87, y: 49 }, { pos: 'MCD', x: 38, y: 55 }, { pos: 'MC', x: 62, y: 51 }, { pos: 'MCO', x: 50, y: 34 }, { pos: 'MI', x: 13, y: 49 },
    { pos: 'DC', x: 61, y: 16 }, { pos: 'DC', x: 39, y: 16 },
  ],
  '3-4-3': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'DFC', x: 68, y: 73 }, { pos: 'DFC', x: 50, y: 75 }, { pos: 'DFC', x: 32, y: 73 },
    { pos: 'MD', x: 86, y: 48 }, { pos: 'MC', x: 60, y: 52 }, { pos: 'MC', x: 40, y: 52 }, { pos: 'MI', x: 14, y: 48 },
    { pos: 'ED', x: 80, y: 20 }, { pos: 'DC', x: 50, y: 16 }, { pos: 'EI', x: 20, y: 20 },
  ],
  '3-4-1-2': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'DFC', x: 68, y: 74 }, { pos: 'DFC', x: 50, y: 76 }, { pos: 'DFC', x: 32, y: 74 },
    { pos: 'MD', x: 87, y: 50 }, { pos: 'MC', x: 62, y: 54 }, { pos: 'MC', x: 38, y: 54 }, { pos: 'MI', x: 13, y: 50 }, { pos: 'MCO', x: 50, y: 36 },
    { pos: 'DC', x: 61, y: 17 }, { pos: 'DC', x: 39, y: 17 },
  ],
  '5-3-2': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'LD', x: 88, y: 65 }, { pos: 'DFC', x: 68, y: 74 }, { pos: 'DFC', x: 50, y: 76 }, { pos: 'DFC', x: 32, y: 74 }, { pos: 'LI', x: 12, y: 65 },
    { pos: 'MCD', x: 50, y: 54 }, { pos: 'MC', x: 70, y: 46 }, { pos: 'MCO', x: 30, y: 44 },
    { pos: 'DC', x: 61, y: 18 }, { pos: 'DC', x: 39, y: 18 },
  ],
  '5-4-1': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'LD', x: 88, y: 64 }, { pos: 'DFC', x: 68, y: 74 }, { pos: 'DFC', x: 50, y: 76 }, { pos: 'DFC', x: 32, y: 74 }, { pos: 'LI', x: 12, y: 64 },
    { pos: 'MD', x: 84, y: 46 }, { pos: 'MC', x: 60, y: 48 }, { pos: 'MC', x: 40, y: 48 }, { pos: 'MI', x: 16, y: 46 },
    { pos: 'DC', x: 50, y: 18 },
  ],
}
