import { Image, StyleSheet,  View } from "react-native"
import { StyledText  as Text} from "../styled-text/styled-text.component"

import { repositories } from "../repository-list/repository-list.data"

interface RepositoryItemProps {item: typeof repositories[number]}

export const RepositoryItem = ({item}: RepositoryItemProps)=> {
  const style = StyleSheet.create({
    itemHead: {
      padding: 8,
      display: 'flex',
      flexDirection: 'row',
      columnGap: 8,
    },
    itemTextBlock: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: 6,
      paddingRight: 16,
      flex: 1,
    },

    itemName: {
      fontWeight: 'bold',
    },
    avatar: {
      width: 40,
      height: 40,
    },
    
    statusRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    statusColumn: {
      flex: 1,
      textAlign: 'center'
    },
    greyText: {
      color: 'grey'
    }

  })


  return (<>
    <View>
      <View style={style.itemHead}>
        <Image style={style.avatar}
          source={{uri: item.ownerAvatarUrl}}
        />
        <View style={style.itemTextBlock}>
          <Text style={style.itemName}>{item.fullName}</Text>
          <Text style={{color: 'grey', display: 'flex', flexDirection: 'row',
            maxWidth: '100%', minWidth: '100%'
          }}><Text style={{flex: 1, width: 0}}>{item.description}</Text></Text>
          <Text style={{
            backgroundColor: '#0366d6', 
            color: 'white', 
            padding: 3,
            borderRadius: 3,
            alignSelf: 'flex-start'
          }}
          >{item.language}</Text>
        </View>
      </View>
      <View>
        <View style={style.statusRow}>
          <Text style={style.statusColumn}>{item.stargazersCount}</Text>
          <Text style={style.statusColumn}>{item.forksCount}</Text>
          <Text style={style.statusColumn}>{item.reviewCount}</Text>
          <Text style={style.statusColumn}>{item.ratingAverage}</Text>
        </View>
        <View style={style.statusRow}>
          <Text style={[style.statusColumn, style.greyText]}>Stars: </Text>
          <Text style={[style.statusColumn, style.greyText]}>Forks: </Text>
          <Text style={[style.statusColumn, style.greyText]}>Reviews: </Text>
          <Text style={[style.statusColumn, style.greyText]}>Rating: </Text>
        </View>
      </View>
      


      
      
      
    </View>
  </>)
}