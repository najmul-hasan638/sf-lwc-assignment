public with sharing class DTO_ProjectTask {
    @AuraEnabled
    public Id id { get; set; }
    @AuraEnabled
    public Id accountId { get; set; }
    @AuraEnabled
    public String name { get; set; }
    @AuraEnabled
    public String status { get; set; }
    @AuraEnabled
    public Date dueDate { get; set; }
}