const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Menu{
        MODULE_ID:ID!
        ID:ID!
        NAME:String
        PARENT_MENU_ID:String
        ICON:String
        PATH:String
        CRT_DT:String
        CRT_USR:String
        UPD_DT:String
        UPD_USR:String
    }

    type Query {
        getMenusAll: [Menu]
        getMenusByID(ID: [String]!): [Menu]
    }
    `;

module.exports = typeDefs