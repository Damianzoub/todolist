import { Client, Account } from "./static/js/appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('684b4fd50018d31a39b6');

const account = new Account(client)

export {account,client}