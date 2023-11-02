import axios from "axios";

export const fetchCodeBlocks = () => {
  return new Promise((resolve, reject) => {
    axios({
      url: "http://localhost:4000/codeblock/all",
      method: "GET",
      withCredentials: true,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchCodeBlockById = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:4000/codeblock", {
        params: {
          targetId: id,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        reject(error);
      });
  });
};

export const saveCode = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .put("http://localhost:4000/codeblock/update", data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
