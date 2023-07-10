const oracledb = require('oracledb');

// 연결에 필요한 설정
//TESTTEST
const connectionConfig = {
  user: 'user',
  password: 'password',
  connectString: 'connect info'
};

// OracleDB 연결 함수
async function connectToOracleDB() {
  try {
    // OracleDB에 연결
    const connection = await oracledb.getConnection(connectionConfig);
    console.log('OracleDB에 연결되었습니다.');

    // 연결 객체 반환
    return connection;
  } catch (err) {
    console.error('OracleDB 연결 오류:', err);
  }
}

module.exports = { connectToOracleDB };
