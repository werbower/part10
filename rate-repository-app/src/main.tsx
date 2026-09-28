import { NativeRouter } from "react-router-native"
import App from "./App"
import { StatusBar } from 'expo-status-bar'
import { ApolloProvider } from "@apollo/client/react"
import { apolloClient } from "./apollo/apollo.service"



export const Main = ()=> {
  return(<>
    <StatusBar style='light' />
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </NativeRouter>
    
  </>)
}