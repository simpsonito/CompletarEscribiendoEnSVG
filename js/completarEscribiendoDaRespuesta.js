$(function(){
	//alert("cargado");
	iniciar();

    function iniciar(){
        var caja;
        $("#TextosDinamicos input").each(function(index){
            caja = $(this);
            caja.attr("class", "" );

            var respuesta = $(this).data("respuesta");//atributo definido como data-respuesta en index.html
            if(typeof respuesta === "object"){
                caja.attr("size", String(respuesta[0]).length + 2);
            } else if (typeof respuesta === "string") {
                caja.attr("size", caja.attr("data-respuesta").length + 2);
            }
            caja.focus(function(e){
                console.log(respuesta);
                $(this).attr("class", "");
            });
        });
    }
    var uiDialogo = $("#dialog");
    uiDialogo.dialog({
        title:"Mensaje",
        modal:true,
        show:"slideDown",
        hide:"slideUp",
        autoOpen:false,
        buttons: [
            {
                text: "Aceptar",
                icons: {
                    primary: "ui-icon-check"
                },
                click: function() {
                    $(this).dialog( "close" );
                }
            }
        ]
    });

    $("#btnCalificar").click(revisar);
    $("#btnResetear").click(reiniciar);
    function revisar(){
        var caja;
        var buenas = 0;
        var total = $("#TextosDinamicos input").length;
        var mensajeFinal = "";
        $("#TextosDinamicos input").each(function(index){
            caja = $(this);
            var jCajaRespuesta = $(caja).data("respuesta");
            if(caja.val() != ""){
                if(compararResultados(jCajaRespuesta, caja.val())){
                    caja.attr("class", "correcto" );
                    caja.prop('disabled', true);
                    //caja.val(caja.attr("data-respuesta"));
                    ++buenas;
                } else {
                    caja.attr("class", "incorrecto" );
                    var mensajeMal = "";
                    if(typeof jCajaRespuesta === "object"){
                        mensajeMal = jCajaRespuesta.join(" o ");
                        console.log(mensajeMal);
                    } else {
                        mensajeMal = jCajaRespuesta;
                    }

                    if(caja.next().attr('class') === "retroMal"){
                        caja.next().html(mensajeMal);
                    } else {
                        var retroMal = $("<div class='retroMal'></div>");
                        retroMal.append(mensajeMal);
                        caja.after(retroMal);
                    }
                }
            } else {
                mensajeFinal = "Por favor llena todos los campos de texto";
            }
        });
        var textosRetros = $(".retroFinal").toArray();
        if(mensajeFinal === ""){
            if(buenas === total){
                mensajeFinal = textosRetros[3].innerHTML;
            } else if(buenas > 7){
                mensajeFinal = textosRetros[2].innerHTML;
            } else if(buenas > 3){
                mensajeFinal = textosRetros[1].innerHTML;
            } else {
                mensajeFinal = textosRetros[0].innerHTML;
            }
            retroalimentar(mensajeFinal+"<br/>Obtuviste <b>"+buenas+"</b> de <b>"+total+"</b>.");
        } else {
            retroalimentar(mensajeFinal);
        }

    }
    function compararResultados(valorAtributo, valorEscrito){
        var respuesta = valorAtributo;
        if(typeof respuesta === "string"){
            return quitarAcentos(respuesta) === quitarAcentos(valorEscrito);
        } else if(typeof respuesta === "number"){
            return respuesta === parseFloat(valorEscrito);
        } else if(typeof respuesta === "object"){
            return respuesta.some(function(elemento){
                return compararResultados(elemento, valorEscrito);
            });
        }
    }
    function retroalimentar(cadena){
        //$('#retroalimentacion').html(cadena);
        uiDialogo.html(cadena).dialog( "option", "title", "Mensaje" ).dialog("open");
    }
    function quitarAcentos(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
        return str;
    }
    function reiniciar(){
        var caja;
        $("#TextosDinamicos input[type='text']").each(function(index){
            caja = $(this);
            caja.val("");
            caja.attr("class", "" );
            caja.prop('disabled', false);
        });
        $(".retroMal").remove();
    }

});