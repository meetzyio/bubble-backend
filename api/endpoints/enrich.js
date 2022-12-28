import axios from "../../node_modules/axios/dist/node/axios.cjs";

/* JOIN PEOPLE AND COMPANY ENRICHMENT */
async function lead(data){
    
    let lead= await people(data)
    let organization= await company(data)

    lead.organization=organization

    return lead;

}



/* ***************************

APOLLO PEOPLE ENRICH

DATA:
{
      "first_name": "Jorge",
      "last_name": "Bodas",
      "organization_name": "Meetzy",
      "email": "jorge@meetzy.io",
      "domain": "Meetzy.io"
}

RESPONSE:
view https://apolloio.github.io/apollo-api-docs/?shell#people-enrichment

*/
async function people(data) {

    data.api_key=process.env.APOLLO_API_KEY

    try {
      return (
        await axios({
          method: "post",
          url: "https://api.apollo.io/v1/people/match",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify(data)
        })
      ).data.person;
    } catch (e) {
      console.log("ERROR: ", e);
      return false;
    }
}



/* ***************************

APOLLO COMPANY ENRICH

DATA:
{
      "first_name": "Jorge",
      "last_name": "Bodas",
      "organization_name": "Meetzy",
      "email": "jorge@meetzy.io",
      "domain": "Meetzy.io"
}

RESPONSE:
view https://apolloio.github.io/apollo-api-docs/?shell#organization-enrichment

*/
async function company(data) {

  data.api_key=process.env.APOLLO_API_KEY

  try {
    return (
      await axios({
        method: "post",
        url: "https://api.apollo.io/v1/organizations/enrich",
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(data)
      })
    ).data.organization;
  } catch (e) {
    console.log("ERROR: ", e);
    return false;
  }
}



module.exports = {
    lead,
    people,
    company
};