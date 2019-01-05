//Script encargado de ejecutar los ajax que cambian el mainframe

function show_resources() {
    $.ajax({
        type: 'GET',
        url: "/resource/",
        success: function (html) {
            $("#mainframe").empty();
            $("#mainframe").append(html);
        }
    });
}

function show_a_resource(idresource) {
    $.ajax({
        type: 'GET',
        url: "/resource/"+idresource,
        success: function (html) {
            $("#mainframe").empty();
            $("#mainframe").append(html);
        }
    });
}

//onready
$(document).ready(show_resources);



