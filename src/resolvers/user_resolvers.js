const { connectToOracleDB } = require('../dbConfig/oracle')


/**
 *
 *

POST 방식  BODY 에 RAWDATA로  (JSON 형식 )
{
  "query": "query($ID: [String]!) { getUsersByID(ID: $ID) { EMAIL, NAME } }",
  "variables" : {
      "ID": ["test"]
  }
}


 *
 *
 */
const resolvers = {
    Query: {
        getUsersAll: async () => {
            try{
                const connection = await connectToOracleDB();
                const result = await connection.execute("SELECT ID,NAME FROM USER_INFO");
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
                throw new Error(`😢 ${err}`); // 예외 던지기
            }
        },
        getUsersByID: async(_,{ID}) =>{
            try{
                //id 로 조회
                const connection = await connectToOracleDB();
                let result = ''
                if(ID.length <= 1){
                    var id = ID[0]
                    result = await connection.execute("SELECT ID ,NAME FROM USER_INFO WHERE ID IN ( :ID )",{id})
                }else{
                    let argId = ''
                    for await(const [idx,i] of ID.entries()){
                        if(idx === ID.length-1){
                            argId+= `'${i}'`
                            break
                        }
                        argId+= `'${i}',`
                    }
                    result = await connection.execute(`SELECT ID ,NAME FROM USER_INFO WHERE ID IN ( ${argId} )`)
                }


                // const result = await connection.execute("SELECT ID ,NAME FROM USER_INFO WHERE ID IN ( :ID )",{ID})
                await connection.close()
                console.log(result)
                if (!result.rows || result.rows.length === 0) {
                    // 조회된 데이터가 없는 경우 null 값 반환
                    // return null;
                    throw new Error('No Data'); // 에러 메시지 던지기
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
                throw new Error(`😢 ${err}`); // 예외 던지기
            }
        }
    },
};

module.exports = resolvers