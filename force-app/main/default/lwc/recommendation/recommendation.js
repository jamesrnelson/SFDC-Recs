import { LightningElement } from 'lwc';


export default class Recommendation extends LightningElement {

    handleRecordSelection(event) {
        console.log('in the grandparent component');
        console.log('event.target.value', event.target.value);
        console.log('event.target.fieldName', event.target.fieldName);
    }
}