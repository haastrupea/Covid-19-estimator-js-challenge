const normaliseDuration= (timeToElapse,periodType) =>{
    let period=Number(timeToElapse);
    
    switch (periodType.toLowerCase) {
        case "days":
            period=(period/3);
            break;

        case "weeks":
            period=(period/3) * 7;
            break;
        case "months":
            period=(period/3) * 30;
            break;
        case "years":
            period=(period/3) * 366;
            break;
    }
    return Math.trunc(period);
}


//estimator
const estimator= (data,mutiplier)=>{
    //constant values
    const PercentNeedICU=.05;//This is the estimated percentage of severe positive cases that will require ICU care
    const PercentNeedHospitalToRecover = .15 //estimated percentage of severe positive cases that will require hospitalization to recover
    const PercentbedAvailable= .35 // percentage bed availability in hospitals for severe COVID-19 positive patients.
    const PercentNeedVentilator= .02 // estimated percentage of severe positive cases that will require ventilators
    const PercentUSDEarnByPeopleInRegion=.65 //of the region (the majority) earn $1.5 a day
    const USDEarnPerDay= 1.5 //65% the region (the majority) earn $1.5 a day 
    //data needed
    const timeToElapse = Number(data.timeToElapse);
    const periodType = data.periodType;
    const normaliseInfectionDuration=normaliseDuration(timeToElapse,periodType);

    const currentlyInfected= Math.trunc(Number(data.reportedCases) * Number(mutiplier));
    const infectionsByRequestedTime = Math.trunc(currentlyInfected * normaliseInfectionDuration * 2);
    const severeCasesByRequestedTime = Math.trunc(infectionsByRequestedTime * PercentNeedHospitalToRecover);
    const hospitalBedsByRequestedTime = Math.trunc((Number(data.totalHospitalBeds)* PercentbedAvailable ) - severeCasesByRequestedTime);
    const casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * PercentNeedICU);
    const casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * PercentNeedVentilator);
    const dollarsInFlight = Math.trunc((infectionsByRequestedTime * PercentUSDEarnByPeopleInRegion * USDEarnPerDay) * normaliseInfectionDuration);
    
    
    
    return {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
    };
};


const covid19ImpactEstimator = (data) => {
 
    const impact= estimator(data,10);
    const severeImpact= estimator(data,50);

    return {data,impact,severeImpact};
};

export default covid19ImpactEstimator;
