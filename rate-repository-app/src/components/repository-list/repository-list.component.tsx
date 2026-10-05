import { FlatList, View, StyleSheet, Text, Pressable } from 'react-native'
import { repositories, RepositoryData } from './repository-list.data'
import { RepositoryItem } from '../repository-item/repository-item.component'
import { getRepositories } from '../../apollo/queries'
import { useQuery } from '@apollo/client/react'
import { useNavigate } from 'react-router-native'

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
})



const ItemSeparator = () => <View style={styles.separator} />

export const RepositoryList = () => {
  const { data, error, loading } = useQuery(getRepositories)
  const navigate = useNavigate()

  let repoData = repositories

  if (loading) return (<Text>loading...</Text>)
  if (error) {
    console.log('error', error)
  }
  if (data) {
    const dataVal = data as {repositories: {edges?: Array<{node: RepositoryData}>}}
    repoData = dataVal.repositories?.edges?.map(x=> x.node) as RepositoryData[]
    console.log('data', repoData)

  }

  const handleItemPress = (item: RepositoryData)=> {
    navigate(`/details/${item.id}`)
  }
  
  
  return (
    <FlatList
      style={{margin: 10}}
      data={repoData}
      renderItem={({item})=> <Pressable 
        onPress={()=> handleItemPress(item)}><RepositoryItem {...{item}} />
      </Pressable>}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={item => item.id}
      // other props
    />
  )
}

