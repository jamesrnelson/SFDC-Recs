import { LightningElement, track, wire, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getSearchedRecords from '@salesforce/apex/RecordController.getSearchedRecords';
import createRecord from '@salesforce/apex/RecordController.createRecord';

export default class IngredientSearchAndAddComponent extends LightningElement {
    @api parentId;
    @api insertedObject;
    @api placeholder;
    @api targetField;
    
    @track searchedRecord;

    recordList = [];
    options;
    displayCreateButton;
    draftValues = {};
    searchParam;


    connectedCallback() {
        // dynamic object
    }

    @wire(getSearchedRecords, {param: '$searchedRecord', objectApiName: '$insertedObject'})
    foundIngredients(result) {
        this.queriedRecordData = result
        if (result.data) {
            if(this.searchedRecord) {
                this.recordList = result.data;
            } else {
                this.recordList = [];
            }
            let recordSize = Object.keys(this.recordList).length;
            if(recordSize === 0 && this.searchedRecord) {
                this.displayCreateButton = true;
                this.labelDisplay = `Create new ${this.insertedObject}: '${this.searchedRecord}'`;
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

    handleQuantityChange(event) {
        const dataId = event.target.name;
        const fieldName = 'Quantity__c';
        const value = event.target.value;
        this.updateDraftValues(dataId, fieldName, value);
    }
    
    handleMeasurementChange(event) {
        const dataId = event.target.name;
        const fieldName = 'Measurement__c';
        const value = event.target.value;
        this.updateDraftValues(dataId, fieldName, value);
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

    handleCreateIngredient() {
        createRecord({recordName: this.searchedRecord, objectApiName: this.insertedObject})
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
			this.searchedRecord = searchTerm;
		}, 300);
	}

    handlePopulateLookup(event) {
        console.log('in the grandchild component')
        console.log('this.targetField', this.targetField);
        console.log('event.targe.value', event.target.value);
        let props = {
            detail: {
                fieldName: this.targetField,
                value: event.target.value,
            },
            bubbles: true,
            composed: true
        }
        console.log('props.fieldName', props.detail.fieldName);
        console.log('props.value', props.detail.value);
        this.dispatchEvent(new CustomEvent('recordselection', props));
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
        this.searchedRecord = '';
        this.ingredientList = [];
    }
}