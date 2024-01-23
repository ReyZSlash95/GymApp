// trainingCalculations.js

export const countExercises = exercises => exercises.length;

export const countSeriesAndReps = exercises => {
  let totalSeries = 0;
  let totalReps = 0;

  exercises.forEach(exercise => {
    totalSeries += exercise.series.length;
    exercise.series.forEach(serie => {
      if (serie.reps) {
        totalReps += parseInt(serie.reps);
        console.log(serie.reps);
      }
    });
  });

  return {totalSeries, totalReps};
};

export const calculateTotalAndMaxWeight = exercises => {
  let totalWeight = 0;
  let maxWeight = 0;

  exercises.forEach(exercise => {
    exercise.series.forEach(serie => {
      if (serie.weight && serie.reps) {
        totalWeight += parseInt(serie.weight) * serie.reps;
        if (serie.weight > maxWeight) {
          maxWeight = serie.weight;
        }
      }
    });
  });

  return {totalWeight, maxWeight};
};
