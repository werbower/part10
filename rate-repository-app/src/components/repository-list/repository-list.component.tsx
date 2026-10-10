import { FlatList, View, StyleSheet, Text, Pressable } from 'react-native'
import { RepositoryData } from './repository-list.data'
import { RepositoryItem } from '../repository-item/repository-item.component'
import { useNavigate } from 'react-router-native'
import { useContext, useEffect, useState } from 'react'
import { RepositoryContext } from '../repository-provider/repository-provider.component'
import { RepositoryFilter } from '../repository-filter/repository-filter.component'
import { useShallow } from 'zustand/shallow'

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
})

const ItemSeparator = () => <View style={styles.separator} />


export const RepositoryList = () => {
  const repoService = useContext(RepositoryContext)
  const [loading, setLoading] = useState(false) 

  const filter = repoService.useStore(useShallow(x=> ({orderType: x.orderType})))
  const repoData = repoService.useStore(useShallow(x=> x.repoData))
  
  const navigate = useNavigate()

  useEffect(()=> {
    const f = async()=> {
      try {
        setLoading(true)
        const {data} = await repoService.loadRepoData()
        if (data) {
          const dataVal = data as {repositories: {edges?: Array<{node: RepositoryData}>}}
          const rData = dataVal.repositories?.edges?.map(x=> x.node) as RepositoryData[]
          console.log('data', rData)
          repoService.setRepoData(rData)
        }
      } finally {
        setLoading(false)
      }
    }

    f()
    
  }, [filter])
  
  
  
  
  
  

  
  
  if (loading) return (<Text>loading...</Text>)
    
  const handleItemPress = (item: RepositoryData)=> {
    navigate(`/details/${item.id}`)
  }
  
  
  return (
    <FlatList
      style={{margin: 10}}
      data={repoData}
      ListHeaderComponent={<RepositoryFilter/>}
      renderItem={({item})=> <Pressable 
        onPress={()=> handleItemPress(item)}><RepositoryItem {...{item}} />
      </Pressable>}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={item => item.id}
      // other props
    />
  )
}

