const { createServer } = require("http"); 
const { createReadStream,stat } = require("fs"); 

function contentType(extension){
    if(extension == "html") return "text/html";
    if(extension == "css") return "text/css";
    if(extension == "js") return "text/javascript";
    if(extension == "jpg" || extension == "jpeg") return "image/jpeg";
    if(extension == "png") return "image/png";
    return "text/plain";
}

function servirFichero(respuesta,ruta,tipo,status){
    respuesta.writeHead(status, {"Content-type" : tipo}); // 200--> status de la respuesta | {"Content-type" : "text/html"} --> tipo de dato

    let fichero = createReadStream(ruta);

    fichero.pipe(respuesta);

    fichero.on("end", () => respuesta.end());
}

createServer((peticion,respuesta) => { //peticion --> flujo de lectura | respuesta --> flujo de escritura 
    if(peticion.url == "/"){
        servirFichero(respuesta,"./estaticos/index.html",contentType("html"), 200);
    }else{
        let ruta = "./estaticos" + peticion.url; //Ej. ./estaticos/css/estilos.css
        stat(ruta, (error, informacion) => {
            if(!error && informacion.isFile()){
                return servirFichero(respuesta,ruta,contentType(ruta.split(".").pop()),200); //extrae la extensión del final.
            }
        });

        //servirFichero(respuesta,"/404.html",contentType("html"), 404);
    }
    
}).listen(process.env.PORT || 4000); 