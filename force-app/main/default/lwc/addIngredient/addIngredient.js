import { LightningElement, track, api, wire } from 'lwc';

export default class AddIngredient extends LightningElement {
    @api recordId;
    @api label;
    @api createOrEdit;
    @api objectApiName;
    @api recordType;  //expects the record type label (NOT the record type developer name)
    @api relatedParentRecord;
    @api parentLookupField;
    @api variant;
    @api insertedObject;
    @api placeholderText;
    @api targetField;

    @track showObjectModal;
    @track objectInfo;

    
    handleCancel(event) {
        this.closeObjectModal();
    }

    openObjectModal() {
        this.showObjectModal = true;
    }

    closeObjectModal() {
        this.dispatchEvent(new CustomEvent('reloadshoppinglistingredients'));
        this.showObjectModal = false;
        //this.resetModalSpinner();
    }
}