import { GestureResponderEvent, Image, Pressable, StyleSheet,  View } from "react-native"
import { StyledText  as Text} from "../styled-text/styled-text.component"

import { RepositoryData } from "../repository-list/repository-list.data"
import * as Linking from 'expo-linking'


interface RepositoryItemProps {item: RepositoryData&{url?: string}, 
  showButton?: boolean }

export const RepositoryItem = ({item, showButton}: RepositoryItemProps)=> {
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
    },
    button: {
      backgroundColor: '#0366d6', 
      color: 'white', 
      padding: 3,
      borderRadius: 3,
    }

  })

  const handleUrlPress = (e: GestureResponderEvent)=> {
    e.stopPropagation()
    if (item.url){
      Linking.openURL(item.url)
    }
  }

  return (<>
    <View testID="RepositoryItem">
      <View style={style.itemHead}>
        <Image style={style.avatar}
          source={{uri: item.ownerAvatarUrl}}
        />
        <View style={style.itemTextBlock}>
          <Text style={style.itemName}>{item.fullName}</Text>
          <Text style={{color: 'grey', display: 'flex', flexDirection: 'row',
            maxWidth: '100%', minWidth: '100%'
          }}><Text style={{flex: 1, width: 0}}>{item.description}</Text></Text>
          <Text style={[style.button, {alignSelf: 'flex-start'}]}
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

      {!!showButton &&
      <Pressable 
        onPress={(e)=> handleUrlPress(e)}
        style={[style.button, { marginTop: 16, marginLeft: 16, marginRight: 16}]}>
        <Text style={{color: 'white', textAlign: 'center'}}>Open in GitHub</Text>
      </Pressable>}
    </View>
  </>)
}