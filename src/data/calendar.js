// Calendario oficial del Mundial 2026 (rangos de la FIFA):
//   Fase de grupos  11–27 jun · Dieciseisavos 28 jun–3 jul · Octavos 4–7 jul
//   Cuartos 9–11 jul · Semifinales 14–15 jul · Final 19 jul
// Cada partido lleva su fecha real para que el calendario y los días de
// descanso (que afectan a la recuperación física) sean realistas.

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

const asDate = iso => new Date(iso + 'T12:00:00Z')

export function fmtDate(iso) {
  if (!iso) return ''
  const d = asDate(iso)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}

export function fmtDateLong(iso) {
  if (!iso) return ''
  const d = asDate(iso)
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}

export const daysBetween = (isoA, isoB) =>
  Math.round((asDate(isoB) - asDate(isoA)) / 86400000)

// Fechas por grupo y jornada (cada selección juega cada ~6 días en la fase de grupos)
export const GROUP_DATES = {
  A: ['2026-06-11', '2026-06-18', '2026-06-24'],
  B: ['2026-06-11', '2026-06-18', '2026-06-24'],
  C: ['2026-06-12', '2026-06-19', '2026-06-25'],
  D: ['2026-06-12', '2026-06-19', '2026-06-25'],
  E: ['2026-06-13', '2026-06-20', '2026-06-26'],
  F: ['2026-06-13', '2026-06-20', '2026-06-26'],
  G: ['2026-06-14', '2026-06-21', '2026-06-26'],
  H: ['2026-06-14', '2026-06-21', '2026-06-26'],
  I: ['2026-06-15', '2026-06-22', '2026-06-27'],
  J: ['2026-06-15', '2026-06-22', '2026-06-27'],
  K: ['2026-06-16', '2026-06-23', '2026-06-27'],
  L: ['2026-06-16', '2026-06-23', '2026-06-27'],
}

// Fechas de las eliminatorias, repartidas por índice de partido en la ronda
export const KO_DATES = {
  R32: ['2026-06-28', '2026-06-28', '2026-06-29', '2026-06-29', '2026-06-30', '2026-06-30',
    '2026-07-01', '2026-07-01', '2026-07-02', '2026-07-02', '2026-07-02', '2026-07-03',
    '2026-07-03', '2026-07-03', '2026-06-29', '2026-07-01'],
  R16: ['2026-07-04', '2026-07-04', '2026-07-05', '2026-07-05', '2026-07-06', '2026-07-06', '2026-07-07', '2026-07-07'],
  QF: ['2026-07-09', '2026-07-10', '2026-07-11', '2026-07-11'],
  SF: ['2026-07-14', '2026-07-15'],
  F: ['2026-07-19'],
}

export const groupDate = (group, round) => GROUP_DATES[group]?.[round - 1] ?? null
export const koDate = (stage, i) => KO_DATES[stage]?.[i] ?? KO_DATES[stage]?.[0] ?? null

// Días de descanso típicos hasta la siguiente ronda (según el calendario real)
export const REST_DAYS = {
  groups1: 7, groups2: 6, groupsToR32: 3, R32: 4, R16: 3, QF: 3, SF: 4,
}

export function restDaysFor(stage, round) {
  if (stage === 'groups') return round === 1 ? REST_DAYS.groups1 : round === 2 ? REST_DAYS.groups2 : REST_DAYS.groupsToR32
  return REST_DAYS[stage] ?? 4
}
