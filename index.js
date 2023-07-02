import express, {json} from "express";
import cors from "cors";
const port = process.env.port || 5000;
const app = express();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, setDoc, doc} from "firebase/firestore";

// import { doc, setDoc, collection } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOL9iSANI0oZ-zcU8FQDJcCc0-aWyCYz0",
  authDomain: "pfms-e0fd3.firebaseapp.com",
  projectId: "pfms-e0fd3",
  storageBucket: "pfms-e0fd3.appspot.com",
  messagingSenderId: "987689601139",
  appId: "1:987689601139:web:a47c01f7c5294812b30206",
  measurementId: "G-NR48YRKX0Q"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);

app.use(cors());
app.use(json());

app.get("/api/status", (req,res)=>{
    res.status(200).send("Check status");
})

// read ph value
app.get("/api/update-ph",  async (req, res)=>{
    // Add a new document in collection "cities"
    
    console.log("PH: ", req.query.ph);
    res.status(200).send("Successfully updated PH value");
})

app.get("/api/record-ph", async (req, res) => {
    const t = formatTime();
    const ph = req.query.ph;
    await setDoc(doc(db, "phValues", t), {
        date: t,
        value: ph
    }).then(() => {
        console.log("PH Value successfully written!");
        res.status(200).send("PH Value successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        res.status(503).send("Error writing PH Value");
    });

})

app.listen(port, () => {
    console.log("Listening on port : ", port);
})

const formatTime = () => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let date = d.getDate();
    let res = `${year}-${month>10?month:'0'+month}-${date>10?date:'0'+date}`;
    return res;
}