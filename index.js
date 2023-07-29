import express, {json} from "express";
import cors from "cors";
const port = process.env.port || 5000;
const app = express();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, setDoc, doc, getDoc, getDocs, collection} from "firebase/firestore";

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

function isDateWithinLast30Days(dateString) {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate - inputDate;
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  console.log(differenceInDays);
  return differenceInDays <= 30;
}

function isDateWithinLast7Days(dateString) {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate - inputDate;
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  console.log(differenceInDays);
  return differenceInDays <= 7;
}

// let phList = [
//   {"date": "2023-06-21", "value": 4.62},
//   {"date": "2023-06-22", "value": 8.01},
//   {"date": "2023-06-23", "value": 3.25},
//   {"date": "2023-06-24", "value": 6.95},
//   {"date": "2023-06-25", "value": 7.82},
//   {"date": "2023-06-26", "value": 5.43},
//   {"date": "2023-06-27", "value": 9.14},
//   {"date": "2023-06-28", "value": 2.78},
//   {"date": "2023-06-29", "value": 6.18},
//   {"date": "2023-06-30", "value": 7.90},
//   {"date": "2023-07-01", "value": 3.98},
//   {"date": "2023-07-02", "value": 5.67},
//   {"date": "2023-07-03", "value": 8.76},
//   {"date": "2023-07-04", "value": 4.31},
//   {"date": "2023-07-05", "value": 6.57},
//   {"date": "2023-07-06", "value": 7.03},
//   {"date": "2023-07-07", "value": 2.99},
//   {"date": "2023-07-08", "value": 9.68},
//   {"date": "2023-07-09", "value": 4.87},
//   {"date": "2023-07-10", "value": 6.75},
//   {"date": "2023-07-11", "value": 7.51},
//   {"date": "2023-07-12", "value": 5.12},
//   {"date": "2023-07-13", "value": 8.32},
//   {"date": "2023-07-14", "value": 3.70},
//   {"date": "2023-07-15", "value": 6.86},
//   {"date": "2023-07-16", "value": 4.99},
//   {"date": "2023-07-17", "value": 7.35},
//   {"date": "2023-07-18", "value": 2.88},
//   {"date": "2023-07-19", "value": 9.02},
//   {"date": "2023-07-20", "value": 5.78}
// ];

// phList.forEach(async (item) => {
//     await setDoc(doc(db, "phValues", item.date), {
//         date: item.date,
//         value: item.value
//     }).then(() => {
//         console.log("PH Value successfully written!");
//     })
//     .catch((error) => {
//         console.error("Error writing document: ", error);
//     });
// })


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

app.get("/api/get-ph", async (req, res) => {
    const duration = Number(req.query.duration);
    console.log(duration);
    let out = [];
    const phRef = collection(db, "phValues")
    const querySnapshot = await getDocs(phRef);
    if(duration == 7) {
        querySnapshot.forEach((doc)=>{
            if(isDateWithinLast7Days(doc.data()['date'])) {
                console.log(isDateWithinLast7Days(doc.data()['date']))
                out = [...out, {...doc.data(), pH:Number(doc.data()['value'])}];
            }
        })
    } else if(duration == 30) {
        querySnapshot.forEach((doc)=>{
            if(isDateWithinLast30Days(doc.data()['date'])) {
                out = [...out, {...doc.data(), pH:Number(doc.data()['value'])}];
            }
        })
    }
    console.log(out);
    res.status(200).send(out);
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