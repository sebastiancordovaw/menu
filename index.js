import express, { urlencoded } from "express";
import { fileURLToPath } from 'url';
import { engine } from "express-handlebars";
import * as path from "path";
import fs  from "fs";
import  parser  from "csv-parser";

var productos = [];
var data = [];

fs.createReadStream('productos.csv')
    .pipe(parser({
        separator: ';',
        newline: '\n',
        headers: [
            'ID',
            'categoria',
            'subcategoria',
            'codigo',
            'nombre',
            'descripcion',
            'precio',
            'activo'
        ],
    }))
    .on('data', row => data.push(row))
    .on('end', () => {

        data.forEach(
            (element) => {
                var categoria =  (element["subcategoria"])?removeAccents(element["subcategoria"]):removeAccents(element["categoria"]);
                if(categoria == "Sushi")
                {
                    return false;
                }
            
                if(productos[categoria]===undefined)
                {
                    productos[categoria] = new Array();
                }
                productos[categoria].push(element); 
            }
        );
    })

const removeAccents = (str) => {
return  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s/g, '_');
} 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.use('/static', express.static(__dirname + '/public'));

app.use(express.json());
app.use(urlencoded({extended:true}));


app.get("/", (req, res)=>
{
    res.render("home",{productos:productos});
});

app.listen(3000);
console.log("servidor escuchando en",3000);
