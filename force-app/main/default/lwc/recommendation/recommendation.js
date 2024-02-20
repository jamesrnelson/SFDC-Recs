import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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
            let details = event.detail;
            if (details.fieldName == 'Recommended_By__c') {
                this.addedRecommender = details.value;
            } else if (details.fieldName == 'Creator_Author__c') {
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

    handleSuccess() {
        this.showCustomToast('Recommendation Added','', 'success', 'dismissable');
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    showCustomToast(title, message, variant, mode) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                mode: mode
            })
        );
    }
}