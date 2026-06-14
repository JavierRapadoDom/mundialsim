// Leyendas reales de cada selección, con su media en su PRIME (su mejor momento).
// La media depende del nivel real del jugador en su apogeo: un Iniesta ~95, una
// leyenda de una selección modesta como Vurnon Anita ~83.
// Formato: L(nombre, demarcación, media_prime, club_del_prime, época)

import { SPEC_LINE } from './positions.js'

const L = (n, npos, r, club, era) => ({ n, npos, r, club, era })

export const LEGENDS = {
  // ───────── Grandes potencias ─────────
  bra: [
    L('Pelé', 'DC', 97, 'Santos', '1958-70'),
    L('Ronaldo Nazário', 'DC', 96, 'Inter de Milán', '1997-2002'),
    L('Ronaldinho', 'MCO', 95, 'FC Barcelona', '2004-06'),
    L('Roberto Carlos', 'LI', 91, 'Real Madrid', '1998-2003'),
    L('Cafu', 'LD', 90, 'AC Milan', '2002-04'),
  ],
  arg: [
    L('Diego Maradona', 'MCO', 97, 'Napoli', '1986-90'),
    L('Gabriel Batistuta', 'DC', 92, 'Fiorentina', '1994-99'),
    L('Juan Román Riquelme', 'MCO', 90, 'Boca Juniors', '2006-08'),
    L('Sergio Agüero', 'DC', 90, 'Manchester City', '2014-18'),
    L('Daniel Passarella', 'DFC', 88, 'River Plate', '1978-82'),
  ],
  fra: [
    L('Zinedine Zidane', 'MCO', 96, 'Real Madrid', '2000-04'),
    L('Michel Platini', 'MCO', 94, 'Juventus', '1983-86'),
    L('Thierry Henry', 'DC', 93, 'Arsenal', '2003-06'),
    L('Patrick Vieira', 'MC', 89, 'Arsenal', '2001-04'),
    L('Marcel Desailly', 'DFC', 88, 'AC Milan', '1996-99'),
  ],
  ger: [
    L('Franz Beckenbauer', 'DFC', 96, 'Bayern de Múnich', '1972-76'),
    L('Gerd Müller', 'DC', 95, 'Bayern de Múnich', '1970-74'),
    L('Lothar Matthäus', 'MC', 93, 'Inter de Milán', '1989-92'),
    L('Oliver Kahn', 'PT', 91, 'Bayern de Múnich', '2001-04'),
    L('Miroslav Klose', 'DC', 88, 'Bayern de Múnich', '2006-10'),
  ],
  esp: [
    L('Andrés Iniesta', 'MC', 95, 'FC Barcelona', '2009-12'),
    L('Xavi Hernández', 'MC', 94, 'FC Barcelona', '2009-12'),
    L('Iker Casillas', 'PT', 92, 'Real Madrid', '2008-12'),
    L('Carles Puyol', 'DFC', 90, 'FC Barcelona', '2008-11'),
    L('David Villa', 'DC', 91, 'FC Barcelona', '2009-11'),
  ],
  ned: [
    L('Johan Cruyff', 'MCO', 97, 'Ajax', '1971-74'),
    L('Marco van Basten', 'DC', 95, 'AC Milan', '1988-92'),
    L('Ruud Gullit', 'MC', 93, 'AC Milan', '1988-90'),
    L('Dennis Bergkamp', 'MCO', 92, 'Arsenal', '1997-2000'),
    L('Frank Rijkaard', 'MC', 90, 'AC Milan', '1988-92'),
  ],
  eng: [
    L('Bobby Charlton', 'MC', 93, 'Manchester United', '1966-70'),
    L('Bobby Moore', 'DFC', 92, 'West Ham United', '1966-70'),
    L('Gordon Banks', 'PT', 89, 'Stoke City', '1966-72'),
    L('Steven Gerrard', 'MC', 90, 'Liverpool', '2005-09'),
    L('Gary Lineker', 'DC', 89, 'FC Barcelona', '1986-89'),
  ],
  por: [
    L('Eusébio', 'DC', 95, 'Benfica', '1965-68'),
    L('Luís Figo', 'ED', 92, 'Real Madrid', '2000-03'),
    L('Rui Costa', 'MCO', 88, 'AC Milan', '2001-04'),
    L('Deco', 'MC', 88, 'FC Barcelona', '2005-06'),
    L('Pauleta', 'DC', 85, 'PSG', '2003-06'),
  ],

  // ───────── Selecciones fuertes ─────────
  ita: [], // (Italia no está en este Mundial)
  uru: [
    L('Enzo Francescoli', 'MCO', 89, 'River Plate', '1994-96'),
    L('Diego Forlán', 'DC', 88, 'Atlético de Madrid', '2008-11'),
    L('Diego Godín', 'DFC', 88, 'Atlético de Madrid', '2013-16'),
    L('Edinson Cavani', 'DC', 88, 'PSG', '2016-18'),
    L('Obdulio Varela', 'DFC', 84, 'Peñarol', '1950'),
  ],
  cro: [
    L('Davor Šuker', 'DC', 89, 'Real Madrid', '1996-98'),
    L('Zvonimir Boban', 'MC', 88, 'AC Milan', '1994-98'),
    L('Robert Prosinečki', 'MCO', 87, 'Real Madrid', '1992-94'),
    L('Slaven Bilić', 'DFC', 82, 'West Ham United', '1996-98'),
    L('Robert Jarni', 'LI', 81, 'Real Betis', '1996-98'),
  ],
  bel: [
    L('Eden Hazard', 'EI', 92, 'Chelsea', '2016-19'),
    L('Vincent Kompany', 'DFC', 88, 'Manchester City', '2011-14'),
    L('Enzo Scifo', 'MCO', 86, 'Auxerre', '1990-93'),
    L('Jean-Marie Pfaff', 'PT', 86, 'Bayern de Múnich', '1984-87'),
    L('Jan Ceulemans', 'DC', 85, 'Club Brujas', '1984-86'),
  ],
  col: [
    L('Carlos Valderrama', 'MCO', 89, 'Atlético Junior', '1990-94'),
    L('Faustino Asprilla', 'DC', 86, 'Parma', '1994-96'),
    L('Freddy Rincón', 'MC', 84, 'Palmeiras', '1994-96'),
    L('René Higuita', 'PT', 83, 'Atlético Nacional', '1989-91'),
    L('Mario Yepes', 'DFC', 82, 'PSG', '2004-08'),
  ],
  mex: [
    L('Hugo Sánchez', 'DC', 93, 'Real Madrid', '1985-90'),
    L('Rafael Márquez', 'DFC', 88, 'FC Barcelona', '2005-08'),
    L('Cuauhtémoc Blanco', 'MCO', 86, 'América', '1998-2000'),
    L('Jorge Campos', 'PT', 84, 'Pumas UNAM', '1993-96'),
    L('Claudio Suárez', 'DFC', 84, 'Pumas UNAM', '1994-98'),
  ],
  civ: [
    L('Didier Drogba', 'DC', 91, 'Chelsea', '2007-10'),
    L('Yaya Touré', 'MC', 90, 'Manchester City', '2013-15'),
    L('Kolo Touré', 'DFC', 84, 'Arsenal', '2004-06'),
    L('Gervinho', 'ED', 82, 'AS Roma', '2014-16'),
    L('Didier Zokora', 'MCD', 81, 'Tottenham', '2007-09'),
  ],
  swe: [
    L('Zlatan Ibrahimović', 'DC', 93, 'PSG', '2013-16'),
    L('Henrik Larsson', 'DC', 89, 'Celtic', '1999-2004'),
    L('Freddie Ljungberg', 'ED', 85, 'Arsenal', '2002-04'),
    L('Thomas Brolin', 'MCO', 84, 'Parma', '1992-94'),
    L('Gunnar Nordahl', 'DC', 86, 'AC Milan', '1950-54'),
  ],
  nor: [
    L('Ole Gunnar Solskjær', 'DC', 84, 'Manchester United', '1998-2002'),
    L('John Carew', 'DC', 81, 'Aston Villa', '2007-09'),
    L('John Arne Riise', 'LI', 82, 'Liverpool', '2005-08'),
    L('Tore André Flo', 'DC', 80, 'Chelsea', '1998-2000'),
    L('Henning Berg', 'DFC', 80, 'Blackburn Rovers', '1995-97'),
  ],
  sen: [
    L('El Hadji Diouf', 'DC', 84, 'Liverpool', '2002-04'),
    L('Khalilou Fadiga', 'MCO', 82, 'Auxerre', '2001-03'),
    L('Papa Bouba Diop', 'MC', 81, 'Fulham', '2004-06'),
    L('Henri Camara', 'DC', 80, 'Wigan', '2005-07'),
    L('Tony Sylva', 'PT', 78, 'LOSC Lille', '2002-06'),
  ],

  // ───────── Selecciones medias ─────────
  cze: [
    L('Pavel Nedvěd', 'MC', 93, 'Juventus', '2003-05'),
    L('Petr Čech', 'PT', 91, 'Chelsea', '2005-09'),
    L('Tomáš Rosický', 'MCO', 87, 'Borussia Dortmund', '2004-06'),
    L('Karel Poborský', 'ED', 84, 'Benfica', '1996-98'),
    L('Milan Baroš', 'DC', 83, 'Liverpool', '2004-05'),
  ],
  kor: [
    L('Park Ji-sung', 'MC', 87, 'Manchester United', '2007-10'),
    L('Cha Bum-kun', 'DC', 88, 'Bayer Leverkusen', '1983-86'),
    L('Hong Myung-bo', 'DFC', 85, 'Pohang Steelers', '1998-2002'),
    L('Ki Sung-yueng', 'MC', 83, 'Swansea City', '2014-17'),
    L('Lee Young-pyo', 'LI', 82, 'Tottenham', '2006-08'),
  ],
  jpn: [
    L('Hidetoshi Nakata', 'MCO', 86, 'AS Roma', '2000-02'),
    L('Shunsuke Nakamura', 'MCO', 84, 'Celtic', '2005-08'),
    L('Shinji Kagawa', 'MCO', 84, 'Borussia Dortmund', '2011-12'),
    L('Keisuke Honda', 'MCO', 84, 'CSKA Moscú', '2011-13'),
    L('Yasuhito Endō', 'MC', 82, 'Gamba Osaka', '2008-11'),
  ],
  tur: [
    L('Hakan Şükür', 'DC', 87, 'Galatasaray', '1999-2002'),
    L('Rüştü Reçber', 'PT', 85, 'Fenerbahçe', '2002-04'),
    L('Arda Turan', 'MCO', 85, 'Atlético de Madrid', '2013-15'),
    L('Emre Belözoğlu', 'MC', 84, 'Inter de Milán', '2002-04'),
    L('Tugay Kerimoğlu', 'MC', 82, 'Blackburn Rovers', '2002-05'),
  ],
  aus: [
    L('Harry Kewell', 'EI', 86, 'Liverpool', '2003-06'),
    L('Mark Viduka', 'DC', 85, 'Leeds United', '2000-03'),
    L('Tim Cahill', 'MCO', 85, 'Everton', '2006-10'),
    L('Mark Schwarzer', 'PT', 83, 'Middlesbrough', '2005-08'),
    L('Lucas Neill', 'DFC', 80, 'Blackburn Rovers', '2005-07'),
  ],
  par: [
    L('José Luis Chilavert', 'PT', 88, 'Vélez Sarsfield', '1996-99'),
    L('Julio César Romero', 'MCO', 86, 'New York Cosmos', '1985-87'),
    L('Carlos Gamarra', 'DFC', 85, 'Internazionale', '1998-2000'),
    L('Roque Santa Cruz', 'DC', 84, 'Bayern de Múnich', '2003-05'),
    L('Salvador Cabañas', 'DC', 83, 'América', '2007-09'),
  ],
  egy: [
    L('Mohamed Aboutrika', 'MCO', 85, 'Al-Ahly', '2006-09'),
    L('Mahmoud El Khatib', 'DC', 83, 'Al-Ahly', '1980-84'),
    L('Hossam Hassan', 'DC', 83, 'Al-Ahly', '1992-96'),
    L('Ahmed Hassan', 'MC', 83, 'Anderlecht', '2004-06'),
    L('Essam El-Hadary', 'PT', 82, 'Al-Ahly', '2005-08'),
  ],
  mar: [
    L('Mustapha Hadji', 'MCO', 84, 'Coventry City', '1998-2000'),
    L('Noureddine Naybet', 'DFC', 84, 'Deportivo La Coruña', '2000-03'),
    L('Badou Zaki', 'PT', 81, 'Mallorca', '1986-89'),
    L('Salaheddine Bassir', 'DC', 80, 'Deportivo La Coruña', '1998-2000'),
    L('Abdeljalil Hadda', 'DC', 79, 'Sporting CP', '1998-2000'),
  ],
  sco: [
    L('Kenny Dalglish', 'DC', 91, 'Liverpool', '1979-83'),
    L('Denis Law', 'DC', 90, 'Manchester United', '1964-68'),
    L('Graeme Souness', 'MC', 89, 'Liverpool', '1981-84'),
    L('Jim Baxter', 'MC', 85, 'Rangers', '1963-65'),
    L('Billy Bremner', 'MC', 84, 'Leeds United', '1968-72'),
  ],
  irn: [
    L('Ali Daei', 'DC', 84, 'Hertha Berlín', '1998-2000'),
    L('Ali Karimi', 'MCO', 85, 'Bayern de Múnich', '2005-07'),
    L('Mehdi Mahdavikia', 'ED', 83, 'Hamburgo', '2002-05'),
    L('Javad Nekounam', 'MC', 82, 'Osasuna', '2007-10'),
    L('Khodadad Azizi', 'DC', 80, 'Colonia', '1997-99'),
  ],
  usa: [
    L('Landon Donovan', 'MCO', 86, 'LA Galaxy', '2009-12'),
    L('Clint Dempsey', 'DC', 85, 'Fulham', '2010-12'),
    L('Tim Howard', 'PT', 84, 'Everton', '2010-14'),
    L('Claudio Reyna', 'MC', 83, 'Rangers', '1999-2001'),
    L('Brian McBride', 'DC', 80, 'Fulham', '2004-07'),
  ],
  alg: [
    L('Rabah Madjer', 'DC', 84, 'FC Porto', '1987-90'),
    L('Lakhdar Belloumi', 'MCO', 84, 'GCR Mascara', '1982-86'),
    L('Islam Slimani', 'DC', 81, 'Sporting CP', '2015-16'),
    L('Sofiane Feghouli', 'MCO', 81, 'Valencia', '2013-16'),
    L('Antar Yahia', 'DFC', 78, 'VfL Bochum', '2008-10'),
  ],
  rsa: [
    L('Lucas Radebe', 'DFC', 85, 'Leeds United', '1998-2001'),
    L('Benni McCarthy', 'DC', 85, 'FC Porto', '2003-06'),
    L('Steven Pienaar', 'MC', 84, 'Everton', '2009-12'),
    L('Mark Fish', 'DFC', 80, 'Bolton Wanderers', '1998-2000'),
    L('Shaun Bartlett', 'DC', 79, 'Charlton Athletic', '2001-03'),
  ],
  sui: [
    L('Stéphane Chapuisat', 'DC', 86, 'Borussia Dortmund', '1995-98'),
    L('Xherdan Shaqiri', 'ED', 85, 'Liverpool', '2018-20'),
    L('Alexander Frei', 'DC', 84, 'Stade Rennais', '2006-08'),
    L('Stephan Lichtsteiner', 'LD', 83, 'Juventus', '2013-16'),
    L('Hakan Yakin', 'MCO', 82, 'Young Boys', '2007-09'),
  ],
  ecu: [
    L('Antonio Valencia', 'ED', 84, 'Manchester United', '2011-14'),
    L('Álex Aguinaga', 'MCO', 82, 'Necaxa', '1995-98'),
    L('Agustín Delgado', 'DC', 80, 'Southampton', '2002-03'),
    L('Iván Hurtado', 'DFC', 79, 'Al-Arabi', '2002-05'),
    L('Ulises de la Cruz', 'LD', 78, 'Aston Villa', '2003-06'),
  ],
  aut: [
    L('Hans Krankl', 'DC', 85, 'FC Barcelona', '1978-80'),
    L('Herbert Prohaska', 'MC', 84, 'Inter de Milán', '1980-83'),
    L('Toni Polster', 'DC', 82, 'Sevilla', '1988-91'),
    L('Andreas Herzog', 'MCO', 82, 'Werder Bremen', '1992-95'),
    L('Ernst Ocwirk', 'MC', 81, 'Sampdoria', '1956-58'),
  ],
  gha: [
    L('Abedi Pele', 'MCO', 88, 'Olympique de Marsella', '1991-93'),
    L('Michael Essien', 'MC', 88, 'Chelsea', '2006-09'),
    L('Tony Yeboah', 'DC', 84, 'Eintracht Frankfurt', '1993-95'),
    L('Asamoah Gyan', 'DC', 84, 'Sunderland', '2010-11'),
    L('Sammy Kuffour', 'DFC', 81, 'Bayern de Múnich', '1999-2002'),
  ],
  tun: [
    L('Tarak Dhiab', 'MCO', 82, 'Espérance de Túnez', '1977-80'),
    L('Wahbi Khazri', 'MCO', 82, 'Saint-Étienne', '2018-20'),
    L('Youssef Msakni', 'ED', 81, 'Al-Duhail', '2016-19'),
    L('Adel Sellimi', 'DC', 78, 'Nantes', '1997-99'),
    L('Radhi Jaïdi', 'DFC', 78, 'Bolton Wanderers', '2004-06'),
  ],
  uzb: [
    L('Maksim Shatskikh', 'DC', 80, 'Dinamo de Kiev', '2002-05'),
    L('Server Djeparov', 'MCO', 80, 'Bunyodkor', '2008-10'),
    L('Odil Ahmedov', 'MC', 80, 'Krasnodar', '2014-16'),
    L('Timur Kapadze', 'MC', 78, 'Pakhtakor', '2007-10'),
    L('Ignatiy Nesterov', 'PT', 76, 'Bunyodkor', '2009-11'),
  ],
  ksa: [
    L('Majed Abdullah', 'DC', 84, 'Al-Nassr', '1984-88'),
    L('Sami Al-Jaber', 'DC', 82, 'Al-Hilal', '1996-2000'),
    L('Saeed Al-Owairan', 'MCO', 82, 'Al-Shabab', '1994-96'),
    L('Mohamed Al-Deayea', 'PT', 82, 'Al-Hilal', '1996-2000'),
    L('Yasser Al-Qahtani', 'DC', 80, 'Al-Hilal', '2007-09'),
  ],

  // ───────── Selecciones modestas ─────────
  can: [
    L('Atiba Hutchinson', 'MC', 82, 'Beşiktaş', '2015-18'),
    L('Dwayne De Rosario', 'MCO', 80, 'Houston Dynamo', '2007-09'),
    L('Tomasz Radzinski', 'DC', 80, 'Everton', '2002-04'),
    L('Julian de Guzman', 'MC', 79, 'Deportivo La Coruña', '2005-07'),
    L('Paul Stalteri', 'LD', 78, 'Tottenham', '2005-07'),
  ],
  bih: [
    L('Miralem Pjanić', 'MC', 87, 'Juventus', '2017-19'),
    L('Hasan Salihamidžić', 'MC', 84, 'Bayern de Múnich', '2001-04'),
    L('Sergej Barbarez', 'DC', 83, 'Hamburgo', '2000-03'),
    L('Asmir Begović', 'PT', 82, 'Stoke City', '2013-15'),
    L('Vedad Ibišević', 'DC', 81, 'VfB Stuttgart', '2011-13'),
  ],
  qat: [
    L('Khalfan Ibrahim', 'MCO', 80, 'Al-Sadd', '2006-09'),
    L('Sebastián Soria', 'DC', 77, 'Al-Rayyan', '2008-11'),
    L('Mansour Muftah', 'MC', 76, 'Al-Sadd', '1980-84'),
    L('Bilal Mohammed', 'DFC', 75, 'Al-Gharafa', '2010-13'),
    L('Adel Lami', 'DC', 74, 'Al-Arabi', '1992-96'),
  ],
  hai: [
    L('Emmanuel Sanon', 'DC', 80, 'Beerschot', '1974-76'),
    L('Joe Gaetjens', 'DC', 78, 'Racing Club de Paris', '1950'),
    L('Pierre Bayonne', 'MC', 75, 'Don Bosco', '1974'),
    L('Wilner Nazaire', 'DFC', 74, 'Violette', '1974'),
    L('Henry Françillon', 'PT', 74, 'Violette', '1974'),
  ],
  cuw: [
    L('Vurnon Anita', 'MCD', 83, 'Newcastle United', '2013-16'),
    L('Ergilio Hato', 'PT', 80, 'CRKSV Jong Holland', '1957-62'),
    L('Cuco Martina', 'LD', 78, 'Everton', '2017-18'),
    L('Gino van Kessel', 'DC', 77, 'Slovan Bratislava', '2016-18'),
    L('Rangelo Janga', 'DC', 76, 'CSKA Sofia', '2018-20'),
  ],
  cpv: [
    L('Fernando Varela', 'DFC', 78, 'Spartak Moscú', '2013-15'),
    L('Babanco', 'DC', 77, 'CD Travadores', '2000-03'),
    L('Marco Soares', 'MC', 77, 'Pacos de Ferreira', '2014-16'),
    L('Héldon', 'ED', 77, 'Marítimo', '2014-16'),
    L('Nuno Rocha', 'DC', 76, 'FC Sheriff', '2015-17'),
  ],
  irq: [
    L('Younis Mahmoud', 'DC', 82, 'Al-Gharafa', '2007-10'),
    L('Ahmed Radhi', 'DC', 80, 'Al-Rasheed', '1986-88'),
    L('Nashat Akram', 'MCO', 79, 'Al-Gharafa', '2007-09'),
    L('Emad Mohammed', 'DC', 77, 'Al-Sadd', '2006-08'),
    L('Noor Sabri', 'PT', 76, 'Al-Quwa Al-Jawiya', '2007-10'),
  ],
  jor: [
    L('Hassan Abdel-Fattah', 'DC', 77, 'Al-Wehdat', '2009-11'),
    L('Amer Deeb', 'MCO', 76, 'Al-Wehdat', '2008-10'),
    L('Odai Al-Saify', 'EI', 76, 'Al-Faisaly', '2011-13'),
    L('Bashar Bani Yaseen', 'DFC', 74, 'Al-Faisaly', '2012-14'),
    L('Amer Shafi', 'PT', 75, 'Al-Wehdat', '2010-14'),
  ],
  cod: [
    L('Dieumerci Mbokani', 'DC', 80, 'Anderlecht', '2012-14'),
    L('Shabani Nonda', 'DC', 80, 'AS Mónaco', '2002-04'),
    L('Lomana LuaLua', 'DC', 78, 'Newcastle United', '2003-05'),
    L('Trésor Mputu', 'MCO', 78, 'TP Mazembe', '2009-11'),
    L('Robert Kidiaba', 'PT', 76, 'TP Mazembe', '2009-12'),
  ],
  nzl: [
    L('Wynton Rufer', 'DC', 82, 'Werder Bremen', '1990-93'),
    L('Ryan Nelsen', 'DFC', 80, 'Blackburn Rovers', '2006-09'),
    L('Ivan Vicelich', 'MC', 76, 'Roda JC', '2003-06'),
    L('Vaughan Coveny', 'DC', 76, 'South Melbourne', '2000-03'),
    L('Mark Paston', 'PT', 75, 'Wellington Phoenix', '2010-11'),
  ],
  pan: [
    L('Román Torres', 'DFC', 78, 'Seattle Sounders', '2015-18'),
    L('Luis Tejada', 'DC', 78, 'Juan Aurich', '2011-13'),
    L('Jaime Penedo', 'PT', 78, 'Dinamo Bucarest', '2014-16'),
    L('Felipe Baloy', 'DFC', 77, 'Multimax', '2005-07'),
    L('Blas Pérez', 'DC', 78, 'FC Dallas', '2012-14'),
  ],
}

const NUM_BY_LINE = { POR: 1, DEF: 4, MED: 8, DEL: 9 }

// Convierte el dato de una leyenda en un jugador listo para la plantilla
export function materializeLegend(teamId, d) {
  const pos = SPEC_LINE[d.npos] ?? 'MED'
  return {
    id: `legend-${teamId}`,
    team: teamId,
    n: d.n,
    pos,
    npos: d.npos,
    posSet: [d.npos],
    club: d.club,
    era: d.era,
    r: d.r,
    age: 27,
    caps: 0,
    num: NUM_BY_LINE[pos] ?? 7,
    star: true,
    captain: false,
    legend: true,
  }
}

export const legendsOf = teamId => LEGENDS[teamId] ?? []
