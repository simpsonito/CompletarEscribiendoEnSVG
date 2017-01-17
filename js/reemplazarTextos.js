/**
 * Created by adib on 1/17/17.
 */
$(function () {
    var contenedor = $("svg #TextosDinamicos");
    var textosDinamicos = $("svg #TextosDinamicos text");
    textosDinamicos.each(function (i, caja) {
        var respuesta = caja.innerHTML;
        var numChar = respuesta.length;
        contenedor.append('<foreignObject x="-10" y="-21"  transform="' + $(caja).attr("transform") + '" width="'+(numChar*15)+'" height="100"><input type="text" data-respuesta="'+respuesta+'" size="'+numChar+'" /></foreignObject>');
        caja.setAttribute("visibility", "hidden");
    });
    //refrescar el parseo del HTML porque al parecer Jquery no parsea SVG automáticamente
    var actividad = $("#actividadSVG");
    var contenidoOriginal = actividad.html();
    actividad.html(contenidoOriginal);
});