/**
 * Created by Sagar on 17/07/2017.
 */

function _getDataFromArray(dataList, index, path) {
    //console.log(dataList);
    if(dataList.value===null){
        return;
    }
    return this.get(path, dataList.base[index]);
}

function _getLayout(flag){
    var layout='';
    switch(flag){
        case 'claimants':
            layout = {list:'L131_CLAIMANT_List_View',detail:'L130_CLAIMANT_Data_Entry'};
            break;
        case 'clients':
            layout = {list:'L11_ACCOUNTS_List_View',detail:'L10_ACCOUNTS_Data_Entry'};
            break;
        case 'contacts':
            layout = {list:'L31_CONTACTS_List_View',detail:'L30_CONTACTS_Data_Entry'};
            break;
        case 'investigators':
            layout = {list:'L131_INVESTIGATOR_List_View',detail:'L130_INVESTIGATOR_Data_Entry'};
            break;
        case 'projects':
            layout = {list:'L121_PROJECTS_List_View',detail:'L120_Projects_Data_entry'};
            break;
        case 'staffs':
            layout = {list:'L131_STAFF_List_View',detail:'L130_STAFF_Data_Entry'};
            break;
        case 'tasks':
            layout = {list:'L141_TIMESHEETS_List_View',detail:'L140_TIMESHEETS_Data_Entry'};
            break;
    }
    return layout;
}


function _getClassForStatus(status) {
    //console.log(status);
    if (status=="Open") {
        return "open";
    }
    return "completed";
}
