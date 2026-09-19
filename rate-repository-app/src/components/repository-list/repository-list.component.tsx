import { FlatList, View, StyleSheet } from 'react-native'
import { repositories } from './repository-list.data'
import { RepositoryItem } from '../repository-item/repository-item.component'

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
})



const ItemSeparator = () => <View style={styles.separator} />

export const RepositoryList = () => {
  return (
    <FlatList
      data={repositories}
      renderItem={({item})=>  <RepositoryItem {...{item}} />}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={item => item.id}
      // other props
    />
  )
}

