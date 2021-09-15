const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "recette_facile"
});

/**Importation du miniframework Express */
var express = require("express");

/**Création d'une application web via l'objet Express */
var app = express();

/**Configuration de l'application web Express */
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3000);

app.use(express.json());

/**requete a la db */
con.connect(function (err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
    con.query("SELECT * from recette;", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});

app.post('/recette', (req, res) => {
    query = "INSERT INTO RECETTE (titre,resumer) values ('" + req.body.titre + "','"
        + req.body.resume + "');";
    console.log(query);
    con.query(query, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).json(result);
    });
});

app.get('/recette/:id', function (request, response) {
    if (request.params.id == null) {
        let messErreur = "Vous n'avez pas entré de numéro d'identifiant";
        response.status(400).json(messErreur);
    }
    if (request.params.id <= 0) {
        let messErreur = "Vous devez entrer un identifiant suppérieur à zero";
        response.status(400).json(messErreur);
    }
    else {
        // execute la query
        con.query("SELECT * from recette where id=" + request.params.id + ";",
        function (err, result) {
            // si (err) --> 503 + petit message         
            if (err) {
                let messErreur = "Une erreur est survenue";
                response.status(503).json(messErreur);   
            }
            // sinon   response.status(200).json(result);
            else{
                //if (err) throw err;
                console.log(result);
                console.log(request);
                response.status(200).json(result);
            }
        })
    }
});

/** Définition des routes */
app.get("/", function (request, response) {
    response.render("homePage");
});

app.get("/recette", function (request, response) {
    con.query("SELECT * from recette;", function (err, result) {
        if (err) throw err;
        console.log(result);
        response.status(200).json(result);
    })
});

app.get('/recette/:id', function (request, response) {
    con.query("SELECT * from recette where id=" + request.params.id + ";", function
        (err, result) {
        if (err) throw err;
        console.log(result);
        response.status(200).json(result);
    })
});