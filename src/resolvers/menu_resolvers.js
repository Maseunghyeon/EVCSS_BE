const { connectToOracleDB } = require('../dbConfig/oracle')
/**
 *
 *
 *
[[요청 할때 이런식으로 해야함]]

Argument가 없을 경우
{
  "query": "query { getMenusAll { MODULE_ID, NAME } }"
}

Argument가 있을 경우
{
  "query": "query($ID: [String]!) { getMenusByID(ID: $ID) { MODULE_ID, NAME } }",
  "variables": {
    "ID": ["6200"]
  }
}

 *
 *
 */


const resolvers = {
    Query: {
        getMenusAll: async () => {
            try{
                const connection = await connectToOracleDB();
                const result = await connection.execute("SELECT * FROM MENU_INFO ");
                await connection.close() //연결 해제

                const users = result.rows.map(row => {
                    const user = {};
                    for (let i = 0; i < result.metaData.length; i++) {
                          const columnName = result.metaData[i].name;
                          const columnValue = row[i];
                          user[columnName] = columnValue;
                        }
                        return user;
                      });

                //가져온 데이터 반환
                return users
            }catch(err){
                console.error('😢 OracleDB Error ',err)
            }
        },
        getMenusByID: async(_,{ID}) =>{
            try{
                //id 로 조회
                const connection = await connectToOracleDB();
                let result = ''
                if(ID.length <= 1){
                    // result = await connection.execute("SELECT MODULE_ID ,NAME FROM MENU_INFO WHERE ID IN ( :ID )",{ID})
                    result = await connection.execute(`SELECT MODULE_ID ,NAME FROM MENU_INFO WHERE ID IN ( ${ID[0]} )`)
                }else{
                    let argId = ''
                    for await(const [idx,i] of ID.entries()){
                        if(idx === ID.length-1){
                            argId+= `'${i}'`
                            break
                        }
                        argId+= `'${i}',`
                    }
                    console.log(argId)
                    result = await connection.execute(`SELECT MODULE_ID ,NAME FROM MENU_INFO WHERE ID IN ( ${argId} )`)
                    console.log(result)
                }


                // const result = await connection.execute("SELECT ID ,NAME FROM USER_INFO WHERE ID IN ( :ID )",{ID})
                await connection.close()
                console.log(result)
                if (!result.rows || result.rows.length === 0) {
                    // 조회된 데이터가 없는 경우 null 값 반환
                    return null;
                }

                const users = result.rows.map(row => {
                    const user = {};
                    for (let i = 0; i < result.metaData.length; i++) {
                        const columnName = result.metaData[i].name;
                        const columnValue = row[i];
                        user[columnName] = columnValue;
                    }
                    return user;
                });
                //가져온 데이터 반환
                return users
            }catch(err){
                console.error('😢 OracleDB Error ',err)
            }
        }
    },
    // Mutation:{

    // }
};

module.exports = resolvers