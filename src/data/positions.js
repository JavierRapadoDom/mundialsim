// Posiciones específicas (demarcaciones) y sistema de adaptación posicional.
//
// Cada jugador tiene una posición NATURAL específica. Las figuras llevan su
// demarcación real curada (NATURAL_POS); el resto se infiere de forma
// determinista a partir de su posición general y su sitio en la plantilla.
//
// Si alineas a un jugador fuera de su demarcación natural sufre una
// penalización en su media SOLO para ese partido (posPenalty), mayor cuanto más
// lejos juegue de su sitio.

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

// Línea general de cada demarcación (para emparejar con el XI por líneas)
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

// Penalización (puntos de media) por jugar en una demarcación distinta a la natural
export function posPenalty(natural, slot) {
  if (!natural || !slot || natural === slot) return 0
  const a = POS_VEC[natural], b = POS_VEC[slot]
  if (!a || !b) return 0
  // Mezclar portero con jugador de campo (o viceversa) es catastrófico
  if ((natural === 'PT') !== (slot === 'PT')) return 12
  const pen = 1.8 * Math.abs(a.line - b.line) + 1.5 * Math.abs(a.side - b.side)
  return Math.min(8, Math.round(pen))
}

// Etiqueta cualitativa del encaje de un jugador en su casilla
export function fitOf(posPen) {
  if (posPen <= 0) return { key: 'ok', label: 'En su posición', icon: '✓' }
  if (posPen <= 2) return { key: 'adapt', label: 'Adaptado', icon: '≈' }
  if (posPen <= 4) return { key: 'warn', label: 'Improvisado', icon: '!' }
  return { key: 'bad', label: 'Fuera de sitio', icon: '✗' }
}

