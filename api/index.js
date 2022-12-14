import 'dotenv/config';

//PUBLIC LIBS
  import cors from 'cors';
  import qs from 'qs';
  import express from 'express';
  const { v4 } = require('uuid');
  const extractDomain = require("extract-domain");
  import axios from 'axios';
  const { Configuration, OpenAIApi } = require("openai");

//LOCAL LIBS
  import orgs from './salescontactlist.json'
  import bubble from './endpoints/bubble';
  import hubspot from './endpoints/hubspot';
  import enrich from './endpoints/enrich';

//SETUP
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    req.context = {
      bubble_api_key: process.env.bubble_api_key,
    };
    next();
  });



//ENDPOINTS

app.get('/api', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Cache-Control',
    's-max-age=1, stale-while-revalidate',
  );

  console.log("API ok")


  res.json({
    success:true
  })
});


/* DELTA PROTECT EXCEPTION */
app.get('/deltaFunction', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let token=req.query.token;
  let why=req.query.why;
  let resp="";

  if(token == "y2o4gt9bviey"){ //Contactanos
    if(why == 1) resp = '"engine_1" : "iso27001"'
    else if(why == 2) resp = '"engine_1" : "otrascertificaciones"'
    else if(why == 3) resp = '"engine_1" : "regulacionbancaria"'
    else if(why == 4) resp = '"engine_1" : "fallasdeseguridad"'
    else if(why == 5) resp = '"engine_1" : "monitoreardarkweb"'
    else if(why == 6) resp = '"engine_1" : "concientizar"'
    else if(why == 7) resp = '"engine_1" : "estrategia"'
    else if(why == 8) resp = '"engine_1" : "hackeo"'
    else if(why == 9) resp = '"engine_1" : "otra"'
  }
  else if (token == "dlsmcryddjjh"){ //Apolo
    if(why == 1) resp = '"engine_2" : "apoloiso27001"'
    else if(why == 2) resp = '"engine_2" : "apolofallasdeseguridad"'
    else if(why == 3) resp = '"engine_2" : "apolodarkweb"'
    else if(why == 4) resp = '"engine_2" : "apolophishing"'
    else if(why == 5) resp = '"engine_2" : "apoloconocer"'
    else if(why == 6) resp = '"engine_2" : "apoloterceros"'
    else if(why == 7) resp = '"engine_2" : "apolootra"'
  }
  else if (token == "ngqktdvphfdw"){ //CISO as a Service
    if(why == 1) resp = '"engine_3" : "cisocertificacion"'
    else if(why == 2) resp = '"engine_3" : "cisofintech"'
    else if(why == 3) resp = '"engine_3" : "cisomantener"'
    else if(why == 4) resp = '"engine_3" : "cisophishing"'
    else if(why == 5) resp = '"engine_3" : "cisoseguridad"'
    else if(why == 6) resp = '"engine_3" : "cisoterceros"'
    else if(why == 7) resp = '"engine_3" : "cisomasseguro"'
    else if(why == 8) resp = '"engine_3" : "cisootra"'
  }
  else if (token == "yabj1v3s8uxj"){ //Pentesting
    if(why == 1) resp = '"engine_4" : "pentestingtercero"'
    else if(why == 2) resp = '"engine_4" : "pentestingvulnerabilidad"'
    else if(why == 3) resp = '"engine_4" : "pentestingusuarios"'
    else if(why == 4) resp = '"engine_4" : "pentestingotra"'
  }
  else if (token == "unixxay9ggle"){ //An????lisis de Vulnerabilidades
    if(why == 1) resp = '"engine_5" : "avtercero"'
    else if(why == 2) resp = '"engine_5" : "avdeteccion"'
    else if(why == 3) resp = '"engine_5" : "avproteger"'
    else if(why == 4) resp = '"engine_5" : "avotra"'
  }
  else if (token == "jqlkod4hl0sr"){ //Ciberinteligencia
    if(why == 1) resp = '"engine_5" : "brechasdedatos"'
    else if(why == 2) resp = '"engine_5" : "botnets"'
    else if(why == 3) resp = '"engine_5" : "mencionesdarkweb"'
    else if(why == 4) resp = '"engine_5" : "ciberinteligenciaotra"'
  }

  res.send(resp)

})




