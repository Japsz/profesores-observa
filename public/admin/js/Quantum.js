// Redirige a la url de data-link y renderiza una vista en pageWrapper
function ajax(yo){    
    $.ajax({
        type: 'GET',
        url: $(yo).data('link'), 
        beforeSend: function(){
            $("#pageWrapper").css('display', 'none');
        },
        success: function(data){
            if(data != "error"){
                $("#pageWrapper").html(data);
                $("#pageWrapper").css('display', 'block');
            }
        }
    });
}

function ajax_send(caller,target,type = "insert",data = {},callback = {}){
    if(jQuery.isEmptyObject(data)) data = $(caller).data();
    $.ajax({
        url: $(caller).data('url'),
        data: data,
        type: 'post',
        success: function(data){
            if(!data.err){
                switch(type){
                    case "insert":
                        $(target).html(data.html);
                        break;
                    case "redirect":
                        window.location = data.url;
                        break;
                    case "relocate":
                        window.location = target;
                        break;
                    case "custom":
                        callback(data);
                        break;
                    default:
                        break;
                }
            } else alert(data.errMsg);
        }
    });
};

// Agrega un profesor nuevo, lo envia al controlador
$("#newTeacherForm").on('submit',function(e){
    e.preventDefault();
    var data = {};
    $("#newTeacherForm input").each(function (idx) {
        data[$(this).attr("name")] = $(this).val();
    });
    ajax_send(this,"","custom",data,function (iduser) {
        if(iduser.value){
            $("#newTeacherEmail").addClass("is-invalid");
        } else {
            $.ajax({
                url:'/administrador/newTeacher',
                type: 'post',
                data: data,
                success: function(data){
                    if(!data.err){
                        alert("Usuario Creado!");
                        $("#modalNewTeacher").modal('toggle');
                    } else alert(data.errMsg);
                }
            })
        }
    });
    return false;
});


