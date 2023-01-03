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

RESPONSE Example:
      
      {
    "organization": {
        "id": "54a1998674686949e7a2b400",
        "name": "Netflix",
        "website_url": "http://www.netflix.com",
        "blog_url": null,
        "angellist_url": null,
        "linkedin_url": "http://www.linkedin.com/company/netflix",
        "twitter_url": "https://twitter.com/netflix",
        "facebook_url": "https://facebook.com/netflix",
        "primary_phone": {
            "number": "+1 408-540-3700",
            "source": "Account"
        },
        "languages": [
            "English",
            "Japanese"
        ],
        "alexa_ranking": 43,
        "phone": "+1 408-540-3700",
        "linkedin_uid": "165158",
        "founded_year": 1997,
        "publicly_traded_symbol": "NFLX",
        "publicly_traded_exchange": "nasdaq",
        "logo_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/63abc3b1fd298100011d68bd/picture",
        "crunchbase_url": null,
        "primary_domain": "netflix.com",
        "sanitized_phone": "+14085403700",
        "persona_counts": {},
        "market_cap": "131.3B",
        "industry": "entertainment",
        "keywords": [
            "consumer electronics",
            "games",
            "entertainment",
            "consumer internet",
            "hardware",
            "information technology",
            "internet",
            "revolutionizing the way people watch tv shows & movies"
        ],
        "estimated_num_employees": 16000,
        "snippets_loaded": true,
        "industry_tag_id": "5567cdd37369643b80510000",
        "retail_location_count": 0,
        "raw_address": "100 Winchester Circle, Los Gatos, California, USA, 95032",
        "street_address": "100 Winchester Cir",
        "city": "Los Gatos",
        "state": "California",
        "postal_code": "95032-1815",
        "country": "United States",
        "owned_by_organization_id": null,
        "suborganizations": [
            {
                "id": "5fd1b8e84dd8fd00019867b3",
                "name": "Millarworld",
                "website_url": "http://www.usfreediving.org"
            }
        ],
        "num_suborganizations": 1,
        "seo_description": "Watch Netflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.",
        "short_description": "Netflix is the world's leading streaming entertainment service with 221 million paid memberships in over 190 countries enjoying TV series, documentaries, feature films and mobile games across a wide variety of genres and languages. Members can watch as much as they want, anytime, anywhere, on any Internet-connected screen. Members can play, pause and resume watching, all without commercials or commitments.",
        "annual_revenue_printed": "31.5B",
        "annual_revenue": 31472815000.0,
        "technology_names": [
            "Amazon AWS",
            "Amazon SES",
            "Apache",
            "Atlassian Cloud",
            "Citrix NetScaler",
            "Gmail",
            "Google Analytics",
            "Google Apps",
            "Google Play",
            "Google Tag Manager",
            "MailChimp SPF",
            "Media.net",
            "Microsoft Office 365",
            "Mobile Friendly",
            "Multilingual",
            "NSOne",
            "OneTrust",
            "Optimizely",
            "React Redux",
            "Route 53",
            "Typekit",
            "UltraDns",
            "VueJS",
            "Zapier"
        ],
        "current_technologies": [
            {
                "uid": "amazon_aws",
                "name": "Amazon AWS",
                "category": "Hosting"
            },
            {
                "uid": "amazon_ses",
                "name": "Amazon SES",
                "category": "Email Delivery"
            },
            {
                "uid": "apache",
                "name": "Apache",
                "category": "Load Balancers"
            },
            {
                "uid": "atlassian_cloud",
                "name": "Atlassian Cloud",
                "category": "CMS"
            },
            {
                "uid": "citrix_netscaler",
                "name": "Citrix NetScaler",
                "category": "Load Balancers"
            },
            {
                "uid": "gmail",
                "name": "Gmail",
                "category": "Email Providers"
            },
            {
                "uid": "google_analytics",
                "name": "Google Analytics",
                "category": "Analytics and Tracking"
            },
            {
                "uid": "google_apps",
                "name": "Google Apps",
                "category": "Other"
            },
            {
                "uid": "google_play",
                "name": "Google Play",
                "category": "Widgets"
            },
            {
                "uid": "google_tag_manager",
                "name": "Google Tag Manager",
                "category": "Tag Management"
            },
            {
                "uid": "mailchimp_spf",
                "name": "MailChimp SPF",
                "category": "Other"
            },
            {
                "uid": "media_net",
                "name": "Media.net",
                "category": "Publisher Advertising Tools"
            },
            {
                "uid": "office_365",
                "name": "Microsoft Office 365",
                "category": "Other"
            },
            {
                "uid": "mobile_friendly",
                "name": "Mobile Friendly",
                "category": "Other"
            },
            {
                "uid": "multilingual",
                "name": "Multilingual",
                "category": "Widgets"
            },
            {
                "uid": "nsone",
                "name": "NSOne",
                "category": "Domain Name Services"
            },
            {
                "uid": "onetrust",
                "name": "OneTrust",
                "category": "Widgets"
            },
            {
                "uid": "optimizely",
                "name": "Optimizely",
                "category": "Online Testing Platforms"
            },
            {
                "uid": "react_redux",
                "name": "React Redux",
                "category": "CSS and JavaScript Libraries"
            },
            {
                "uid": "route_53",
                "name": "Route 53",
                "category": "Domain Name Services"
            },
            {
                "uid": "typekit",
                "name": "Typekit",
                "category": "Fonts"
            },
            {
                "uid": "ultradns",
                "name": "UltraDns",
                "category": "Domain Name Services"
            },
            {
                "uid": "vue_js_library",
                "name": "VueJS",
                "category": "CSS and JavaScript Libraries"
            },
            {
                "uid": "zapier",
                "name": "Zapier",
                "category": "Widgets"
            }
        ],
        "departmental_head_count": {
            "engineering": 2521,
            "marketing": 659,
            "operations": 630,
            "legal": 578,
            "business_development": 466,
            "support": 374,
            "human_resources": 594,
            "finance": 381,
            "accounting": 241,
            "media_and_commmunication": 276,
            "sales": 71,
            "arts_and_design": 324,
            "product_management": 96,
            "information_technology": 107,
            "data_science": 246,
            "administrative": 130,
            "consulting": 85,
            "education": 52,
            "entrepreneurship": 10
        }
    }
}
      
      

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