app.post('/calendar/freebusy', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  console.log("body",req.body)
  console.log("body.calendars",req.body.calendars.split(","))


  if(req.body.provider=="Outlook"){
        // PARSE BODY 

            let json={        
                "Schedules": req.body.calendars.split(",") ,
                "StartTime": {
                    "dateTime": req.body.timeMin,
                    "timeZone": "UTC"
                },
                "EndTime": {
                    "dateTime": req.body.timeMax,
                    "timeZone": "UTC"
                },
                "availabilityViewInterval": "30"
              } 

        // EXECUTE ENDPOINT

          try{

                let outlookData= await axios({
                    method: 'post',
                    url: 'https://graph.microsoft.com/v1.0/me/calendar/getSchedule',
                    headers: { 
                      'Content-Type': 'application/json', 
                      'Cookie': 'fpc=AoMnHEdDJI5HsOlA87wtr0ITIShSAgAAAJ_jM9sOAAAAFIFrmwIAAABg5DPbDgAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd',
                      "Authorization":"Bearer "+req.body.token
                    },
                    data:json
                  })

                //console.log("response: ",outlookData.data)

                //PARSE DATA TO BUBBBLE FORMAT
                    let responseJson={
                      success:true,
                      freebusy:[]
                    }

                //LOOP THE OUTLOOK FREEBUSY RESPONSE

                    console.log("LOOP THE SCHEDULEITEMS")
                    for (let index = 0; index < outlookData.data.value.length; index++) {
                      const calendar = outlookData.data.value[index];

                      console.log("calendar:",calendar)
                      if(!calendar.error){
                        for (let h = 0; h < calendar.scheduleItems.length; h++) {
                          let scheduleItem= calendar.scheduleItems[h];
                          console.log("scheduleItem: ",scheduleItem)

                          //2023-01-09T07:30:00.0000000
                          responseJson.freebusy.push({
                            start:scheduleItem.start.dateTime.replace(".0000000","Z"),
                            end:scheduleItem.end.dateTime.replace(".0000000","Z"),
                          })
                        }
                      }
                      
                    }
                    console.log("responseJson: ",responseJson)
                // SEND RESPONSE  
                  res.json(responseJson)

            }catch(e){
              console.log(e.response)
              res.json({error:true,message:e.message})
            }
    }else if(req.body.provider == "Google Calendar"){
        //PARSE BODY

            //PARSE CALENDARS
                let calendarsIdsArray=[];
                let calendarStringsArray=req.body.calendars.replace(" ","").split(',');
                //LOOP THE CALENDARS
                    calendarStringsArray.forEach(calendarString => {
                      calendarsIdsArray.push({"id":calendarString.trim()})
                    });
                console.log("parse calendars ok")
            // BUILD DATA TO POST
                var json = JSON.stringify({
                  "timeMin":req.body.timeMin,
                  "timeMax":req.body.timeMax,
                  "items":calendarsIdsArray,
                  "calendarExpansionMax":10,
                  "groupExpansionMax":10
                });
                console.log("BUILD DATA TO POST: ",json)


        //EXECUTE ENDPOINT
            try{

                let responseFreebusy= await axios({
                  method: 'post',
                  url: 'https://www.googleapis.com/calendar/v3/freeBusy',
                  headers: { 
                    'Content-Type': 'application/json', 
                    "Authorization":"Bearer "+req.body.token
                  },
                  data:json
                })

                console.log("responseFreebusy: ",responseFreebusy)
                //PARSE DATA TO BUBBBLE FORMAT
                    let responseJson={
                      success:true,
                      freebusy:[]
                    }
                // PARSE RESPONSE
                    let arrayFreeBusy=[]
                    if(responseFreebusy && responseFreebusy.data && responseFreebusy.data.calendars){
                      let keys=Object.keys(responseFreebusy.data.calendars);
                      for (var i = 0; i < keys.length; i++) {
                        let arrayFreeBusyFromIteration=responseFreebusy.data.calendars[keys[i]].busy;
                            arrayFreeBusyFromIteration.forEach(jsonStartEnd => {
                              responseJson.freebusy.push(jsonStartEnd)
                            });
                      }
                    }
                 // SEND RESPONSE  
                     res.json(responseJson)
            }catch(e){
              console.log(e.message)
              res.json({error:true,provider:"Google Calendar",message:e.message})
            }

    }

});


/** OUTLOOK */

