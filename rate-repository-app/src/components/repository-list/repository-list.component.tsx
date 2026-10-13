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

export interface PageData {totalCount: number, pageInfo: {endCursor: string, hasNextPage: boolean}}
interface RepositoryDataLoad {repositories: {edges?: Array<{node: RepositoryData}>}&PageData }



const mapFn = (data : RepositoryDataLoad)=> {
  return data.repositories?.edges?.map(x=> x.node) as RepositoryData[]
}
const pageSize = 4


export const RepositoryList = () => {
  const [destroyed$] = useState(new Subject<void>())
  const repoService = useContext(RepositoryContext)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  
  const fullData = repoService.useStore(useShallow(x=> ({
    repoData: x.repoData, hasNextPage: x.hasNextPage})))
  const navigate = useNavigate()

  useEffect(()=> {

    repoService.filter$.pipe(
      startWith({orderType: repoService.orderType$.value, 
        search: repoService.search$.value} as FilterState),
      distinctUntilChanged((p: FilterState,c: FilterState)=> 
        p?.orderType === c?.orderType && p?.search === c?.search),
      switchMap(()=> {
        setLoading(true)
        return from(repoService.loadRepoData(pageSize)).pipe(
          finalize(()=> setLoading(false))
        )
      }),
      tap(result=> {
        const data = result.data as RepositoryDataLoad
        if (data && data.repositories) {
          const rData = mapFn(data)
          console.log('data', rData)
          repoService.setRepoData(rData, data.repositories.totalCount, 
            data.repositories.pageInfo.endCursor, data.repositories.pageInfo.hasNextPage)
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

  const handleOnEndReached = async ()=> {
    if (pageLoading) return
    if (!fullData.hasNextPage) return
    console.log('load page ')

    setPageLoading(true)
    const result = await repoService.loadRepoData(pageSize, true) as {data: RepositoryDataLoad}
    
    const data = result.data
    if (data && data.repositories) {
      const rData = mapFn(data)
      console.log('data', rData)
      repoService.setRepoData([...fullData.repoData, ...rData], data.repositories.totalCount, 
        data.repositories.pageInfo.endCursor, data.repositories.pageInfo.hasNextPage)
    }
    setPageLoading(false)
  }
  
  
  return (
    <FlatList
      style={{margin: 10}}
      data={fullData.repoData}
      renderItem={({item})=> <Pressable 
        onPress={()=> handleItemPress(item)}><RepositoryItem {...{item}} />
      </Pressable>}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={item => item.id}
      // other props
      onEndReached={handleOnEndReached}
      onEndReachedThreshold={0.5}
    />
  )
}

