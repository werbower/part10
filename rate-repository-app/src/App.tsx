
import { StyleSheet,  View } from 'react-native'
import { RepositoryList } from './components/repository-list/repository-list.component'
import { AppBar } from './components/app-bar/app-bar.component'
import { Navigate, Route, Routes } from 'react-router-native'
import { SignIn } from './components/sign-in/sign-in.component'
import { RepositoryDetails } from './components/repository-details/repository-details.component'
import { CreateReview } from './components/create-review/create-review.component'


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
        <Route path='/details/:repositoryId' element={<RepositoryDetails />}/>
        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='/create-review' element={<CreateReview />}/>
        
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
    minWidth: 400,
    maxWidth: 600

  },
  container: {
    
    
    backgroundColor: '#fff',

  },
})
