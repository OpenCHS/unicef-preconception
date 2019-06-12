import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper
} from 'rules-config/rules';
import RuleHelper from "../shared/RuleHelper";

const filter = RuleFactory('3462178e-94e5-43d9-bc17-6cddad05c265', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@filter('5a5fcbfe-f3b3-4e69-8f5d-2855c373bb95', 'MonthlyMonitoringHandler', 100.0)
class MonthlyMonitoringHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new MonthlyMonitoringHandler(), programEncounter, formElementGroup, today);
    }

    getObservationValueFromEntireEnrolment(programEncounter,conceptName) {
        return programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment(conceptName, programEncounter);
    }

    observationExistsInEntireEnrolment(conceptName) {
        return !_.isNil(programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment(conceptName, programEncounter));
    }  

    bmi(programEncounter, formElement) {
        let height = this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception Height");
        let weight = programEncounter.findObservation("Preconception Weight");
        return RuleHelper.createBMIFormElementStatusEnrolment(height, weight, formElement);
    } 

    @WithStatusBuilder
    counselHerToDelayPregnancyByUsingContraceptives([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Age")).is.lessThan(20);
        return statusBuilder.build();
    }

    @WithStatusBuilder
    couselHerToVisitPhcRhChForFurtherInvestigationsAndTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Age")).is.greaterThan(35);
        return statusBuilder.build();
    }

    @WithStatusBuilder
    dietAdviceToIncreaseOrIncreaseWeightRespectivelyAsPerDietChart([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"BMI")).is.lessThan(18.5)
        .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"BMI")).is.greaterThan(25.0);
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerToQuitTobaccoConsumption([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Tobacco consumption")).is.yes;
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerToQuitAlcoholConsumption([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Alcohol consumption")).is.yes;
        return statusBuilder.build();
    }
    
    @WithStatusBuilder
    counselHerToIncreaseWholeCerealsInDiet([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Calorie % RDA")).is.lessThan(70);
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerToIncreaseProteinsInDiet([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Protein % RDA")).is.lessThan(70);
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForAnaemiaTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception Hb")).is.lessThan(12);
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselWomanToTakeAntiDInjection([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Blood group")).containsAnyAnswerConceptName("AB-", "O-", "A-", "B-")
        .and.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Husband blood group"))
        .containsAnyAnswerConceptName("AB+", "O+", "A+", "B+");
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForHypertensionTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception hypertension")).is.yes;
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForDiabetesTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception blood sugar ogt"))
        .containsAnyAnswerConceptName("Positive");
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForSickleCellAnaemiaTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Sickle cell anaemia solubility test"))
        .containsAnyAnswerConceptName("Positive");
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForHivTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"HIV"))
        .containsAnyAnswerConceptName("Positive");
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForVdrlInfectionTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"VDRL test Result"))
        .containsAnyAnswerConceptName("Positive");
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForRtiStiTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"RTI Symptoms")).is.yes;
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForTshTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"TSH")).is.greaterThan(10);
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForOtherIllnessTreatment([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Any other illness")).is.yes;
        return statusBuilder.build();
    }

    @WithStatusBuilder
    uptDoneIfPeriodMissed([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Missed period").is.yes;
    }

    @WithStatusBuilder
    haemoglobin([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").
        containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    weight([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    bmi([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    anyRtiSymptoms([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");  
    }

    @WithStatusBuilder
    whetherRtiTreatmentTaken([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("RTI Symptoms").containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    anyOtherIllness([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");    }
    
    @WithStatusBuilder
    specify([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
    }
    
    @WithStatusBuilder
    anyOtherIllnessTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
    }

    @WithStatusBuilder
    dewormingTabletReceivedAlbendazole([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");
     }

     @WithStatusBuilder
     nextMonthlyVisitDate([], statusBuilder) {
         statusBuilder.show().when.not.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");
      }

    @WithStatusBuilder
    ifaIronAndFolicAcid([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception Hb").is.lessThan(12);
    }

    @WithStatusBuilder
    fa([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception Hb").is.greaterThan(12);
    }
    
    @WithStatusBuilder
    askHerToFollowDietAdvice([programEncounter], statusBuilder) {
        statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"BMI")).is.lessThan(18.5)
        .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"BMI")).is.greaterThan(25.0);
        return statusBuilder.build();
    }

    @WithStatusBuilder
    counselHerForRtiTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Whether pregnancy continued").is.yes;
    } 

    @WithStatusBuilder
    counsellingOfHighRiskFactors([programEncounter], statusBuilder) {
         statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Age")).is.lessThan(20)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Age")).is.greaterThan(35)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"BMI")).is.lessThan(18.5)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"BMI")).is.greaterThan(25.0)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Tobacco consumption")).is.yes
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Alcohol consumption")).is.yes
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Calorie % RDA")).is.lessThan(70)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Protein % RDA")).is.lessThan(70)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception Hb")).is.lessThan(12)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception hypertension")).is.yes
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception blood sugar ogt")).containsAnyAnswerConceptName("Positive")
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Sickle cell anaemia solubility test")).containsAnyAnswerConceptName("Positive")
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"HIV")).containsAnyAnswerConceptName("Positive")
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"VDRL test Result")).containsAnyAnswerConceptName("Positive")
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"RTI Symptoms")).is.yes
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"TSH")).is.greaterThan(10)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Any other illness")).is.yes;
            // .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Blood group")).containsAnyAnswerConceptName("AB-", "O-", "A-", "B-")
            // .and.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Husband blood group"))
            // .containsAnyAnswerConceptName("AB+", "O+", "A+", "B+");     
         return statusBuilder.build();
    }

    @WithStatusBuilder
    adviceFollowed([programEncounter], statusBuilder) {
         statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Age")).is.lessThan(20)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Age")).is.greaterThan(35)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"BMI")).is.lessThan(18.5)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"BMI")).is.greaterThan(25.0)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Tobacco consumption")).is.yes
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Alcohol consumption")).is.yes
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Calorie % RDA")).is.lessThan(70)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Protein % RDA")).is.lessThan(70);
        return statusBuilder.build();
    }

    @WithStatusBuilder
    treatmentOfHighRiskIllnesses([programEncounter], statusBuilder) {
         statusBuilder.show().whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception Hb")).is.lessThan(12)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception hypertension")).is.yes
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Preconception blood sugar ogt")).containsAnyAnswerConceptName("Positive")
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Sickle cell anaemia solubility test")).containsAnyAnswerConceptName("Positive")
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"HIV")).containsAnyAnswerConceptName("Positive")
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"VDRL test Result")).containsAnyAnswerConceptName("Positive")
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"RTI Symptoms")).is.yes
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"TSH")).is.greaterThan(10)
            .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Any other illness")).is.yes;
        // .or.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Blood group")).containsAnyAnswerConceptName("AB-", "O-", "A-", "B-")
        // .and.whenItem(this.getObservationValueFromEntireEnrolment(programEncounter,"Husband blood group"))
        // .containsAnyAnswerConceptName("AB+", "O+", "A+", "B+");
        return statusBuilder.build();
    }


}

export {
    MonthlyMonitoringHandler
}