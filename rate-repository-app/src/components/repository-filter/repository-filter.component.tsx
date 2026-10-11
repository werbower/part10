import { Picker } from "@react-native-picker/picker"
import { useContext } from "react"
import {  StyleSheet, TextInput, View } from "react-native"
import { ordering, OrderType } from "../repository-provider/repository-list.service"
import { RepositoryContext } from "../repository-provider/repository-provider.component"
import { useShallow } from "zustand/shallow"

const style = StyleSheet.create({
  container: {
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    rowGap: 8,
  }
})

export const RepositoryFilter = ()=> {
  
  const repoService = useContext(RepositoryContext)
  const selectedOrderType = repoService.useStore(useShallow(x=> x.orderType))
  const selectedSearch = repoService.useStore(useShallow(x=> x.search))
  
  const handleChangeOrderType = (newValue: OrderType)=> {
    repoService.setOrderType(newValue)
  }

  const handleChangeSearch = (newVal: string)=> {
    repoService.setSearch(newVal)
  }

  return(<View style={style.container}>
    <View>
      <TextInput
        value={selectedSearch}
        onChangeText={handleChangeSearch}
        style={{borderWidth: 1,}}
      ></TextInput>
    
    </View>
    <View>
      <Picker
        selectedValue={selectedOrderType}
        onValueChange={handleChangeOrderType}
        prompt="Select an item"
      >
        {Object.keys(ordering)
          
          .map(keyVal=> {
            const key = keyVal as OrderType
            const label = ordering[key].descr
            
            return (<Picker.Item 
              key={key} value={key} label={label}
            />)})}
        

      </Picker>
    
    </View>
  </View>)
}