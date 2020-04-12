// wrapper function for Math.trunc
const trunc = (number) => Math.trunc(number);

const normaliseDuration = (timeToElapse, periodType) => {
  let period = Number(timeToElapse);

  switch (periodType.toLowerCase) {
    case 'days':
      period /= 3;
      break;
    case 'weeks':
      period = (period / 3) * 7;
      break;
    case 'months':
      period = (period / 3) * 30;
      break;
    case 'years':
      period = (period / 3) * 366;
      break;
    default:
  }
  return trunc(period);
};

// estimator
const estimator = (data, mutiplier) => {
  // constant values
  const needICU = 0.05;// estimated % of severe +ve cases that will require ICU care
  const needToRecover = 0.15; // estimated % of severe +ve cases that need hospital to recover
  const bed = 0.35; // % bed available in hospitals for severe COVID-19 positive patients.
  const needVentilator = 0.02; // estimated % of severe positive cases that will require ventilators
  const earnByPeople = 0.65; // of the region (the majority) earn $1.5 a day
  const USDEarn = 1.5; // 65% the region (the majority) earn $1.5 a day
  // data needed
  const {
    periodType, timeToElapse, reportedCases, totalHospitalBeds
  } = data;
  const normalise = normaliseDuration(Number(timeToElapse), periodType);
  const currentlyInfected = trunc(Number(reportedCases) * Number(mutiplier));
  const infectionsByRequestedTime = trunc(currentlyInfected * normalise * 2);
  const severeCasesByRequestedTime = trunc(infectionsByRequestedTime * needToRecover);
  const hBBRT = trunc((Number(totalHospitalBeds) * bed) - severeCasesByRequestedTime);
  const casesForICUByRequestedTime = trunc(infectionsByRequestedTime * needICU);
  const casesForVentilatorsByRequestedTime = trunc(infectionsByRequestedTime * needVentilator);
  const dollarsInFlight = trunc((infectionsByRequestedTime * earnByPeople * USDEarn) * normalise);


  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: hBBRT,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};


const covid19ImpactEstimator = (data) => {
  const impact = estimator(data, 10);
  const severeImpact = estimator(data, 50);

  return { data, impact, severeImpact };
};

export default covid19ImpactEstimator;
