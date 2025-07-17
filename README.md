
# Project Task List Functionality

This Salesforce project includes a robust Project Task List feature built with Lightning Web Components (LWC) and Apex.

## Features

- **Paginated Task List**: Displays all `Project_Task__c` records related to an Account in a Lightning datatable. Supports loading more records as you scroll (infinite loading) or via pagination buttons.
- **Create New Task**: A "New Task" button opens a modal where you can create a new Project Task related to the current Account. The modal uses a custom LWC and supports picklist values for the Status field.
- **Edit Tasks Inline**: Edit fields like Status and Due Date directly in the datatable. Changes are saved using the Lightning Data Service.
- **Delete Tasks**: Each row has a delete action to remove a Project Task.
- **Dynamic Picklist**: The Status picklist in the modal is dynamically populated from Apex, ensuring it always matches the org's configuration.

## Key Components

- `manageProjectTasks` (LWC):
  - Shows the datatable of Project Tasks for the current Account (`recordId`).
  - Handles pagination, inline editing, and row actions (delete).
  - Opens the modal for creating a new task.

- `createProjectTaskModal` (LWC):
  - Modal dialog for creating a new Project Task.
  - Uses Apex to fetch picklist values for the Status field.
  - Calls an Apex method to upsert the new Project Task.

- **Quick Action**:
  - SF LWC Assignment Permissions

- **Apex Controllers**:
  - `ManageProjectTasksController.cls`: Handles paginated queries and deletion of Project Tasks.
  - `CreateProjectTaskModalController.cls`: Handles upsert (create/update) and provides picklist values for the modal.

## Usage

1.create a new scratch org
2. Run `sf project deploy start --source-dir force-app --ignore-conflicts`.
3. Assign `SF LWC Assignment Permissions` Permission Set to your scratch org user.
3. Use the "Manage Project Tasks" button to add new Project Tasks, or edit/delete existing ones directly from the list.


