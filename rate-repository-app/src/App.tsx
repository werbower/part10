
import { StyleSheet,  View } from 'react-native'
import { RepositoryList } from './components/repository-list/repository-list.component'
import { AppBar } from './components/app-bar/app-bar.component'
import { Navigate, Route, Routes } from 'react-router-native'
import { SignIn } from './components/sign-in/sign-in.component'


export default function App() {

  return (<>
    <View style={styles.app}>
      <AppBar/>
      <Routes>
        <Route path='/' element={
          <View style={styles.container}>
            <RepositoryList />
          </View>
        } />
        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='*' element={<Navigate to='/' replace/>}/>

      </Routes>
      
    </View>
  </>
    
    
  )
}

const styles = StyleSheet.create({
  app: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 400

  },
  container: {
    paddingLeft: 16,
    backgroundColor: '#fff',
  },
})
