import { LightningElement, wire } from 'lwc';
import getAllObjects from '@salesforce/apex/MergeClass.getAllObjects';
import insertObjectName from '@salesforce/apex/MergeClass.insertObjectName';
import getName from '@salesforce/apex/MergeClass.getName';
import deleteObjectName from '@salesforce/apex/MergeClass.deleteObjectName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MergeCom extends LightningElement {
    Account = false;
    headervalue = false;
    objectArray = [];
    ObjName;
    selectedName;

    @wire(getAllObjects)
    AllObjects;

    get AllObjectsOptions() {
        return this.AllObjects.data;
    }

    @wire(getName)
    AllNames({ data, error }) {
        this.ObjName = data;
        console.log(JSON.stringify(this.ObjName));
    };

    handleObjects(event) {
        console.log(event.detail.value);
        for (let i = 0; i < this.ObjName.length; i++) {
            if (this.ObjName[i].Name == event.detail.value) {
                this.headervalue = true;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!',
                        message: 'You have selected this field before!',
                        variant: 'error',
                    }),
                );
            }
        }
        console.log(this.headervalue);
        if (!this.headervalue) {
            console.log(event.detail.value);
            this.objectArray.push(event.detail.value);
        }
        console.log(this.objectArray);
    }

    saveRecord() {
        console.log(this.objectArray);
        if (this.objectArray.length > 0) {
            insertObjectName({ objeName: this.objectArray }).then((data) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Object is successfully Inserted',
                        variant: 'success',
                    }),
                );
            }).catch(() => {

            })
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!',
                    message: 'Please Select the Object',
                    variant: 'error',
                }),
            );
        }

    }

    removeRow(event) {
        console.log(event.target.accessKey);

        deleteObjectName({ deletefiled: event.target.accessKey }).then((data) => {
            console.log('DeletedValue:', JSON.stringify(data))
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Field is successfully deleted',
                    variant: 'success',
                }),
            );
            this.ObjName = this.ObjName.filter(function(value, index, arr) {
                console.log(value);
                console.log(data[0]);
                if (value.Id != data[0].Id) {
                    return value;
                }
            });
            console.log('Removed Value:' + JSON.stringify(this.ObjName))
        }).catch((error) => {

        })
    }

    AuditcardBUtton(event) {
        event.preventDefault();
        this.selectedName = event.currentTarget.dataset.value;
        this.Account = true;
    }
}