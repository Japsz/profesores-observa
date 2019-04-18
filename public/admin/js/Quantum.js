// Redirige a la url de data-link y renderiza una vista en pageWrapper
function ajax(link){    
    $.ajax({
        type: 'GET',
        url: link, 
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
};

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

// Habilita el profesor
function valid_teacher(yo){
    $.ajax({
        type: 'POST',
        data: { idteacher: $(yo).data("teacher") },
        url: '/administrador/valid_teacher',
        success: function(data){
            if(data == "ok"){
                alert("Se ha validado el profesor, se le enviará un correo al profesor.");
                ajax('/administrador/valid_inscription');
            } else{
                alert("Error al validar el profesor, consulte con su desarrollador.");
            }
        }
    });
}

// Inhabilita el "profesor"
function disable_teacher(yo){
    $.ajax({
        type: 'POST',
        data: { idteacher: $(yo).data("teacher") },
        url: '/administrador/disable_teacher',
        success: function(data){
            if(data == "ok"){
                alert("Se ha inhabilitado el usuario.");
                ajax('/administrador/valid_inscription');
            } else{
                alert("Error al inhabilitar el profesor, consulte con su desarrollador.");
            }
        }
    });
};
function updResponse(idevent,response){
    /*
    ajax_send(this,'','custom',{},function(data){
        ;
    })*/
    if(response == 'remove'){
        $("#delResponse" + idevent).addClass('hidden');
    } else {
        $("#delResponse" + idevent).removeClass('hidden');
    }
    console.log(response);
    $("#attResponse" + idevent + " a").each(function(idx){
        $(this).removeClass('active');
        console.log($(this).data('state'));
        if($(this).data('state') == response){
            if(response != 'remove'){
                $(this).addClass('active');
            }
        }
    });
    $.ajax({
        url: '/evento/getMembers/' + idevent,
        type: 'get',
        success: function(data){
            if(!data.err){
                $("#att" + idevent).html(data.html);
                $("#attCount" + idevent).html(data.count);
            } else {
                alert(data.errMsg);
            }
        }
    })
};
// Carga el Evnt en el modal
function getModalEvnt(idgoogle){
    $.ajax({
        type: 'GET',
        url: '/calendar/getEvnt/' + idgoogle,
        success: function(data){
            $("#evntModalBody").html(data);
        }
    });
}

