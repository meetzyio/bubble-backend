import axios from "../../node_modules/axios/dist/node/axios.cjs";

const bubble_url = "https://meetzyv2.bubbleapps.io/version-test/api/1.1/obj/";

async function fetch(object, id) {
  try {
    return (
      await axios({
        method: "get",
        url: bubble_url + object + "/" + id,
        headers: {
          Authorization: "Bearer " + process.env.bubble_api_key
        }
      })
    ).data;
  } catch (e) {
    return false;
  }
}

async function get(object, constraints) {
  try {
    return (
      await axios({
        method: "get",
        url: bubble_url + object,
        headers: {
          Authorization: "Bearer " + process.env.bubble_api_key
        }
      })
    ).data;
  } catch (e) {
    console.log("ERROR: ", e);
    return false;
  }
}

async function post(object, data) {
  try {
    return (
      await axios({
        method: "post",
        url: bubble_url + object,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.bubble_api_key
        },
        data: JSON.stringify(data)
      })
    ).data;
  } catch (e) {
    console.log("ERROR: ", e);
    return false;
  }
}

async function patch(object, id, data) {
  try {
    return (
      await axios({
        method: "patch",
        url: bubble_url + object + "/" + id,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.bubble_api_key
        },
        data: JSON.stringify(data)
      })
    ).data;
  } catch (e) {
    console.log("ERROR: ", e);
    return false;
  }
}

module.exports = {
  get,
  fetch,
  post,
  patch
};
