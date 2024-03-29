import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import nodecallspython from "node-calls-python";

const py = nodecallspython.interpreter;

import {dirname} from "path";
import {fileURLToPath} from "url";

const dir_name = dirname(fileURLToPath(import.meta.url));

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(dir_name + "/index.html");
})

//use react/ double check error handling
app.post("/result", async (req, res) => {
    try {
    const encoded = encodeURIComponent(req.body.expression);
    const result = await axios.get("https://newton.now.sh/api/v2/" + req.body.op + "/" + encoded);
    const response = result.data;
    res.render("result.ejs", { result: response.result });
    } catch(err) {
        res.render("result.ejs", { result: "We have detected an error in your submission. Please go back and read the bullet points mentioned, recheck your expression and/or make sure you have selected a valid operation." });
    }
} )

app.post("/eigenval", async (req, res) => {
    py.import("./linalg.py").then(async (file) => {
        const result = await py.call(file, "eigenvalue", [[1, 2, 3], [4, 0, 0], [6, -1, 0]]);
        console.log(result);
    })
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})