import { useQuery } from "@apollo/client/react"
import { useParams } from "react-router-native"
import { getRepo } from "../../apollo/queries"
import { RepositoryData } from "../repository-list/repository-list.data"
import { RepositoryItem } from "../repository-item/repository-item.component"

export interface RepoDetails extends RepositoryData {
  url: string
}


export const RepositoryDetails = ()=> {
  const {repositoryId} = useParams()
  const { data } = useQuery(getRepo, {variables: {repositoryId}, skip: !repositoryId})
  
  const dataVal = data as {repository: RepoDetails}
  if (!dataVal?.repository) return(<></>)
    
  return(<>
    <RepositoryItem item={dataVal!.repository} showButton={true}/>
  </>)
}