// ───────── Demarcación natural real de las figuras ─────────
// (los nombres deben coincidir exactamente con realSquads.js)
export const NATURAL_POS = {
  // Grupo A
  'Santiago Giménez': 'DC', 'Edson Álvarez': 'MCD', 'Gilberto Mora': 'MCO', 'Raúl Jiménez': 'DC', 'César Montes': 'DFC', 'Guillermo Ochoa': 'PT',
  'Patrik Schick': 'DC', 'Tomáš Souček': 'MC', 'Adam Hložek': 'DC', 'Vladimír Coufal': 'LD',
  'Ronwen Williams': 'PT', 'Lyle Foster': 'DC', 'Teboho Mokoena': 'MC',
  'Son Heung-min': 'EI', 'Kim Min-jae': 'DFC', 'Lee Kang-in': 'MCO', 'Hwang Hee-chan': 'DC',
  // Grupo B
  'Alphonso Davies': 'LI', 'Jonathan David': 'DC', 'Tajon Buchanan': 'ED', 'Stephen Eustáquio': 'MC',
  'Granit Xhaka': 'MC', 'Manuel Akanji': 'DFC', 'Dan Ndoye': 'ED', 'Breel Embolo': 'DC', 'Gregor Kobel': 'PT',
  'Edin Džeko': 'DC', 'Ermedin Demirović': 'DC', 'Sead Kolašinac': 'LI', 'Amar Dedić': 'LD', 'Nikola Vasilj': 'PT',
  'Akram Afif': 'EI', 'Almoez Ali': 'DC', 'Meshaal Barsham': 'PT',
  // Grupo C
  'Vinícius Júnior': 'EI', 'Raphinha': 'ED', 'Neymar': 'MCO', 'Alisson': 'PT', 'Bruno Guimarães': 'MC', 'Marquinhos': 'DFC',
  'Achraf Hakimi': 'LD', 'Brahim Díaz': 'MCO', 'Yassine Bounou': 'PT', 'Bilal El Khannouss': 'MCO', 'Azzedine Ounahi': 'MC', 'Ayoub El Kaabi': 'DC',
  'Scott McTominay': 'MC', 'Andy Robertson': 'LI', 'John McGinn': 'MC', 'Angus Gunn': 'PT',
  'Danley Jean Jacques': 'MC', 'Duckens Nazon': 'DC', 'Frantzdy Pierrot': 'DC',
  // Grupo D
  'Christian Pulisic': 'EI', 'Antonee Robinson': 'LI', 'Weston McKennie': 'MC', 'Tyler Adams': 'MCD', 'Folarin Balogun': 'DC', 'Matt Freese': 'PT',
  'Arda Güler': 'MCO', 'Hakan Çalhanoğlu': 'MC', 'Kenan Yıldız': 'EI', 'Ferdi Kadıoğlu': 'LI', 'Altay Bayındır': 'PT',
  'Mathew Ryan': 'PT', 'Harry Souttar': 'DFC', 'Jackson Irvine': 'MC', 'Mathew Leckie': 'ED',
  'Julio Enciso': 'MCO', 'Miguel Almirón': 'ED', 'Gustavo Gómez': 'DFC', 'Antonio Sanabria': 'DC',
  // Grupo E
  'Jamal Musiala': 'MCO', 'Florian Wirtz': 'MCO', 'Joshua Kimmich': 'MC', 'Antonio Rüdiger': 'DFC', 'Nick Woltemade': 'DC', 'Oliver Baumann': 'PT',
  'Moisés Caicedo': 'MCD', 'Willian Pacho': 'DFC', 'Piero Hincapié': 'DFC', 'Kendry Páez': 'MCO', 'Enner Valencia': 'DC',
  'Amad Diallo': 'ED', 'Evan Ndicka': 'DFC', 'Franck Kessié': 'MC', 'Simon Adingra': 'EI', 'Yahia Fofana': 'PT',
  'Tahith Chong': 'MCO', 'Juninho Bacuna': 'MC', 'Eloy Room': 'PT',
  // Grupo F
  'Virgil van Dijk': 'DFC', 'Frenkie de Jong': 'MC', 'Cody Gakpo': 'EI', 'Tijjani Reijnders': 'MC', 'Denzel Dumfries': 'LD', 'Bart Verbruggen': 'PT', 'Memphis Depay': 'DC',
  'Takefusa Kubo': 'ED', 'Ritsu Dōan': 'ED', 'Zion Suzuki': 'PT', 'Junya Itō': 'ED', 'Daichi Kamada': 'MCO', 'Ayase Ueda': 'DC', 'Takehiro Tomiyasu': 'DFC',
  'Alexander Isak': 'DC', 'Viktor Gyökeres': 'DC', 'Anthony Elanga': 'ED', 'Lucas Bergvall': 'MC', 'Victor Lindelöf': 'DFC',
  'Hannibal Mejbri': 'MC', 'Elias Achouri': 'EI', 'Montassar Talbi': 'DFC', 'Aymen Dahmen': 'PT',
  // Grupo G
  'Thibaut Courtois': 'PT', 'Kevin De Bruyne': 'MCO', 'Jérémy Doku': 'EI', 'Romelu Lukaku': 'DC', 'Amadou Onana': 'MC', 'Arthur Theate': 'DFC',
  'Mohamed Salah': 'ED', 'Omar Marmoush': 'DC', 'Zizo': 'EI', 'Trézéguet': 'EI', 'Mohamed El Shenawy': 'PT',
  'Mehdi Taremi': 'DC', 'Alireza Beiranvand': 'PT', 'Alireza Jahanbakhsh': 'ED', 'Saeid Ezatolahi': 'MCD',
  'Chris Wood': 'DC', 'Marko Stamenić': 'MC', 'Liberato Cacace': 'LI', 'Max Crocombe': 'PT',
  // Grupo H
  'Lamine Yamal': 'ED', 'Pedri': 'MC', 'Rodri': 'MCD', 'Nico Williams': 'EI', 'Dani Olmo': 'MCO', 'Fabián Ruiz': 'MC', 'Unai Simón': 'PT', 'Mikel Oyarzabal': 'DC',
  'Federico Valverde': 'MC', 'Ronald Araújo': 'DFC', 'Darwin Núñez': 'DC', 'Rodrigo Bentancur': 'MC', 'Manuel Ugarte': 'MCD', 'Sergio Rochet': 'PT',
  'Salem Al-Dawsari': 'EI', 'Firas Al-Buraikan': 'DC', 'Mohamed Kanno': 'MC',
  'Logan Costa': 'DFC', 'Ryan Mendes': 'ED', 'Jamiro Monteiro': 'MC', 'Vozinha': 'PT',
  // Grupo I
  'Kylian Mbappé': 'DC', 'Ousmane Dembélé': 'ED', 'Michael Olise': 'ED', 'William Saliba': 'DFC', 'Aurélien Tchouaméni': 'MCD', 'Mike Maignan': 'PT', 'Désiré Doué': 'MCO',
  'Erling Haaland': 'DC', 'Martin Ødegaard': 'MCO', 'Antonio Nusa': 'EI', 'Alexander Sørloth': 'DC', 'Kristoffer Ajer': 'DFC', 'Ørjan Nyland': 'PT',
  'Sadio Mané': 'EI', 'Nicolas Jackson': 'DC', 'Pape Matar Sarr': 'MC', 'Iliman Ndiaye': 'DC', 'Édouard Mendy': 'PT', 'Kalidou Koulibaly': 'DFC',
  'Aymen Hussein': 'DC', 'Ali Al-Hamadi': 'DC', 'Zidane Iqbal': 'MC',
  // Grupo J
  'Lionel Messi': 'MCO', 'Julián Alvarez': 'DC', 'Lautaro Martínez': 'DC', 'Enzo Fernández': 'MC', 'Alexis Mac Allister': 'MC', 'Emiliano Martínez': 'PT', 'Cristian Romero': 'DFC',
  'David Alaba': 'DFC', 'Marcel Sabitzer': 'MC', 'Konrad Laimer': 'MC', 'Xaver Schlager': 'MCD', 'Marko Arnautović': 'DC',
  'Riyad Mahrez': 'ED', 'Amine Gouiri': 'DC', 'Rayan Aït-Nouri': 'LI', 'Mohamed Amoura': 'DC', 'Aïssa Mandi': 'DFC',
  'Musa Al-Taamari': 'ED', 'Ali Olwan': 'DC', 'Mahmoud Al-Mardi': 'DC', 'Yazeed Abulaila': 'PT',
  // Grupo K
  'Vitinha': 'MC', 'Bruno Fernandes': 'MCO', 'Rúben Dias': 'DFC', 'Cristiano Ronaldo': 'DC', 'Bernardo Silva': 'MCO', 'Rafael Leão': 'EI', 'Diogo Costa': 'PT',
  'Luis Díaz': 'EI', 'Daniel Muñoz': 'LD', 'James Rodríguez': 'MCO', 'Richard Ríos': 'MC', 'Jefferson Lerma': 'MCD', 'David Ospina': 'PT',
  'Yoane Wissa': 'DC', 'Chancel Mbemba': 'DFC', 'Cédric Bakambu': 'DC', 'Lionel Mpasi': 'PT',
  'Abdukodir Khusanov': 'DFC', 'Eldor Shomurodov': 'DC', 'Abbosbek Fayzullaev': 'MCO',
  // Grupo L
  'Jude Bellingham': 'MCO', 'Harry Kane': 'DC', 'Bukayo Saka': 'ED', 'Declan Rice': 'MCD', 'Jordan Pickford': 'PT', 'Marcus Rashford': 'EI', 'John Stones': 'DFC',
  'Joško Gvardiol': 'DFC', 'Luka Modrić': 'MC', 'Mateo Kovačić': 'MC', 'Dominik Livaković': 'PT', 'Andrej Kramarić': 'DC',
  'Antoine Semenyo': 'ED', 'Iñaki Williams': 'DC', 'Thomas Partey': 'MCD', 'Kamaldeen Sulemana': 'EI', 'Jordan Ayew': 'DC',
  'Adalberto Carrasquilla': 'MC', 'Michael Amir Murillo': 'LD', 'José Fajardo': 'DC', 'Orlando Mosquera': 'PT',
}

