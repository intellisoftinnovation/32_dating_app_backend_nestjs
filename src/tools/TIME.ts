export const formatTime = (timeInMs) => {
    const seconds = Math.floor(timeInMs / 1000);
    const milliseconds = Math.round(timeInMs % 1000);
    return `${seconds}s ${milliseconds}ms`;
};

export const getAge = (date: Date) => {
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }
    // console.log(age)
    return age;
}