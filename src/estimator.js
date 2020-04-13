// wrapper function for Math.trunc
const trunc = (number) => Math.trunc(number);
const powerOfTwo = (number) => trunc(2 ** number);
const normaliseDuration = (timeToElapse, periodType) => {
  const timeToElapsed = Number(timeToElapse);
  let period;

  switch (periodType.toLowerCase()) {
    case 'days':
      period = timeToElapsed;
      break;
    case 'weeks':
      period = timeToElapsed * 7;
      break;
    case 'months':
      period = timeToElapsed * 30;
      break;
    case 'years':
      period = timeToElapsed * 366;
      break;
    default:
  }

  return trunc(period);
};


const estimator = (data, mutiplier) => {
  // constant values
  const needICU = 0.05;// estimated % of severe +ve cases that will require ICU care
  const needToRecover = 0.15; // estimated % of severe +ve cases that need hospital to recover
  const bed = 0.35; // % bed available in hospitals for severe COVID-19 positive patients.
  const needVentilator = 0.02; // estimated % of severe positive cases that will require ventilators

  
  const {
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds,
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
  } = data;// extract variable needed from input object data

  const earnByPeople = Number(avgDailyIncomePopulation);
  const USDEarn = Number(avgDailyIncomeInUSD);

  // normalise days,weeks, months and even years into days
  const days = normaliseDuration(timeToElapse, periodType);
  const factor = trunc(days / 3);
  const currentlyInfected = trunc(Number(reportedCases) * Number(mutiplier));
  const infectionsByRequestedTime = trunc((currentlyInfected * powerOfTwo(factor)));

  const severeCasesByRequestedTime = trunc(infectionsByRequestedTime * needToRecover);
  const hBBRT = trunc((Number(totalHospitalBeds) * bed) - severeCasesByRequestedTime);

  const casesForICUByRequestedTime = trunc(infectionsByRequestedTime * needICU);
  const cFVBRT = trunc(infectionsByRequestedTime * needVentilator);
  const dollarsInFlight = trunc((infectionsByRequestedTime * earnByPeople * USDEarn) / days);

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: hBBRT,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime: cFVBRT,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => {
  const impact = estimator(data, 10);
  const severeImpact = estimator(data, 50);

  return { data, impact, severeImpact };
};

export default covid19ImpactEstimator;
