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

// Secundaria conservadora para los jugadores no curados (flancos y mediocampo
// pueden cubrir su rol contiguo; defensas centrales y delanteros, especialistas).
const INFER_ALT = {
  LD: ['MD'], LI: ['MI'], MD: ['LD'], MI: ['LI'],
  MC: ['MCD'], MCD: ['MC'], MCO: ['MC'],
  ED: ['MD'], EI: ['MI'],
  DFC: [], DC: [], PT: [],
}

// Patrón determinista para inferir la demarcación de jugadores sin curar
const INFER = {
  DEF: ['DFC', 'DFC', 'LD', 'LI', 'DFC', 'LD', 'LI', 'DFC', 'DFC'],
  MED: ['MC', 'MCD', 'MCO', 'MC', 'MD', 'MI', 'MCD', 'MC', 'MCO'],
  DEL: ['DC', 'ED', 'EI', 'DC', 'ED', 'EI', 'DC'],
}

export function inferSpecific(generalPos, idxInLine) {
  if (generalPos === 'POR') return 'PT'
  const arr = INFER[generalPos]
  return arr[idxInLine % arr.length]
}

// Conjunto de demarcaciones de un jugador (principal primero)
export function posSetFor(name, generalPos, idxInLine) {
  const entry = NATURAL_POS[name]
  if (entry) return Array.isArray(entry) ? entry : [entry]
  const inf = inferSpecific(generalPos, idxInLine)
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
