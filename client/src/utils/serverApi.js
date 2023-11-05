import axios from "axios";

export const fetchCodeBlocks = () => {
  return new Promise((resolve, reject) => {
    axios({
      url: "/codeblock/all", // production
      // url: "http://localhost:4000/codeblock/all", // local dev
      method: "GET",
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
        reject(err);
      });
  });
};

export const fetchCodeBlockById = (id) => {
  return new Promise((resolve, reject) => {
    axios
      // production
      .get("/codeblock/all", {
        // .get("http://localhost:4000/codeblock", { // local dev
        params: {
          targetId: id,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
        reject(error);
      });
  });
};

export const saveCode = (data) => {
  return new Promise((resolve, reject) => {
    axios
      // .put("http://localhost:4000/codeblock/update", data) // local dev
      .put("/codeblock/update", data) // production
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
