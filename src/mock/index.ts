import Mock from "mockjs";

const data = Mock.mock({
  "list|20-60": [
    {
      id: "@increment(1)",
      title: "@ctitle",
      time2: "@date(yyyy-MM-dd hh:mm:ss)",
      image: "@image('50x50', '@color', '#FFF', 'js')",
      content: "@csentence(20)",
      add_time: "@date(yyyy-MM-dd hh:mm:ss)",
      name: "@cname()",
      idCard: "@id(18)",
      color: "@color",
      address: "@city(true)",
    },
  ],
});

// 删除
Mock.mock("/api/delete/news", "post", (options: any) => {
  let body = JSON.parse(options.body);
  const index = data.list.findIndex((item: { id: any }) => item.id === body.id);
  data.list.splice(index, 1);
  return {
    status: 200,
    message: "删除成功",
    list: data.list,
  };
});

// 添加
Mock.mock("/api/add/news", "post", (options: any) => {
  let body = JSON.parse(options.body);

  data.list.push(
    Mock.mock({
      id: "@increment(1)",
      title: body.title,
      content: body.content,
      add_time: "@date(yyyy-MM-dd hh:mm:ss)",
    })
  );

  return {
    status: 200,
    message: "添加成功",
    list: data.list,
  };
});
Mock.mock("/list", "get", () => {
  return { status: 200, list: data.list };
});

// 含有分页的数据列表,有需要接受的参数要使用正则匹配
// /api/get/news?pagenum=1&pagesize=10
Mock.mock(/\/api\/get\/news/, "get", (options: any) => {
  console.log(options);
  // 获取传递的参数pageindex
  const pagenum = getQuery(options.url, "pagenum");
  // 获取传递的参数pagesize
  const pagesize = getQuery(options.url, "pagesize");
  // 截取数据的起始位置
  const start = (pagenum - 1) * pagesize;
  // 截取数据的终点位置
  const end = pagenum * pagesize;
  // 计算总页数
  const totalPage = Math.ceil(data.list.length / pagesize);
  // 数据的起始位置：(pageindex-1)*pagesize  数据的结束位置：pageindex*pagesize
  const list = pagenum > totalPage ? [] : data.list.slice(start, end);

  return {
    status: 200,
    message: "获取新闻列表成功",
    list: list,
    total: data.list.length,
  };
});

const getQuery = (url: any, name: any) => {
  const index = url.indexOf("?");
  if (index !== -1) {
    const queryStrArr = url.substr(index + 1).split("&");
    for (var i = 0; i < queryStrArr.length; i++) {
      const itemArr = queryStrArr[i].split("=");
      console.log(itemArr);
      if (itemArr[0] === name) {
        return itemArr[1];
      }
    }
  }
  return null;
};
