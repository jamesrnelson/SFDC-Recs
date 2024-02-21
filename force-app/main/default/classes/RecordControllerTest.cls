@IsTest
public with sharing class RecordControllerTest {
    @IsTest
    static void testCreateRecord(){
        String contactName = 'Test Contact Name';
        String objectApiName = 'Contact';

        Test.startTest();
            RecordController.createRecord(contactName, objectApiName);
        Test.stopTest();

        List<Contact> retrievedContacts = [SELECT Id, Name FROM Contact WHERE Name = :contactName];

        Assert.areEqual(1, retrievedContacts.size());
    }
}