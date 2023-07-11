import express from "express";
const app = express();

app.get("/", (req, res)=>{
    res.render("src/index.html");
});

app.listen(3000);
console.log("servidor escuchando en",3000);