// Patrón determinista para inferir la demarcación de los jugadores sin curar,
// respetando una distribución realista dentro de cada línea.
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
  '3-5-2': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'DFC', x: 68, y: 73 }, { pos: 'DFC', x: 50, y: 75 }, { pos: 'DFC', x: 32, y: 73 },
    { pos: 'MD', x: 87, y: 49 }, { pos: 'MCD', x: 38, y: 55 }, { pos: 'MC', x: 62, y: 51 }, { pos: 'MCO', x: 50, y: 34 }, { pos: 'MI', x: 13, y: 49 },
    { pos: 'DC', x: 61, y: 16 }, { pos: 'DC', x: 39, y: 16 },
  ],
  '5-3-2': [
    { pos: 'PT', x: 50, y: 91 },
    { pos: 'LD', x: 88, y: 65 }, { pos: 'DFC', x: 68, y: 74 }, { pos: 'DFC', x: 50, y: 76 }, { pos: 'DFC', x: 32, y: 74 }, { pos: 'LI', x: 12, y: 65 },
    { pos: 'MCD', x: 50, y: 54 }, { pos: 'MC', x: 70, y: 46 }, { pos: 'MCO', x: 30, y: 44 },
    { pos: 'DC', x: 61, y: 18 }, { pos: 'DC', x: 39, y: 18 },
  ],
}
