

export const setClassesName = (...classes) => {
  return classes.filter(Boolean).join(' ')
}


export const isEmptyObject = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const isValidBirthDate = (date) => date?.match(/^\d{2}[./-]\d{2}[./-]\d{4}$/)?.length === 1;

export const maskPhoneRegexPattern = /[_() -]/gm;


export const sleep = m => new Promise(r => setTimeout(r, m))

export const getUserIp = () => {
  return new Promise((resolve, reject) => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((response) => resolve(response.ip)).catch((err) => reject(err));
  });
}