// AN ENDPOINT TO EXCHANGE THE CODE FOR THE OUTLOOK TOKEN
/*app.get('/token', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');


  try{
    let outlookData= await axios({
        method: 'post',
        url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'fpc=AoMnHEdDJI5HsOlA87wtr0ITIShSAgAAAJ_jM9sOAAAAFIFrmwIAAABg5DPbDgAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
        },
        data:qs.stringify({
          'code': req.query.code,
          'client_id': '2c08c84c-c6d5-4e44-bc83-ffd97cf94a14',
          'client_secret': 'aex8Q~xq4BR3la_iGIqU1rxnB30cyQMHT9bBZcKo',
          'redirect_uri': 'https://app.meetzy.io/version-test/portal/links',
          'grant_type': 'authorization_code' 
        })
      })

        console.log("response: ",outlookData.data)
        res.json(outlookData.data)
    }catch(e){
      console.log(e)
      res.json({error:true,message:e.message})
    }

});*/

// AN ENDPOINT TO 
// -EXCHANGE THE CODE FOR THE OUTLOOK TOKEN
// OR
// -REFRESH AN ACCESS TOKEN FROM A REFRESH TOKEN
app.post('/outlook/token', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  console.log("body",req.body)

  //DETECT GRANT TYPE
      let querystring;
      if(req.body.grant_type=="authorization_code"){
        querystring=qs.stringify({
          'code': req.body.code,
          'client_id': 'adad837f-5e2d-4e98-8c61-52875394144f', //OLD '2c08c84c-c6d5-4e44-bc83-ffd97cf94a14',
          'client_secret': '6eb8Q~jAoOATb0yKrB0PWcUS4thYgd-URBo25czv', //OLD 'aex8Q~xq4BR3la_iGIqU1rxnB30cyQMHT9bBZcKo',
          'redirect_uri': 'https://app.meetzy.io/portal/links',
          'grant_type': 'authorization_code' 
        })
      }
      else if(req.body.grant_type=="refresh_token")
      {
        querystring=qs.stringify({
          'client_id': 'adad837f-5e2d-4e98-8c61-52875394144f', //OLD '2c08c84c-c6d5-4e44-bc83-ffd97cf94a14',
          'client_secret': '6eb8Q~jAoOATb0yKrB0PWcUS4thYgd-URBo25czv', //OLD 'aex8Q~xq4BR3la_iGIqU1rxnB30cyQMHT9bBZcKo',
          'refresh_token': req.body.refresh_token,
          'grant_type': 'refresh_token' 
        })
      }

  // EXECUTE ENDPOINT

    try{

          let outlookData= await axios({
              method: 'post',
              url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
              headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Cookie': 'fpc=AoMnHEdDJI5HsOlA87wtr0ITIShSAgAAAJ_jM9sOAAAAFIFrmwIAAABg5DPbDgAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
              },
              data:querystring
            })

          //console.log("response: ",outlookData.data)
          res.json(outlookData.data)
      }catch(e){
        console.log(e)
        res.json({error:true,message:e.message})
      }

});




/* END OUTLOOK*/ 


