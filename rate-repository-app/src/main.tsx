import { NativeRouter } from "react-router-native"
import App from "./App"
import { StatusBar } from 'expo-status-bar'



export const Main = ()=> {
  return(<>
    <StatusBar style='light' />
    <NativeRouter>
      <App />
    </NativeRouter>
    
  </>)
}