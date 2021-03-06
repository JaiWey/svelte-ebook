import axios from "axios";

export function home() {
  return axios({
    method: "get",
    url: "APP_URL/book/home2",
  });
}

export function list() {
  return axios({
    method: "get",
    url: "APP_URL/book/list",
  });
}

export function detail(book) {
  return axios({
    method: "get",
    url: "APP_URL/book/detail",
    params: {
      fileName: book.fileName,
    },
  });
}
