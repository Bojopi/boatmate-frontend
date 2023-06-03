
export const avgRating = (list: any) => {
    let sum = 0
    list.map((item: any) => {
        sum += item.rating
    })
    const average = (sum / list.length).toFixed();
    return average;
}

const calculateRatingPercentage = (ratings: any, evaluation: any) => {
    const totalRatings = ratings.length;
    const filteredRatings = ratings.filter((rating: any) => rating.rating === evaluation);
    const percentage = (filteredRatings.length / totalRatings) * 100;
    return percentage.toFixed(2);
};

export const calculateAllRatingPercentages = (ratings: any) => {
    const ratingPercentages: any = {};
    const evaluations = [5, 4, 3, 2, 1];

    evaluations.forEach((evaluation) => {
        const percentage = calculateRatingPercentage(ratings, evaluation);
        ratingPercentages[evaluation] = percentage;
    });

    return ratingPercentages;
};