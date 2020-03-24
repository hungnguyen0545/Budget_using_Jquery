// DATA CONTROLLER -- MODEL
DataCtrl = (function(){
    // make object creative by class
    //Github testing

    class KindofBudget{
        constructor(id,description,value)
        {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

 // create general object where store all of intances item what we need
 var data ;
 if(!("data" in localStorage))
 {
    let data_Init = {
        allItems : {
            inc : [],
            exp : []
        },
        total : {
            inc : 0,
            exp : 0 
        },
        budget : 0 //total.inc - total.exp
     }
    localStorage.setItem('data',JSON.stringify(data_Init));
    data = JSON.parse(localStorage.data);
 }
 else data = JSON.parse(localStorage.data);
 
   ///
   

 function calcTotal(type)
 {
   let sum=0;
   data.allItems[type].forEach(item => {
       sum += item.value ; 
   });
   data.total[type] = sum ;
   return sum;
 }

 return {
    getData  : function()
    {
        return data;
    },
    updateData : function()
    {
        Local_data = JSON.stringify(data);
        localStorage.setItem('data',Local_data);
    },
    addItems : function(type,description,value) // get those value after user input value
    {
        let newId , newItem;
        let TypeofBudget = data.allItems[type];
        // create newid for new item
        // -- newId = currentId + 1 ;
            (TypeofBudget.length > 0)
            ? newId = TypeofBudget[TypeofBudget.length-1].id  + 1
            : newId = 0 ;
        // create new instance
            newItem = new KindofBudget(newId,description,value);
        // add new instance into data.allItems[type]
            data.allItems[type].push(newItem);
            return newItem;
    },
    delItems : function(type,id)
    {
        // get real index of item in array
        Id_array = data.allItems[type].map( item => item.id);
        index_real = Id_array.indexOf(id);
        if(index_real !== -1)
        data.allItems[type].splice(id,1);
    },
    caclBudget : function()
    {
        // caculate total of income or total of expense after add new Item
        calcTotal('inc');
        calcTotal('exp');
        // caculate Budget
        data.budget = data.total['inc'] - data.total['exp'];
    },
    getBudget : function()
    {
        return {
            // return a object which store all info to display on web
            budget : data.budget,
            total_inc : data.total['inc'],
            total_exp : data.total['exp']
        }
    },
    testing : function()
    {
        
    }
}
})
()
// UI CONTROLLER   -- VIEW

UICtrl = (function(){
    // create the UI_DOM object which stores all of name of class we need to use
    UI_DOM = {
        Item_type : '.add-type',
        Item_description : '.add-description',
        Item_value : '.add-value',
        Add_item : '.add-btn',
        Del_item : '.ion-ios-close-outline',
        Budget : '.budget-value',
        Total_inc : '.budget-inc-value',
        Total_exp : '.budget-exp-value',
        inc_container : '.inc-list',
        exp_container : '.exp-list',
        Container : '.container',
        Cur_month : '.current_time'
    } 
    function formattingNumber(number){
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')//?
    }
    show_inc_item_html = (item) => { 
        value = formattingNumber(item.value)
        html = `<div class="income-item card" id="inc-${item.id}">
        <div class="item-description">${item.description}</div>
        <span class="right">
            <span class="item-value">+ ${value} đ</span>
            <button class="delete-item-btn">
                <i class="ion-ios-close-outline"></i>
            </button>
        </div>`;
        return $(UI_DOM.inc_container).append(html);
         
     };
    show_exp_item_html = (item) => {
        value = formattingNumber(item.value)
        html = `<div class="expense-item card" id="exp-${item.id}">
        <div class="item-description">${item.description}</div>
        <span class="right">
            <span class="item-value">- ${value} đ</span>
            <button class="delete-item-btn">
                <i class="ion-ios-close-outline"></i>
            </button>
        </div>`;
        return $(UI_DOM.exp_container).append(html);
    }

    
    return {
        getInput : function()
        {
           return{
            //get input value after user click add
            type : $(UI_DOM.Item_type).children("option:selected").val(),
            description : $(UI_DOM.Item_description).val(),
            value : $(UI_DOM.Item_value).val()
           }
        },
        getUI_DOM : function()
        {
            return UI_DOM;
        } ,
        displayBudget : function(data)
        {
            $(UI_DOM.Budget).text(formattingNumber(data.budget));
            $(UI_DOM.Total_inc).text(`+ ${formattingNumber(data.total_inc)} đ`) ;
            $(UI_DOM.Total_exp).text(`- ${formattingNumber(data.total_exp)} đ`);
        },
        clearField : function()
        {
                $(UI_DOM.Item_description).val('');
                $(UI_DOM.Item_value).val('');
        },
        
        showlistItem : function(data)
        {
            // show income list item 
            data.allItems['inc'].forEach((item) => {
                show_inc_item_html(item);
            })
            //show expense list item 
            data.allItems['exp'].forEach((item) => {
                show_exp_item_html(item);
            })
        },
        showNewItem : function(type,item)
        {
            if (type === 'inc')
            {
               show_inc_item_html(item);
            }
            else if( type === 'exp')
            {
                show_exp_item_html(item);
            }
        },
        deleteItem : function(id) {
            // get id of card which to remove
            el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
        getMonth : function()
        {
            let Current, months , Current_month, Current_year;
            // make months array
            months = ['January', 'February','Match','April','May','June','July','August','September','October','November','December'];
            Current = new Date();
            Current_month = Current.getMonth();
            Current_year = Current.getFullYear();
            // display time 
            $(UI_DOM.Cur_month).text(`${months[Current_month]} ${Current_year}`);
        }
    }
})()
// BUDGET CONTROLLER -- CONTROLLER

var Budget_Ctrl = (function(DataCtrl,UICtrl){
    // create a initilization function where we want initilize when app start
    var setupEventListener = (function()
    {
        var UI_DOM = UICtrl.getUI_DOM();
        // make event listener [click + enter] into button 'add-btn' 
       $(UI_DOM.Add_item).click(() => CtrlAddItem());
       $(document).keypress(event => {
        var keycode = (event.keyCode ? event.keyCode : event.which);
           if(keycode === 13)
           CtrlAddItem();
       })
       //make event listener [click] into button [Del_item]
       $(UI_DOM.Container).on('click',(e) => CtrlDeleteItem(e));//??
    });
    UpdateBudget = function()
    {
        //update Budget 
        DataCtrl.caclBudget();
        // display Budget after update
        UICtrl.displayBudget(DataCtrl.getBudget());
    }
    CtrlAddItem = function()
    {
        // get input value
        Input = UICtrl.getInput();
        // convert Input.value  from string to Number
        value = Number(Input.value);
        if(Input.description !== '' && Input.value !== '' )
        {
            // create new item 
             DataCtrl.addItems(Input.type,Input.description,value);
            // clear Field
            UICtrl.clearField();
            // update Budget
            UpdateBudget();
            // update data in local storage;
            DataCtrl.updateData();
            // display new item
            items = DataCtrl.getData().allItems[Input.type];
            newItem = items[items.length-1];
            UICtrl.showNewItem(Input.type,newItem);
        }
        else alert("you not fill enough !!! ");
    }
    CtrlDeleteItem = function(event)
    {
        let itemId,splitId,id;
        // get id and type of card which want to delete
        itemId = $(event.target).parent().parent().parent().attr('id');
        splitId = itemId.split('-');
        type = splitId[0];
        id = Number(splitId[1]);
        // delete item in DataCtrl
        DataCtrl.delItems( type , id)
        // // delete item in UICtrl
         UICtrl.deleteItem(itemId)
        // update Budget
        UpdateBudget();
        //
        DataCtrl.updateData();
    }
    return {
        init : function(){
            setupEventListener();
            UICtrl.getMonth();
            console.log('its work');
            UICtrl.displayBudget({
                budget : DataCtrl.getData().budget,
                total_inc : DataCtrl.getData().total['inc'],
                total_exp : DataCtrl.getData().total['exp']
            });
            
            console.log(DataCtrl.getData());
            //display list item
            UICtrl.showlistItem(DataCtrl.getData());
        }
    }
})(DataCtrl,UICtrl)

Budget_Ctrl.init();

