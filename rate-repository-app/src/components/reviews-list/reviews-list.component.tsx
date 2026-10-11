import { FlatList, View, Text, StyleSheet } from "react-native"
import { format, parseJSON } from "date-fns"
import { theme } from "../../theme"
import { Review } from "../repository-details/repository-details.component"

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

interface ReviewsListParams {reviews: Review[], showUser?: boolean, showRepo?: boolean}

export const ReviewsList = ({reviews, showUser=true, showRepo=false}: ReviewsListParams)=> {
  
  return(<FlatList 
    
    data={reviews}
    renderItem={({item})=> <View style={styles.container}>
      <View style={styles.rating}>
        <Text style={{color: theme.colors.primary, fontWeight: 'bold' }}>{item.rating}</Text>
      </View>
      <View style={styles.rightCol}>
        {showUser && <Text style={{fontWeight: 'bold'}}>{item.user.username}</Text>}
        {showRepo && <Text style={{fontWeight: 'bold'}}>{item.repository.name}</Text>}
        
        <Text>{toDateFormat(item.createdAt)}</Text>
        <View style={styles.textWrap}><Text>{item.text}</Text></View>
      </View>
    </View>}
  />)
}