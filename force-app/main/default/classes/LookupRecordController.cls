public with sharing class LookupRecordController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String param) {
        string tempInput = '%' + param + '%';
        List<Contact> matchingContacts = [
            SELECT Id, Name
            FROM Contact WHERE Name LIKE :tempInput ORDER BY Name ASC
        ];

        return matchingContacts;
    }


    @AuraEnabled
    public static void createRecord(String junctionIngredient) {
        try {
            SObject recordToInsert = (SObject)JSON.deserialize(junctionIngredient, SObject.class);
            insert recordToInsert;
        } catch(Exception e) {
            throw new AuraHandledException('There was an error creating the record. See this error: ' +
                e.getMessage() + 'Stack Trace: ' + e.getStackTraceString()
            );
        }
    }
}