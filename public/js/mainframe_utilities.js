//Script encargado de ejecutar los ajax que cambian el mainframe

function show_resources() {
    $.ajax({
        type: 'POST',
        url: "/resource/",
        success: function (html) {
            $("#mainframe").empty();
            $("#mainframe").append(html);
        }
    });
}



//Abrir modal crear nuevo recurso
function new_resource() {
    $('#modal_new_resource').modal('toggle');
}

//onready
$(document).ready(show_resources);

