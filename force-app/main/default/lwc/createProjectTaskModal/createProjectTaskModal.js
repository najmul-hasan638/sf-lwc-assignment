import { LightningElement, api, track, wire } from 'lwc';
import upsertProjectTask from '@salesforce/apex/CreateProjectTaskModalController.upsertProjectTask';
import getStatusPicklistValues from '@salesforce/apex/CreateProjectTaskModalController.getStatusPicklistValues';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateProjectTaskModal extends LightningElement {
    @api accountId;
    @api projectTaskId;

    name;
    dueDate;
    status;
    isLoading = false;
    @track statusOptions = [];

    @wire(getStatusPicklistValues)
    wiredStatusPicklist({ error, data }) {
        if (data) {
            this.statusOptions = data.map(val => ({ label: val, value: val }));
        } else if (error) {
            this.showToast('Error', 'Failed to load status options', 'error');
            console.error(error);
        }
    }

    handleCreate() {
        this.isLoading = true;
        const dto = {
            id: this.projectTaskId,
            name: this.name,
            status: this.status,
            dueDate: this.dueDate,
            accountId: this.accountId
        };
        upsertProjectTask({
            projectParams: JSON.stringify(dto)
        })
            .then(() => {
                this.showToast(
                    'Success',
                    'Project Task created',
                    'success'
                );
                this.dispatchEvent(new CustomEvent('created'));
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
                console.error(error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleOnChange(event){
        this[event.target.name] = event.detail.value;
    }
} 