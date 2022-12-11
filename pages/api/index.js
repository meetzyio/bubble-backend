import 'dotenv/config';
import cors from 'cors';
import express from 'express';
const { v4 } = require('uuid');

import bubble from './endpoints/bubble';
import hubspot from './endpoints/hubspot';

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

app.get('/', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader(
    'Cache-Control',
    's-max-age=1, stale-while-revalidate',
  );
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

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
  } catch (e) {}
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
});

app.listen(process.env.PORT, () =>
  console.log(`Meetzy ready. port: ${process.env.PORT}!`),
);


module.exports = app;
