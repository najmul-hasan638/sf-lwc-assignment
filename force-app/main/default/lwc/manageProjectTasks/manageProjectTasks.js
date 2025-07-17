import { LightningElement, api, track } from 'lwc';
import getProjectTasksByAccountPaginated from '@salesforce/apex/ManageProjectTasksController.getProjectTasksByAccountPaginated';
import deleteProjectTask from '@salesforce/apex/ManageProjectTasksController.deleteProjectTask';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const PAGE_SIZE = 50;

export default class ManageProjectTasks extends LightningElement {
    @track tasks = [];
    @track draftValues = [];
    @track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Status', fieldName: 'Status__c', editable: true },
        { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'Delete', name: 'delete' }
                ]
            }
        }
    ];
    isLoading = false;
    lastSeenId = null;
    hasMore = true;
    isModalOpen = false;

    _recordId;

    @api
    get recordId() {
        return this._recordId;
    }
    set recordId(value) {
        this._recordId = value;
        if (value) {
            this.resetAndLoadTasks();
        }
    }

    loadTasks() {
        if (!this.recordId || !this.hasMore || this.isLoading) return;
        this.isLoading = true;
        getProjectTasksByAccountPaginated({ accountId: this.recordId, pageSize: PAGE_SIZE, lastSeenId: this.lastSeenId })
        .then(result =>{
            if (result && result.length > 0) {
                this.tasks = [...this.tasks, ...result];
                this.lastSeenId = result[result.length - 1].Id;
                this.hasMore = result.length === PAGE_SIZE;
            } else {
                this.hasMore = false;
            }
        }).catch(error => {
            this.hasMore = false;
            this.ShowToast(
                'Error loading Project Tasks',
                error?.body?.message || error?.message || 'Unknown error',
                'error',
                'dismisable'
            );
        }).finally(() => {
            this.isLoading = false;
        });
    }

    resetAndLoadTasks() {
        this.tasks = [];
        this.lastSeenId = null;
        this.hasMore = true;
        this.loadTasks();
    }

    handleSave(event) {
        this.draftValues = event.detail.draftValues;
        const recordInputs = this.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
        // Updating the records using the UiRecordAPi
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.ShowToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
            this.draftValues = [];
            return this.resetAndLoadTasks();
        }).catch(error => {
            console.log(error);
            this.ShowToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        }).finally(() => {
            this.draftValues = [];
        });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            default:
                console.warn('Unknown action: ', actionName);
        }
    }

    deleteRow(row) {
        // Confirm and delete logic
        this.isLoading = true
        console.log(row);
        deleteProjectTask({id: row.Id})
        .then(result => {
            this.ShowToast('Success', 'Record Deleted Successfully!', 'success', 'dismissable');
        }).catch(error => {
            console.log(error);
        })
        .finally(() => {
            this.isLoading = false;
            this.resetAndLoadTasks();
            
        });
    }

    handleLoadMore() {
        this.loadTasks();
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleTaskCreated() {
        this.resetAndLoadTasks();
        this.closeModal();
    }

    ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
            title: title,
            message:message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    
}