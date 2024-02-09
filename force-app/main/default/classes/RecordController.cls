public with sharing class RecordController {
    public RecordController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> getSearchedRecords(String param, String objectApiName) {
        string tempInput = '%' + param + '%';
        String queryString = 'SELECT Id, Name FROM ' + objectApiName + ' WHERE Name LIKE \'' + tempInput + '\' ORDER BY Name ASC';  
        List<SObject> matchingRecords = Database.query(queryString);

        return matchingRecords;
    }

    @AuraEnabled
    public static void createRecord(String recordName, String objectApiName) {
        sObject rec = Schema.getGlobalDescribe().get(objectApiName).newSObject();
        if (objectApiName == 'Contact') {
            rec.put('LastName', recordName);
        } else {
            rec.put('Name', recordName);
        }

        insert rec;
    }
}