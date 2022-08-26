import request from "./fetch";

export function getList() {
  return request({
    url: "/list",
    method: "GET",
  });
}
