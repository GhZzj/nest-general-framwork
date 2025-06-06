
export default ()=>({
  typeormDatabases:[
    {
      tenant_id: "1", //租户id
      type: "mysql", //数据库类型
      host: "localhost", //数据库地址
      port: 3306, //数据库端口
      username: "root", //数据库用户名
      password: "123456", //数据库密码
      database:"testdb", //数据库
    },{
      tenant_id: "2", //租户id
      type: "mysql", //数据库类型
      host: "localhost", //数据库地址
      port: 3307, //数据库端口
      username: "root", //数据库用户名
      password: "123456", //数据库密码
      database:"testdb",//数据库
    },{
      tenant_id: "3", //租户id
      type: "postgres", //数据库类型
      host: "localhost", //数据库地址
      port: 5432, //数据库端口
      username: "root", //数据库用户名
      password: "123456", //数据库密码
      database:"testdb",//数据库
    }
  ]
})