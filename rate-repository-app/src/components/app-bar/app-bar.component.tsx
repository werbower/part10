import { StyleSheet, View ,  Pressable, Text, ScrollView} from "react-native"
import Constants from 'expo-constants'
import { Link, useNavigate } from "react-router-native"
import { getMe } from "../../apollo/queries"
import { useApolloClient, useQuery } from "@apollo/client/react"
import { authStorage } from "../../services/storage.service"

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
  const navigate = useNavigate()
  const { data } = useQuery(getMe)
  const client = useApolloClient()
  const dataVal = data as {me: {username: string, id: string}}

  if (dataVal?.me) {
    console.log('me data ', data)
  }

  const handleSignOut = async ()=> {
    await authStorage.removeAccessToken()
    setTimeout(()=> {
      client.resetStore()
      navigate('/')
    })
  }


  return (<View style={styles.container}>
    <ScrollView horizontal>
      <Pressable style={styles.button}>
        <Link to='/'>
          <Text style={styles.buttonText}>Repositories</Text>
        </Link>
      </Pressable>
      {!dataVal?.me && <Pressable style={styles.button}>
        <Link to='/sign-in'>
          <Text style={styles.buttonText}>Sign in</Text>
        </Link>
      </Pressable>}
      {!dataVal?.me && <Pressable style={styles.button}>
        <Link to='/sign-up'>
          <Text style={styles.buttonText}>Sign up</Text>
        </Link>
      </Pressable>}
      
      {!!dataVal?.me && <Pressable style={styles.button}>
        <Link to='/create-review'>
          <Text style={styles.buttonText}>Create a review</Text>
        </Link>
      </Pressable>}
      {!!dataVal?.me && <Pressable style={styles.button}>
        <Link to='/my-reviews'>
          <Text style={styles.buttonText}>My reviews</Text>
        </Link>
      </Pressable>}
      {!!dataVal?.me && <Pressable style={styles.button}
        onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>}

    </ScrollView>
    

  </View>)
  
}