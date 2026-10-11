import { useQuery } from "@apollo/client/react"
import { useParams } from "react-router-native"
import { getRepo } from "../../apollo/queries"
import { RepositoryData } from "../repository-list/repository-list.data"
import { RepositoryItem } from "../repository-item/repository-item.component"
import {  View } from "react-native"
import { ReviewsList } from "../reviews-list/reviews-list.component"


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
  reviews?: {edges: Array<{node: Review}>}
}

const mapDataToVal = (x: RepoDetailsData) => {
  return {...x,reviews: x.reviews?.edges.map(e=> e.node) || []} as RepoDetails
}

export const RepositoryDetails = ()=> {
  const {repositoryId} = useParams()
  const { data } = useQuery(getRepo, {variables: {repositoryId}, skip: !repositoryId})
  
  const dataValData = data as {repository: RepoDetailsData}
  if (!dataValData?.repository) return(<></>)

  const dataVal: RepoDetails = mapDataToVal(dataValData.repository) 
  return(
    <View>
      <RepositoryItem item={dataVal} showButton={true}/>
      <ReviewsList reviews={dataVal.reviews}/>
    </View>

  )

  
}