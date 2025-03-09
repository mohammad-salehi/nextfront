const padZero = (num) => String(num).padStart(2, '0');

export const NewMiladiCalendar = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return {
    year: date.getFullYear(),
    month: padZero(date.getMonth() + 1),
    day: padZero(date.getDate()),
    hour: padZero(date.getHours()),
    minute: padZero(date.getMinutes())
  };
};

const mod = (a, b) => a - Math.floor(a / b) * b;

const persianEpoch = 1948320.5;

/**
 * @param {number} jy
 * @param {number} jm
 * @param {number} jd
 * @returns {number}
 */
function persianToJd(jy, jm, jd) {
  const epbase = jy - ((jy >= 0) ? 474 : 473);
  const epyear = 474 + mod(epbase, 2820);
  return jd +
         ((jm <= 7) ? ((jm - 1) * 31) : (((jm - 1) * 30) + 6)) +
         Math.floor((epyear * 682 - 110) / 2816) +
         (epyear - 1) * 365 +
         Math.floor(epbase / 2820) * 1029983 +
         (persianEpoch - 1);
}

/**
 * @param {number} jdn
 * @returns {object}
 */
function jdToJalali(jdn) {
  const depoch = jdn - persianToJd(475, 1, 1);
  const cycle = Math.floor(depoch / 1029983);
  const cyear = depoch % 1029983;
  let ycycle;
  if (cyear === 1029982) {
    ycycle = 2820;
  } else {
    const aux1 = Math.floor(cyear / 366);
    const aux2 = cyear % 366;
    ycycle = Math.floor((2134 * aux1 + 2816 * aux2 + 2815) / 1028522) + aux1 + 1;
  }
  let jy = ycycle + 2820 * cycle + 474;
  if (jy <= 0) {
    jy--;
  }
  const jdn1f = persianToJd(jy, 1, 1);
  const dayOfYear = jdn - jdn1f + 1;
  let jm, jd;
  if (dayOfYear <= 186) {
    jm = Math.ceil(dayOfYear / 31);
    jd = dayOfYear - (jm - 1) * 31;
  } else {
    jm = Math.ceil((dayOfYear - 186) / 30) + 6;
    jd = dayOfYear - 186 - (jm - 7) * 30;
  }
  return { jy, jm, jd };
}

/**
 * @param {number} timestamp 
 * @returns {object}
 */
export const NewJalaliCalendar = (timestamp) => {
  const daysSinceEpoch = Math.floor(timestamp / 86400);
  const jdn = daysSinceEpoch + 2440588;
  const { jy, jm, jd } = jdToJalali(jdn);
  const secondsInDay = timestamp % 86400;
  const hour = Math.floor(secondsInDay / 3600);
  const minute = Math.floor((secondsInDay % 3600) / 60);
  
  return {
    year: (jy),
    month: Number(padZero(jm)),
    day: Number(Number(padZero(jd)).toFixed(0) - 1),
    hour: Number(padZero(hour)),
    minute: Number(padZero(minute))
  };
}