////////////////////////////////////////////////////////////////////////////////////////////////
// OPEN AI - GPT-3 - ENDPOINT
app.get('/ai', async (req, res) => {
  console.log("query: ",req.query)

  let email=req.query.email

  if(email){

    //ENRICHEMNT WITH CLEARBIT BASED ON EMAIL

      //THIS A REAL TEMPLATE THAT APOLLO RESPONSE
      // SEE THE DOC HERE https://apolloio.github.io/apollo-api-docs/?shell#enrichment-api
      let enrichment=await enrich.lead({
        "email": email,
        "domain": extractDomain(email)
      })

      
    //ENRICH WITH IP DATA
      
      /*

      curl ipinfo.io/213.98.255.186?token=029b39acdb71ff

      RESPONSE
      {
      "ip": "213.98.255.186",
      "hostname": "186.red-213-98-255.staticip.rima-tde.net",
      "city": "Madrid",
      "region": "Madrid",
      "country": "ES",
      "loc": "40.4165,-3.7026",
      "org": "AS3352 TELEFONICA DE ESPANA S.A.U.",
      "postal": "28001",
      "timezone": "Europe/Madrid"
      }
      
      */

    //ENRICH WITH BUYING INTENT DATA (by clearbit)  

        //TO-DO


    //READ CRITERIA FROM BUBBLE by CUSTOMER

      /*let templateCriteria=`
            1 - Es un lead que usa un CRM entre los siguientes: Hubspot, Salesforce, Pipedrive
            2 - Es un lead que tiene mucho tr??fico inbound: al menos 10.000 visitas al mes en su p??gina web
            3 - El n??mero de comerciales que tiene su organizaci??n es superior a 10
            4 - El lead es un founder
            5 - Vive en Espa??a
      `*/
      let templateCriteria=`
            1 - The organization of the lead use one of this CRM: Hubspot, Salesforce, Pipedrive
            2 - The organization of the lead has more than 10 people in the sales department
            3 - The lead works as founder
            4 - The lead live in Spain
      `
    //CHECK LEAD DATA & CRITERIA WITH OPENAI

        //SETUP OPENAPI
          const configuration = new Configuration({
            organization:process.env.OPENAI_ORGANIZATION,
            apiKey: process.env.OPENAI_API_KEY,
          });

        //INIT OPENAI
          const openai = new OpenAIApi(configuration);
          let completion
          try{
            //EXECUTE OPENAI
              completion = await openai.createCompletion({
                model: "text-davinci-002",
                temperature:0.7,
                prompt: `Quiero cualificar leads segun estos criterios:
                
                `+templateCriteria+`

                Entonces, pongamos un ejemplo en el que el lead que ha llegado tiene estas caracter??sticas: 
                
                `+enrichment+`
                
                ??Se puede considerar un lead cualificado?`,
              });

            //SHOW RESULT
              console.log("res: ",completion.data)

          }catch(e){
            console.log("ERROR OPENAI: ",e.message)
          }

      //check is qualified
        let isQualified=completion.data.choices[0].text.includes("true")
      
        if(isQualified){

          //GET PERFECT AGENT AND READ SLOT DATA
              //TO-DO

          //FORMAT BUSY SLOTS DATA
              let templateBusySlots=[
                    {
                      start:new Date(),
                      end:new Date()+1
                    },
                    {
                      start:new Date()+2,
                      end:new Date()+3
                    },
                    {
                      start:new Date()+3,
                      end:new Date()+4
                    }
                  ]
          //RESPONSE true
              res.json({
                email:email,
                qualified:true, 
                busySlots:templateBusySlots
              })
        }
        else{ //NON QUALIFIED

          //RESPONSE false
              res.json({
                email:email,
                qualified:false
              })
        }
  }
  else{
    res.json({
      error:true,
      message:"no email received"
    })
  }
  

    

});
////////////////////////////////////////////////////////////////////////////////////////////


app.get('/fields', async (req, res) => {
  console.log('req params', req.params);
  console.log('req query', req.query);
  console.log('context: ', req.context);

  /*
  req.query{
    crm_form_id
    bubble_form_id
    access_token
    owner_id
  } 
  
  */

  try {
  
      //GET CRM FIELDS & OPTIONS BY FORM
      let form = await hubspot.fetch(
        'forms',
        req.query.crm_form_id,
        req.query.access_token,
      );

      //POST FIELDS
      let arrayFieldsIds = [];
      for (let h = 0; h < form.fieldGroups.length; h++) {
        let fieldGroup = form.fieldGroups[h];
        let field = fieldGroup.fields[0];

        //SAVE FIELD
        console.log('field: ', field.name);
        let fieldResponse = await bubble.post('field', {
          name: field.name,
          label: field.label,
          description: field.description,
          required: field.required,
          hidden: field.hidden,
          type: field.fieldType,
          form: req.query.bubble_form_id,
          owner: req.query.owner_id,
        });
        console.log('fieldResponse: ', fieldResponse);
        arrayFieldsIds.push(fieldResponse.id);

        //SAVE OPTIONS
        let arrayOptionsIds = [];
        if (field.options && field.options.length > 0) {
          //POST ALL OPTIONS IN BUBBLE AND SAVE THE IDS
          for (let i = 0; i < field.options.length; i++) {
            let option = field.options[i];

            let optionResponse = await bubble.post('option', {
              label: option.label ? option.label : '',
              value: option.value ? option.value : '',
              'display order': option.displayOrder
                ? option.displayOrder
                : 0,
              description: option.description ? option.description : '',
              field: fieldResponse.id,
              owner: req.query.owner_id,
            });
            console.log('optionResponse: ', optionResponse);
            arrayOptionsIds.push(optionResponse.id);
          }

          //PATCH FIELD WITH THE OPTIONS IDS
          console.log('arrayOptionsIds: ', arrayOptionsIds);
          await bubble.patch('field', fieldResponse.id, {
            options: arrayOptionsIds,
          });
        }
      }

      //PATCH FORM WITH THE FIELDS IDS
      console.log('arrayFieldsIds: ', arrayFieldsIds);
      await bubble.patch('form', req.query.bubble_form_id, {
        fields: arrayFieldsIds,
      });

      res.json({ success: true });

} catch (e) { 
  res.json({ error: true });

}
});


app.listen(process.env.PORT, () =>
  console.log(`Meetzy ready. port: ${process.env.PORT}!`),
);


// Export the Express API
module.exports = app;
