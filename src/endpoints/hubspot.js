import axios from "axios";

const endpointsURLs = new Map();
endpointsURLs.set("forms", "https://api.hubapi.com/marketing/v3/forms/");

async function fetch(object, id, access_token) {
  console.log("url: ", endpointsURLs.get(object) + id);
  try {
    return (
      await axios({
        method: "get",
        url: endpointsURLs.get(object) + id,
        headers: {
          Authorization: "Bearer " + access_token
        }
      })
    ).data;
  } catch (e) {
    console.log("ERROR:endpoints:hubspot:fetch: ", e);
    return false;
  }
}

async function get(object, access_token) {
  try {
    return (
      await axios({
        method: "get",
        url: endpointsURLs.get(object),
        headers: {
          Authorization: "Bearer " + access_token
        }
      })
    ).data;
  } catch (e) {
    console.log("ERROR: ", e);
    return false;
  }
}

module.exports = {
  get,
  fetch
};
