const fs = require("fs");
const data = require("./data.json").testsByDept;

const new_data = Object.keys(data).reduce((acc, dept) => {
  return acc.concat({
    department: dept.toLowerCase(),
    tests: Object.keys(data[dept]).reduce((acc, rank) => {
      return acc.concat({
        rank: rank.toLowerCase(),
        tests: Object.values(data[dept][rank]).reduce((acc, test) => {
          return acc.concat(test.toLowerCase());
        }, [])
      });
    }, [])
  });
}, []);

console.log(new_data);

fs.writeFileSync("query_data.json", JSON.stringify(new_data));
