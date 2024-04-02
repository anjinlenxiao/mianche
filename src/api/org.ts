import delay from "../utils/delay";
interface Org {
  label: string;
  code: string;
  parentCode: any;
}
const getOrgData = (): Org[] => {
  // const count = Math.floor(Math.random() * 20)

  // return Array(count)
  //   .fill(0)
  //   .map(() => {
  //     return {
  //       id: Math.random() + '',
  //       label: (Math.random() + 1).toString(36).substring(7),
  //     }
  //   })
  return [
    //数据类型格式
    {
      code: "0",
      label: "厦门嗨行旅游",
      parentCode: null,
    },
    {
      code: "12",
      label: "技术部",
      parentCode: "0",
    },
    {
      code: "1201",
      label: "技术一组",
      parentCode: "12",
    },
    {
      code: "13",
      label: "未分配部门",
      parentCode: "0",
    },
    {
      code: "14",
      label: "宣传部",
      parentCode: "0",
    },
    {
      code: "1412",
      label: "宣传部一组",
      parentCode: "14",
    },
  ];
};

const query = (parentId: string = "0") => {
  return delay(getOrgData());
};

const orgApi = {
  query,
};

export default orgApi;
