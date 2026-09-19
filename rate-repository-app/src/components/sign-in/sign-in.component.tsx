import { Pressable, TextInput, View ,  StyleSheet} from "react-native"
import { StyledText  as Text} from "../styled-text/styled-text.component"


import {Controller, useForm, } from 'react-hook-form'
import  * as z from 'zod'
import { theme } from "../../theme"
import { zodResolver } from "@hookform/resolvers/zod"



interface FormData {
  username: string,
  password: string
}

const zodSchema = z.object({
  username: z.string('username is required').trim().min(1, 'username is required'),
  password: z.string('password is required').trim().min(1, 'password is required')
})

const defaultData: FormData = {username: '', password: ''}
const style = StyleSheet.create({
  form: {
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    rowGap: 8
  },
  formItem: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 3,
  },
  formSignButton: {
    padding: 8,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  formSignText: {
    color: 'white'
  },
  errorText: {
    color: theme.colors.error
  }
  
})

export const SignIn = ()=> {
  const { trigger,
    handleSubmit, control, getValues, formState: {errors}}= useForm<FormData>({
    defaultValues: defaultData,
    resolver: zodResolver(zodSchema)
  })
  

  const onSubmit =()=> {
    trigger()
    
    handleSubmit((data: FormData)=> {
      console.log('submit data ', data)
    },()=> {
      console.log('error submit data', getValues())
      console.log('errors ', errors)
    })()
  } 

  const inputErrStyle = StyleSheet.create({
    textInput: {
      borderWidth: 1,
      borderColor: 'red'
    }
  })



  return(<View style={style.form}>

    
    <View>
      <Controller 
        control={control}
        render={({field: {onChange, value}}) => (
          <TextInput 
            style={[style.formItem, (errors.username&&inputErrStyle.textInput)]}
            placeholder="Username"
            placeholderTextColor='grey'
            onChangeText={onChange}
            value={value}
              
            onBlur={()=> trigger('username')}
          />
        )}
        name="username"
      />
      {errors.username && <Text 
        style={style.errorText}>{errors.username.message}</Text>}
        
    </View>

    <Controller 
      control={control}
      render={({field: { onChange, value, }}) => (
        <TextInput 
            
          style={[style.formItem, (errors.username&&inputErrStyle.textInput)]}
          placeholder="Password"
          placeholderTextColor='grey'
          onChangeText={onChange}
          value={value}
          secureTextEntry
            
          onBlur={()=> trigger('password')}
        />
      )}
      name="password"
    />
    {errors.password && <Text 
      style={style.errorText}>{errors.password.message}</Text>}

    <Pressable 
      style={[style.formSignButton]}
      onPress={onSubmit}>
      <Text style={style.formSignText}>Sign in</Text>
    </Pressable>
    
  </View>)
}