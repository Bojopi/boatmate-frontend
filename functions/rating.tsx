
export const avgRating = (list: any) => {
    let sum = 0
    list.map((item: any) => {
        sum += item.rating
    })
    const average = (sum / list.length).toFixed();
    return average;
}