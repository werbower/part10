import { InMemoryCache , ApolloClient, HttpLink } from "@apollo/client"
import { SetContextLink } from "@apollo/client/link/context"
import { Platform } from "react-native"
import { authStorage } from "../services/storage.service"

const urlVal = Platform.select({
  android: process.env.EXPO_PUBLIC_APOLLO_URI,
  ios: process.env.EXPO_PUBLIC_APOLLO_URI,
  default: process.env.EXPO_PUBLIC_APOLLO_URI_WEB,
})

const link = new HttpLink({
  uri: urlVal
})

export const createApolloClient = ()=> {
  const authLink = new SetContextLink(async ({headers})=> {
    try{
      const accessToken = await authStorage.getAccessToken()
      return {headers: {...headers, authorization: accessToken? `Bearer ${accessToken}`: ''}}
    } catch(e){
      console.log('error in authlink ', e)
      return {headers}
    }
  })

  return new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache()
  })
}

