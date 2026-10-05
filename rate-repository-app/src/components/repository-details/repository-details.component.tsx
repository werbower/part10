import { useQuery } from "@apollo/client/react"
import { useParams } from "react-router-native"
import { getRepo } from "../../apollo/queries"
import { RepositoryData } from "../repository-list/repository-list.data"
import { RepositoryItem } from "../repository-item/repository-item.component"
import { FlatList, View, Text, StyleSheet } from "react-native"
import { format, parseJSON } from "date-fns"
import { theme } from "../../theme"


export interface Review {id: string, rating: number, text: string, createdAt: string, 
  userId: string, user: {id: string, username: string }}

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

const toDateFormat = (x: string)=> {
  const date = parseJSON(x)
  return format(date, 'dd MMM yyyy')
}
const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    flexDirection: 'row',
    padding: 16,
    columnGap: 8
  },
  rating: {
    width: 40,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: '50%',
    borderColor: theme.colors.primary,
    alignSelf: 'flex-start',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center'
  },
  rightCol: {
    flex: 1,
    rowGap: 8

  },
  textWrap: {
    display: 'flex',
    flexDirection: 'row'
  }
})


export const RepositoryDetails = ()=> {
  const {repositoryId} = useParams()
  const { data } = useQuery(getRepo, {variables: {repositoryId}, skip: !repositoryId})


  
  const dataValData = data as {repository: RepoDetailsData}
  if (!dataValData?.repository) return(<></>)

  const dataVal: RepoDetails = mapDataToVal(dataValData.repository) 
  return(<FlatList 
    ListHeaderComponent={<RepositoryItem item={dataVal} showButton={true}/>}
    data={dataVal.reviews}
    renderItem={({item})=> <View style={styles.container}>
      <View style={styles.rating}>
        <Text style={{color: theme.colors.primary, fontWeight: 'bold' }}>{item.rating}</Text>
      </View>
      <View style={styles.rightCol}>
        <Text style={{fontWeight: 'bold'}}>{item.user.username}</Text>
        <Text>{toDateFormat(item.createdAt)}</Text>
        <View style={styles.textWrap}><Text>{item.text}</Text></View>
      </View>
    </View>}
  />)

  
}