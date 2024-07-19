import { Account, Client, ID, Databases, Avatars, Query} from 'react-native-appwrite';

export const config = {
   endpoint: 'https://cloud.appwrite.io/v1',
   platform: 'com.aora',
   projectId: '669a4f18001911e95c0e',
   databaseId: '669a50ee000414f7c4d9',
   userCollectionId: '669a5121003db03e3f2d',
   videoCollectionId: '669a5140002d9a1317cb',
   storageId: '669a527500396b79adbf'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountID: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser
     } catch (error) {
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const user = await account.get()
        if(!user) throw Error;

        const currentUser = await databases.getDocument(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}
