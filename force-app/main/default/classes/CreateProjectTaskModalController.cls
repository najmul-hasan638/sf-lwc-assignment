public with sharing class CreateProjectTaskModalController {

    @AuraEnabled
    public static String upsertProjectTask(String projectParams) {
        DTO_ProjectTask dto = (DTO_ProjectTask) JSON.deserialize(projectParams, DTO_ProjectTask.class);
        Project_Task__c projectTask = new Project_Task__c(
            Id = dto.id,
            Name = dto.name,
            Status__c = dto.status,
            Due_Date__c = dto.dueDate,
            Account__c = dto.accountId
        );
        upsert projectTask;
        return projectTask.Id;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getStatusPicklistValues() {
        List<String> values = new List<String>();
        Schema.DescribeFieldResult fieldResult = Project_Task__c.Status__c.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry entry : picklistEntries) {
            values.add(entry.getValue());
        }
        return values;
    }
}