export default function getDaysBetween(startDate, endDate) {
    const dateList = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const date = new Date(currentDate);
        dateList.push(
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2,
                "0"
            )}-${String(date.getDate()).padStart(2, "0")}`
        ); // Ajoute une copie de la date actuelle au tableau

        currentDate.setDate(currentDate.getDate() + 1); // Incrémente la date d'un jour
    }

    return dateList;
}
