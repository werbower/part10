import { useQuery } from "@apollo/client/react"
import { useParams } from "react-router-native"
import { getRepo } from "../../apollo/queries"
import { RepositoryData } from "../repository-list/repository-list.data"
import { RepositoryItem } from "../repository-item/repository-item.component"
import {  View } from "react-native"
import { ReviewsList } from "../reviews-list/reviews-list.component"
import { PageData } from "../repository-list/repository-list.component"


export interface Review {id: string, rating: number, text: string, createdAt: string, 
  userId: string, user: {id: string, username: string },
  repositoryId: string, repository: {id: string, name: string }
}

export interface RepoDetails extends RepositoryData {
  url: string
  reviews: Review[]
}

interface RepoDetailsData extends RepositoryData {
  url: string
  reviews?: {edges: Array<{node: Review}>}&PageData
}

const mapDataToVal = (x: RepoDetailsData) => {
  return {...x,reviews: x.reviews?.edges.map(e=> e.node) || []} as RepoDetails
}

const pageSize = 3

export const RepositoryDetails = ()=> {
  const {repositoryId} = useParams()
  const { data, fetchMore} = useQuery(getRepo, {variables: {repositoryId, 
    first: pageSize, after: ''}, skip: !repositoryId})
  

  
  const dataValData = data as {repository: RepoDetailsData}
  if (!dataValData?.repository) return(<></>)
    
  const handleLoadMore = ()=> {
    const hasNext = dataValData.repository?.reviews?.pageInfo?.hasNextPage
    const cursor = dataValData.repository?.reviews?.pageInfo?.endCursor
    if (hasNext){
      fetchMore({variables: {after: cursor}})
    }
    
  }
  
  const dataVal: RepoDetails = mapDataToVal(dataValData.repository) 
  console.log('render reviews', dataVal.reviews)

  return(
    <View style={{flex: 1}}>
      <RepositoryItem item={dataVal} showButton={true}/>
      <ReviewsList reviews={dataVal.reviews} loadMoreFn={handleLoadMore}/>
    </View>

  )

  
}