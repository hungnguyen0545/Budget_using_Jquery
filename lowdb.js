$(document).ready(function(){
    $('.btn-show').click(function(){
        $.ajax({
            url : 'http://localhost:3000/income_list',
            method : 'GET',
            dataType : 'JSON',
            success : function(data){
                console.log(data[0].value);
                
            }
        })
})
    $('.btn-add').click(function(){
        var local_inc = { "id": 1, "body": "some comment", "postId": 1 };
        // for(let i = 0 ; i < local_inc.length; i++)
        // {
            $.ajax({
                url : 'http://localhost:3000/comments',
                method : 'POST',
                ContentType : 'application/json',
                data : local_inc,
                success : function(){
                    alert('add data completed');
                }
            })
        // }
        
    })

    $('.btn-del').click(function(){
        var local_inc = JSON.parse(localStorage.data).allItems['inc'];
        for(let i = 0 ; i < local_inc.length; i++)
        {
            $.ajax({
                url : `http://localhost:3000/income_list/${i+1}`,
                method : 'DELETE',
                success : function(){
                    alert('delete data completed');
                }
            })
        }
        
    })

    $('.btn-update').click(function(){
        $.ajax({
            url : 'http://localhost:3000/income_list/1',
            method : 'PUT',
            contentType : 'application/json',
            dataType : 'JSON',
            data : JSON.parse(localStorage.data).allItems['inc'][0],
            success : function(){
                alert('update data success');
            }
        })
})
})  
