import { FlatList, View, StyleSheet, Text, Pressable } from 'react-native'
import { RepositoryData } from './repository-list.data'
import { RepositoryItem } from '../repository-item/repository-item.component'
import { useNavigate } from 'react-router-native'
import { useContext, useEffect, useState } from 'react'
import { RepositoryContext } from '../repository-provider/repository-provider.component'
import { useShallow } from 'zustand/shallow'
import {   distinctUntilChanged, finalize, from, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs'
import { FilterState } from '../repository-provider/repository-list.service'

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
})

const ItemSeparator = () => <View style={styles.separator} />


export const RepositoryList = () => {
  const [destroyed$] = useState(new Subject<void>())
  const repoService = useContext(RepositoryContext)
  const [loading, setLoading] = useState(false)
  
  const repoData = repoService.useStore(useShallow(x=> x.repoData))
  const navigate = useNavigate()

  useEffect(()=> {

    repoService.filter$.pipe(
      startWith({orderType: repoService.orderType$.value, 
        search: repoService.search$.value} as FilterState),
      distinctUntilChanged((p: FilterState,c: FilterState)=> 
        p?.orderType === c?.orderType && p?.search === c?.search),
      switchMap(()=> {
        setLoading(true)
        return from(repoService.loadRepoData()).pipe(
          finalize(()=> setLoading(false))
        )
      }),
      tap(result=> {
        const data = result.data as {repositories: any}        
        if (data && data.repositories) {
          const dataVal = data as {repositories: {edges?: Array<{node: RepositoryData}>}}
          const rData = dataVal.repositories?.edges?.map(x=> x.node) as RepositoryData[]
          console.log('data', rData)
          repoService.setRepoData(rData)
        }
      }),
      takeUntil(destroyed$)
    ).subscribe()
    
    return ()=> {
      destroyed$.next()
      destroyed$.complete()
    }
  }, [])
  
  if (loading) return (<Text>loading...</Text>)
    
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

