const fetch = require("node-fetch");

const baseUrl = `http://api.mcfsystem.hostkulo.com`;
const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYjRhOTdiOTdmZGI2OGM3NDI0OTExZWQ3NzE3ZGE0ZDJhZjY1MTcxZDQyNzAyZmQzNzk0NGI1ZThiMDY5MDFlNGJlMDY3NGJlYmJmZDAzNDIiLCJpYXQiOjE1ODQ0NTEyMzAsIm5iZiI6MTU4NDQ1MTIzMCwiZXhwIjoxNjE1OTg3MjMwLCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.FrALedUuVsDa7Ev5z97zawNwl1dAymhDYuiaplbU6n1sNIjhIUJikwYRZ3msYfh0X0s7Z_1Unauz76kmWKNe8pBVmnFDk9r82UUafnylYDbfycNm-V7dqflcvlWBVWsrndS3O_vPFJq5DD0HhFPrSR3Ap4dKZkJFO97U1WmRj3nMTjJd4fD9Rcqu5wrREDofO5U6yHqxA-JcodDJqBuzEmFyAmSG8B2dqQ9Gj81SdE7gtU9oMScQ_g4pgozXSekI-Obyqx7TWavorMUCp03TW4aw5qckoCSAAFmv-kVy4hU8zG-tCzC8OTC5ZydVvY3K3H_gCkQLbNemP7iF4vY4MbfeGzZJU6HlPgksGmgrUq_U4t31wITgCVFuUx3tgmRznoFHCN3LiaJkXeZDIrDPlLTQXJIpWUtsiaxae4pSOTUJFx91brVGkLAj2L6XtJPIXBJLlvQelP92KCq-2myybMbwmgdjlO_WPC36vQXDslCk_J1-7goZEbfpUZoBvgHmv6cYcNhoCohUK0B0uHtikdjIrqEnHN_4-aagKqwf8DWE6OF9WZ9JnLiz8c720RnAVafzNJ_uevoyt2LdTc4yiIm_buiptJRpO8zgIqpi2OcqAEQ_po48DCST8PfdnCUXLqlSvlCW36AGvTj9ZXUbc3PAFJOKY9x6DUV5iRZAmBM";

/**
 *
 * @param {string} endpoint endpoint API
 * @param {void} callback
 */
async function get(endpoint, callback) {
  return await fetch(`${baseUrl}/api/${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
  })
    .then((res) => res.json())
    .then((res) => (callback ? callback(res) : res))
    .catch((error) => console.log(error));
}

/**
 *
 * @param {string} endpoint endpoint API
 * @param {*} body payload
 * @param {void} callback
 */
async function post(endpoint, body, callback) {
  return await fetch(`${baseUrl}/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },

    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => (callback ? callback(res) : res))
    .catch((error) => console.log(error));
}

/**
 *
 * @param {string} endpoint endpoint API
 * @param {*} body payload
 */
async function put(endpoint, body, callback) {
  return await fetch(`${baseUrl}/api/${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => (callback ? callback(res) : res))
    .catch((error) => console.log(error));
}

module.exports = {
  get: get,
  post: post,
  put: put,
  token: token,
};
