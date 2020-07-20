import { LightningElement, api, wire } from 'lwc';
import getObjecttFields from '@salesforce/apex/MergeClass.getObjecttFields';
import saveValues from '@salesforce/apex/MergeClass.saveValues';
import getFieldNames from '@salesforce/apex/MergeClass.getFieldNames';
import deletefromorg from '@salesforce/apex/MergeClass.deletefromorg';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MergeComChild extends LightningElement {
    @api accObject;
    objectName;
    fieldName;
    selectedfiled;
    keyIndex = 0;
    count = 0;
    newvar;
    itemList = [{
        id: 0
    }];

    addRow() {
        ++this.keyIndex;
        var newItem = [{ id: this.keyIndex }];
        this.itemList = this.itemList.concat(newItem);
    }

    @wire(getObjecttFields, { objectname: '$accObject' })
    AccountFileds;

    get fieldsofAccount() {
        return this.AccountFileds.data;
    }

    @wire(getFieldNames, { objectname: '$accObject' })
    AccountFiledsfromorg({ data, error }) {
        if (data) {
            this.newvar = data;
            console.log('NewVar:' + JSON.stringify(this.newvar));
        }

    };

    handelFileds(event) {
        console.log(event.detail.value);
        for (let i = 0; i < this.newvar.length; i++) {
            if (this.newvar[i].FieldName__c == event.detail.value) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!',
                        message: 'You have selected this field before!',
                        variant: 'error',
                    }),
                );
            }
        }
        this.fieldName = event.detail.value;
    }

    saveRecord() {
        saveValues({ obName: this.accObject, fieldValue: this.fieldName }).then((data) => {
            console.log(data);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Field is successfully created',
                    variant: 'success',
                }),
            );
            window.onload();
        }).catch(() => {

        })
    }

    removeRow(event) {
        console.log(event.target.accessKey);

        deletefromorg({ deletefiled: event.target.accessKey }).then((data) => {
            console.log('DeletedValue:', JSON.stringify(data))
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Field is successfully deleted',
                    variant: 'success',
                }),
            );
            this.newvar = this.newvar.filter(function(value, index, arr) {
                console.log(value);
                console.log(data[0]);
                if (value.Id != data[0].Id) {
                    return value;
                }
            });
            console.log('Removed Value:' + JSON.stringify(this.newvar))
        }).catch((error) => {

        })
    }
}