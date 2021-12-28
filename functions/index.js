const functions = require("firebase-functions");
const admin = require("firebase-admin");


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const serviceAccount = require(".\/nicoavila-allpurpose-firebase-adminsdk-tbnud-5af8fc8f2e.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nicoavila-allpurpose.firebaseio.com/",
});


const db = admin.database();
const ref = db.ref();
const logsReference = ref.child("logs")
const patientsReference = db.ref("pacientes");


exports.pacientes = functions.https.onRequest((request, response)=>{
  logsReference.push({createdAt: Date.now(), message: `Acceso Endpoint ${request.method} /pacientes`});
  switch(request.method){
    case 'GET':
      const pth = request.path;
      const pathSplt = pth.split("/");
      console.log(pathSplt[1]);
      
      //Caso busqueda de paciente por UUID
      if(pathSplt[1]){
        patientsReference.child(pathSplt[1]).on('value', (snapshot) => {
          if(snapshot.val().Accesible){
            response.json(snapshot.val());
          }
          else if(!snapshot.val().Accesible){
            response.status(403).send();
          }
        });
      }
      else {
        patientsReference.on('value', (snapshot)=>{
          response.json(snapshot.val());
        });
      }
      break;
      //caso busqueda. path = /pacientes/{UUID}
      //return response.send(pathSplt.length+"  "+pathSplt);
      

    case 'POST':
      patientsReference.push(request.body);
      console.log();
      response.send("paciente creado: "+request.body.nombre+" "+request.body.ApellidoPaterno);
      break;
  }

  
  
  
  
  
});
