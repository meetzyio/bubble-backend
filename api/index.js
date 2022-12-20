import 'dotenv/config';
import cors from 'cors';
import qs from 'qs';
import express from 'express';
const { v4 } = require('uuid');
import bubble from './endpoints/bubble';
import hubspot from './endpoints/hubspot';
import axios from 'axios';
const { Configuration, OpenAIApi } = require("openai");


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

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Cache-Control',
    's-max-age=1, stale-while-revalidate',
  );
  res.json({success:true})
});


//generate a simple funcion



app.get('/token', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  console.log("code: ",req.query.code)
  console.log("data: ",qs.stringify({
    'code': req.query.code,
    'client_id': '2c08c84c-c6d5-4e44-bc83-ffd97cf94a14',
    'client_secret': 'aex8Q~xq4BR3la_iGIqU1rxnB30cyQMHT9bBZcKo',
    'redirect_uri': 'https://app.meetzy.io/version-test/portal/links',
    'grant_type': 'authorization_code' 
  }))

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

});


////////////////////////////////////////////////////////////////////////////////////////////////
//OPEN AI - GPT-3 - ENDPOINT



app.get('/ai', async (req, res) => {

  //ENRICHEMNT WITH CLEARBIT BASED ON EMAIL

    //THIS A REAL TEMPLATE THAT CLEARBIT RESPONSE
    // SEE THE DOC HERE https://dashboard.clearbit.com/docs?javascript#enrichment-api-person-api
    let templateEnrichment={
      "CRM":"Hubspot", //we could extract this info from the teck stack data of the company provided by clearbit 
      "Sales Team Size":50, // we could extract this data from a meetzy form or from linkedin api /company endpoint
      "Inbound traffic":150000, // we could extract this data from a meetzy form or semrush api
      "id": "d54c54ad-40be-4305-8a34-0ab44710b90d",
      "name": {
        "fullName": "Alex MacCaw", //fullname
        "givenName": "Alex",
        "familyName": "MacCaw"
      },
      "email": "alex@alexmaccaw.com", //email
      "location": "San Francisco, CA, US",
      "timeZone": "America/Los_Angeles", //timezone
      "utcOffset": -8, //offset
      "geo": {
        "city": "San Francisco",
        "state": "California",
        "stateCode": "CA",
        "country": "United States", //country
        "countryCode": "US", //country code
        "lat": 37.7749295,
        "lng": -122.4194155
      },
      "bio": "O'Reilly author, software engineer & traveller. Founder of https://clearbit.com",
      "site": "http://alexmaccaw.com",
      "avatar": "https://d1ts43dypk8bqh.cloudfront.net/v1/avatars/d54c54ad-40be-4305-8a34-0ab44710b90d",
      "employment": {
        "domain": "clearbit.com", //domain
        "name": "Clearbit", //company
        "title": "Co-founder, CEO", //job position
        "role": "leadership", //role
        "subRole": "ceo", 
        "seniority": "executive" //seniority
      },
      "facebook": {
        "handle": "amaccaw"
      },
      "github": {
        "handle": "maccman",
        "avatar": "https://avatars.githubusercontent.com/u/2142?v=2",
        "company": "Clearbit",
        "blog": "http://alexmaccaw.com",
        "followers": 2932,
        "following": 94
      },
      "twitter": {
        "handle": "maccaw",
        "id": "2006261",
        "bio": "O'Reilly author, software engineer & traveller. Founder of https://clearbit.com",
        "followers": 15248,
        "following": 1711,
        "location": "San Francisco",
        "site": "http://alexmaccaw.com",
        "avatar": "https://pbs.twimg.com/profile_images/1826201101/297606_10150904890650705_570400704_21211347_1883468370_n.jpeg"
      },
      "linkedin": {
        "handle": "pub/alex-maccaw/78/929/ab5"
      },
      "googleplus": {
        "handle": null
      },
      "gravatar": {
        "handle": "maccman",
        "urls": [
          {
            "value": "http://alexmaccaw.com",
            "title": "Personal Website"
          }
        ],
        "avatar": "http://2.gravatar.com/avatar/994909da96d3afaf4daaf54973914b64",
        "avatars": [
          {
            "url": "http://2.gravatar.com/avatar/994909da96d3afaf4daaf54973914b64",
            "type": "thumbnail"
          }
        ]
      },
      "fuzzy": false,
      "emailProvider": false,
      "indexedAt": "2016-11-07T00:00:00.000Z"
    }

  //ENRICH WITH BUYING INTENT DATA (by clearbit)  

      //TO-DO


  //READ CRITERIA FROM BUBBLE by CUSTOMER

    let templateCriteria=`
          1 - Es un lead que usa un CRM entre los siguientes: Hubspot, Salesforce, Pipedrive
          2 - Es un lead que tiene mucho tráfico inbound: al menos 10.000 visitas al mes en su página web
          3 - El número de comerciales que tiene su empresa es superior a 10
          4 - El lead es un software engineer
          5 - Vive en Estados Unidos
    `
  //CHECK LEAD DATA & CRITERIA WITH OPENAI

      //SETUP OPENAPI
        const configuration = new Configuration({
          organization:process.env.OPENAI_ORGANIZATION,
          apiKey: process.env.OPENAI_API_KEY,
        });

      //INIT OPENAI
        const openai = new OpenAIApi(configuration);

      //EXECUTE OPENAI
        const completion = await openai.createCompletion({
          model: "text-davinci-002",
          prompt: `Quiero cualificar leads segun estos criterios:
          
          `+templateCriteria+`

          Entonces, pongamos un ejemplo en el que el lead que ha llegado tiene estas características: 
          
          `+templateEnrichment+`
          
          ¿Se puede considerar un lead cualificado?`,
        });

  //SHOW RESULT
    console.log("res: ",completion.data)

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
              email:templateEnrichment.email,
              qualified:true, 
              busySlots:templateBusySlots
            })
      }
      else{ //NON QUALIFIED

        //RESPONSE false
            res.json({
              email:templateEnrichment.email,
              qualified:false
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
