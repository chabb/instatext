function isToday(ts): boolean {
    const year = new Date().getFullYear();
    const month = new Date().getMonth()+1;
    const days = new Date().getDate();
    const tsDate = new Date(ts);
    const tsYear = tsDate.getFullYear();
    const tsMonth = tsDate.getMonth()+1;
    const tsDays = tsDate.getDate();

    return (year === tsYear && month === tsMonth && days === tsDays);
}

export { isToday }


