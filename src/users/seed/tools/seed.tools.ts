export const getRandomEnumValue = <T>(enumType: T): T[keyof T] => {
    const values = Object.values(enumType);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex] as T[keyof T];
};

export const getRandomBirthdate = (minAge: number, maxAge: number): Date => {

    const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;


    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;


    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 31) + 1;

    return new Date(birthYear, birthMonth, birthDay);
};

export const getRandomBoolean = (): boolean => {
    return Math.random() < 0.5;
};

export const getRandomPhoneNumber = (countryCode: string): string => {
    const phoneNumber = Math.floor(Math.random() * 10000000 + 10000000);
    return `+${countryCode}${phoneNumber}`;
};