import { LightningElement, track, wire, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getSearchedRecords from '@salesforce/apex/RecordController.getSearchedRecords';
import createRecord from '@salesforce/apex/RecordController.createRecord';

export default class CreateLookupRecord extends LightningElement {
    
    @api recordId;
    @api objectApiName
    
    @track searchedRecordName;

    recordList = [];
    options;
    displayCreateButton;
    draftValues = {};
    searchParam;

    @wire(getSearchedRecords, {param: '$searchedRecordName', objectApiName: '$objectApiName'})
    foundRecords(result) {
        this.queriedRecordData = result
        if (result.data) {
            if(this.searchedRecordName) {
                this.recordList = result.data;
            } else {
                this.recordList = [];
            }
            let recordSize = Object.keys(this.recordSize).length;
            if(recordSize === 0 && this.searchedRecordName) {
                this.displayCreateButton = true;
                this.labelDisplay = `Create new record: '${this.searchedRecordName}'`;
            } else {
                this.displayCreateButton = false;
            }
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            console.log('error', error);
            this.recordList = undefined;
        }
    }

    updateDraftValues(dataId, fieldName, value) {
        if (this.draftValues[dataId] == null) {
            this.draftValues[dataId] = {};
        }
        if (this.draftValues[dataId][fieldName] == null) {
            this.draftValues[dataId][fieldName] = {};
        }
        this.draftValues[dataId][fieldName] = value;
        console.log("draft values", this.draftValues);
    }

    handleCreateRecord() {
        createRecord({recordName: this.searchedRecordName, objectApiName: this.objectApiName})
            .then(result => {
                refreshApex(this.queriedRecordData);

            })
            .catch(error => {
                console.log('error', error);
            })
    }

    handleSearchTermChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchedRecordName = searchTerm;
		}, 300);
	}

    handleAddRecord(event) {
        // const ingredientId = event.target.value;
        // const recipeId = this.recordId;
        // const recipeIngredient = {
        //     Recipe__c: recipeId,
        //     Ingredient__c: ingredientId,
        //     Quantity__c: this.draftValues[ingredientId]['Quantity__c'],
        //     Measurement__c: this.draftValues[ingredientId]['Measurement__c']
        // }
        // createRecipeIngredient({recipeIngredient: recipeIngredient})
        //     .then(() => {
        //         this.showCustomToast('Added ingredient to recipe', null, 'success', 'dismissable');
        //         this.template.querySelector('c-display-recipe-ingredients').handleIngredientAddition();
        //     })
        //     .catch(error => {
        //         console.log('error creating recipe Ingredient.', error);
        //     })
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

    @api updateRecipeId(newId) {
        this.recordId = newId;
    }

    handleClearResults() {
        this.searchedRecordName = '';
        this.recordList = [];
    }
}