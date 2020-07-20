public with sharing class MergeClass {
    @AuraEnabled(cacheable=true)
     public static List<OptionWrapper> getAllObjects(){
        List<OptionWrapper> sobjectname = new List<OptionWrapper>();
        List<String> sObjectList = new List<String>();
        for(Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values()){
            Schema.DescribeSObjectResult res = objTyp.getDescribe();
            if(!objTyp.getDescribe().getName().containsignorecase('history') && !objTyp.getDescribe().getName().containsignorecase('tag')&&
                !objTyp.getDescribe().getName().containsignorecase('share') && !objTyp.getDescribe().getName().containsignorecase('feed') && 
                !objTyp.getDescribe().getName().containsignorecase('Event')){
                sobjectname.add(new OptionWrapper(res.getLabel(),objTyp.getDescribe().getName()));
            }
        }
        return sobjectname;
    }

    @AuraEnabled
    public static void insertObjectName(List<String> objeName){
        System.debug(objeName);
        List<Object_Name__c> obList = new List<Object_Name__c>();
        for(String o: objeName){
            Object_Name__c obb = new Object_Name__c();
            obb.Name = o;
            obList.add(obb);
        }
        insert obList;
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Object_Name__c> getName(){
        List<Object_Name__c> name = [select Id,Name from Object_Name__c];
        return name;
    }

    @AuraEnabled(cacheable=true)
    public static List<OptionWrapper> getObjecttFields(String objectname){
        List<String> strl = new List<String>();
        List<Merge_Config__c> fields =  getFieldNames(objectname);
        List<OptionWrapper> optionlist = new List<OptionWrapper>();
        SObjectType contactType = Schema.getGlobalDescribe().get(objectname);
        Map<String,Schema.SObjectField> mfields = contactType.getDescribe().fields.getMap();
        for(String s : mfields.keySet()){
            optionlist.add(new OptionWrapper(String.valueOf(mfields.get(s)),String.valueOf(mfields.get(s))));
        }
        return optionlist;
    }

    @AuraEnabled
    public static List<Merge_Config__c> saveValues(String obName,String fieldValue){
        System.debug('obName'+obName+'fieldValue'+fieldValue);
        String fieldName = fieldValue;
        String fieldAPI = fieldValue;
        String word = '__c';
        if (fieldAPI.contains(word)) { 
            String tempWord = word + ''; 
            fieldAPI = fieldAPI.replaceAll(tempWord, ''); 
            tempWord = '' + word; 
            fieldAPI = fieldAPI.replaceAll(tempWord, ''); 
        }
        System.debug('string'+fieldAPI);
        System.debug(fieldName);
        List<Merge_Config__c> merList = new List<Merge_Config__c>();
        Merge_Config__c mer = new Merge_Config__c();
        mer.Object_Name__c = obName;
        mer.Object_API_Name__c = obName;
        mer.FieldName__c = fieldAPI;
        mer.FieldAPIName__c = fieldName;
        merList.add(mer);

        insert merList;
        
       return merList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Merge_Config__c> getFieldNames(String objectname){
        List<Merge_Config__c> fleldname;
        try{
            fleldname = [select id,FieldName__c from Merge_Config__c where Object_Name__c =:objectname WITH SECURITY_ENFORCED];
        }catch(System.QueryException qe) {
            System.debug(qe.getMessage());
        }
        return fleldname;
    }

    @AuraEnabled
    public static  List<Merge_Config__c> deletefromorg(String deletefiled){
        List<Merge_Config__c> deletelist;
        try{
            deletelist = [select id,FieldName__c from Merge_Config__c where FieldName__c =:deletefiled WITH SECURITY_ENFORCED];
        }catch(System.QueryException qe) {
            System.debug(qe.getMessage());
        }
        System.debug(deletelist);
        delete deletelist;

        return deletelist;
    }

    @AuraEnabled
    public static  List<Object_Name__c> deleteObjectName(String deletefiled){
        List<Object_Name__c> deletelist;
        try{
            deletelist = [select id,Name from Object_Name__c where Name =:deletefiled WITH SECURITY_ENFORCED];
        }catch(System.QueryException qe) {
            System.debug(qe.getMessage());
        }
        System.debug(deletelist);
        delete deletelist;

        return deletelist;
    }

    public class OptionWrapper {
        @AuraEnabled
        public String label {get; set;}
        @AuraEnabled
        public String value {get; set;}

        public OptionWrapper(String label, String value) {
            this.label = label;
            this.value = value;
        }
    }
}
