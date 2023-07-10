const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const cors = require('cors')
const user_schema = require('./src/entity/user')
const menu_schema = require('./src/entity/menu');
const user_resolvers = require('./src/resolvers/user_resolvers');
const menu_resolvers = require('./src/resolvers/menu_resolvers');

// Express 애플리케이션 생성
const app = express();
app.use(cors())

// GraphQL 스키마 정의
const typeDefs = [user_schema,menu_schema]

const resolvers = [user_resolvers,menu_resolvers]


// ApolloServer 인스턴스 생성
const server = new ApolloServer({ typeDefs, resolvers });

// 서버 시작
const PORT = 7777;

// async 함수로 감싸주어 await 키워드를 사용할 수 있도록 함
const startServer = async () => {
    await server.start();
    server.applyMiddleware({ app });
    app.listen(PORT, () => {
        console.log(`😒 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
};

startServer();
