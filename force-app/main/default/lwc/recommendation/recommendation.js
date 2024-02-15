import { LightningElement } from 'lwc';


export default class Recommendation extends LightningElement {
    addedRecommendationType;
    addedCreator;
    addedRecommender;
    addedGenre;
    addedPlatform;

    constructor() {
        super();
        this.template.addEventListener("recordselection", this.handleRecordSelection);
      }

    handleRecordSelection(event) {
        try {
            event.preventDefault();
            console.log('in the grandparent component');
            console.log('event', event);
            let details = event.detail;
            console.log('details', details)
            console.log('details.fieldName', details.fieldName);
            console.log('details.value', details.value);
            if (details.fieldName == 'Recommended_By__c') {
                console.log('recommender')
                this.addedRecommender = details.value;
            } else if (details.fieldName == 'Creator_Author__c') {
                console.log('creator')
                this.addedCreator = details.value;
            } else if (details.fieldName == 'Recommendation_Type__c') {
                this.addedRecommendationType = details.value;
            } else if (details.fieldName == 'Genre__c') {
                this.addedGenre = details.value;
            } else if (details.fieldName == 'Platform__c') {
                this.addedPlatform = details.value;
            }

        } catch (err) {
            console.log('error', err);
        }
    }
}