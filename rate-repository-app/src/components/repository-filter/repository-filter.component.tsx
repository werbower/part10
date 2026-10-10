import { Picker } from "@react-native-picker/picker"
import { useContext } from "react"
import {  View } from "react-native"
import { ordering, OrderType } from "../repository-provider/repository-list.service"
import { RepositoryContext } from "../repository-provider/repository-provider.component"
import { useShallow } from "zustand/shallow"




export const RepositoryFilter = ()=> {
  const repoService = useContext(RepositoryContext)
  const selectedOrderType = repoService.useStore(useShallow(x=> x.orderType) )



  

  const handleChangeOrderType = (newValue: OrderType)=> {
    console.log('selected ', newValue)
    repoService.setOrderType(newValue)
    
  }

  return(<>
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
  </>)
}