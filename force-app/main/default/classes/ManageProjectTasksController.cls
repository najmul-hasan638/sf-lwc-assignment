public with sharing class ManageProjectTasksController {
    /**
     * Returns a paginated list of Project_Task__c records for a given AccountId.
     * @param accountId The Id of the Account to filter tasks by.
     * @param pageSize The number of records to return.
     * @param lastSeenId The Id after which to start (for pagination). Pass null for the first page.
     */
    @AuraEnabled
    public static List<Project_Task__c> getProjectTasksByAccountPaginated(Id accountId, Integer pageSize, Id lastSeenId) {
        if (accountId == null || pageSize == null || pageSize <= 0) {
            throw new AuraHandledException('Invalid parameters');
        }

        String baseQuery = 'SELECT Id, Name, Status__c, Due_Date__c, Account__c FROM Project_Task__c WHERE Account__c = :accountId';
        Map<String, Object> binds = new Map<String, Object>{'accountId' => accountId, 'pageSize' => pageSize};

        if (lastSeenId != null) {
            baseQuery += ' AND Id > :lastSeenId';
            binds.put('lastSeenId', lastSeenId);
        }

        baseQuery += ' ORDER BY Id ASC LIMIT :pageSize';

        // ✅ Assign the result
        List<Project_Task__c> tasks = (List<Project_Task__c>) Database.queryWithBinds(baseQuery, binds, AccessLevel.USER_MODE);
        return tasks;
    }

    @AuraEnabled
    public static void deleteProjectTask(Id id) {
        delete [SELECT Id FROM Project_Task__c WHERE Id = :id];
    }
}