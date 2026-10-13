import { FlatList, View, Text, StyleSheet, Pressable, Alert, Platform } from "react-native"
import { format, parseJSON } from "date-fns"
import { theme } from "../../theme"
import { Review } from "../repository-details/repository-details.component"
import { useNavigate } from "react-router-native"
import { RefetchFunction } from "@apollo/client/react/internal"
import { deleteReview } from "../../services/app.service"


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
  },
  actionsContainer: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    columnGap: 16
  },
  actionButton: {
    borderRadius: 8,
    padding: 8,
    backgroundColor: theme.colors.primary,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  actionButtonAlarm: {
    backgroundColor: theme.colors.alarm
  }

})

interface ReviewsListParams {reviews: Review[],
  showUser?: boolean, showRepo?: boolean, 
  showActions?: boolean, refetchFn?: RefetchFunction<any, any, any>,
  loadMoreFn?: ()=> void}

export const ReviewsList = ({reviews, showUser=true, showRepo=false,
  showActions = false, refetchFn= undefined, loadMoreFn=undefined
}: ReviewsListParams)=> {
  const navigate = useNavigate()

  const handleReviewRepo = (id: string)=> {
    navigate(`/details/${id}`)
  }

  const createDeleteAlert = (id: string) =>{
    const title = 'Delete review'
    const message = 'Are you sure you want to delete this review?'
    const onConfirm = async ()=> {
      console.log('Delete Pressed')
      await deleteReview(id)
      if (refetchFn)
        refetchFn()
    }

    if (Platform.OS === 'web') {
      const result = window.confirm(`${title}\n\n${message}`)
      if (result)
        onConfirm()
    }


    Alert.alert(title, 
      message, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Delete', onPress: onConfirm},
      ])
  }

  const handleOnEnd = ()=> {
    if(loadMoreFn)
      loadMoreFn()
  }
  
  return(<FlatList 
    
    onEndReached={handleOnEnd}
    onEndReachedThreshold={0.5}
    data={reviews}
    renderItem={({item})=> <>
      <View style={styles.container}>
        <View style={styles.rating}>
          <Text style={{color: theme.colors.primary, fontWeight: 'bold' }}>{item.rating}</Text>
        </View>
        <View style={styles.rightCol}>
          {showUser && <Text style={{fontWeight: 'bold'}}>{item.user.username}</Text>}
          {showRepo && <Text style={{fontWeight: 'bold'}}>{item.repository.name}</Text>}
        
          <Text>{toDateFormat(item.createdAt)}</Text>
          <View style={styles.textWrap}><Text>{item.text}</Text></View>
        </View>
      </View>
      {showActions && <View style={styles.actionsContainer}>
        <Pressable style = {styles.actionButton} 
          onPress={()=> handleReviewRepo(item.repositoryId)}>
          <Text style={styles.actionButtonText}>View repository</Text>
        </Pressable>
        <Pressable style = {[styles.actionButton, styles.actionButtonAlarm]}
          onPress={()=> createDeleteAlert(item.id)}>
          <Text style={styles.actionButtonText}>Delete review</Text>
        </Pressable>

      </View>}
    </>}
  />)
}