import { StyleSheet, View ,  Pressable, Text, ScrollView} from "react-native"
import Constants from 'expo-constants'
import { Link } from "react-router-native"

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    paddingLeft: 10,
    backgroundColor: 'rgba(0,0, 0, .8)',
    display: 'flex',
    flexDirection: 'row',
    
  },
  button: {
    padding: 6,

  },
  buttonText: {
    color: 'white'
  }
  
})

export const AppBar = ()=> {
  return (<View style={styles.container}>
    <ScrollView horizontal>
      <Pressable style={styles.button}>
        <Link to='/'>
          <Text style={styles.buttonText}>Repositories</Text>
        </Link>
      </Pressable>
      <Pressable style={styles.button}>
        <Link to='/sign-in'>
          <Text style={styles.buttonText}>Sign in</Text>
        </Link>
      
      </Pressable>

    </ScrollView>
    

  </View>)
  
}