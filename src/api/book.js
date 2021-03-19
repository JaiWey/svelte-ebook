import axios from "axios";
import { setLocalForage } from "../utils/localForage";
import { getCategoryName } from "../utils/constants";

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

export function download(item, onSuccess, onFailed, onError, onProgress) {
  axios
    .create({
      baseURL: "APP_EPUB_URL",
      method: "get",
      responseType: "blob",
      timeout: 180 * 1000,
      onDownloadProgress: (progressEvent) => {
        if (onProgress) onProgress(progressEvent);
      },
    })
    .get(`${item.data.categoryText}/${item.data.fileName}.epub`)
    .then((res) => {
      const blob = new Blob([res.data]);
      setLocalForage(
        item.data.fileName,
        blob,
        () => {
          if (onSuccess) onSuccess(item);
        },
        (err) => {
          if (onFailed) onFailed(err);
        }
      );
    })
    .catch((err) => {
      if (onError) onError(err);
    });
}
