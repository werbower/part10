import { NativeRouter } from "react-router-native"
import App from "./App"
import { StatusBar } from 'expo-status-bar'
import { createApolloClient } from "./apollo/apollo.service"
import { ApolloProvider } from "@apollo/client/react"

const apolloClient = createApolloClient()

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