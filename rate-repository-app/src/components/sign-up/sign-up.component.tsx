import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, TextInput, View, Text, Pressable } from 'react-native'
import * as z from 'zod'
import { theme } from '../../theme'
import { signIn, signUp } from '../../services/app.service'
import { CombinedGraphQLErrors } from '@apollo/client'
import { useNavigate } from 'react-router-native'

interface FormData {
  username: string
  password: string
  passwordConfirm: string
}

const baseSchema = z.object({
  username: z.string('user name is required').min(1, 'user name is required'),
  password: z.string('password is required').min(1, 'password is required'),
  passwordConfirm: z.string('password confirmation is required').min(1, 'password confirm name is required'),
})
const zodSchema = baseSchema.refine(val=> {return val.password === val.passwordConfirm},{
  path: ['passwordConfirm'],
  message: 'password and password confirm must be equal',
  when(payload) {
    return baseSchema
      .pick({ password: true, passwordConfirm: true }) 
      .safeParse(payload.value).success 
  }   
})

const defaultData = {username: '',  password: '',  passwordConfirm: ''}

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
  formItemError: {
    borderWidth: 1,
    borderColor: theme.colors.error
  },
  errorText: {
    color: theme.colors.error
  }
  
})

export const SignUp = ()=> {
  const navigate = useNavigate()
  const { trigger, handleSubmit, control, getValues, formState: {errors}}= useForm({
    defaultValues: defaultData,
    resolver: zodResolver(zodSchema) as any
  })

  const successSubmit = async (data: FormData)=> {
    console.log('submit success', data)
    try {
      const userData = {username: data.username, password: data.password}
      await signUp(userData)
      await signIn(userData)
      navigate('/')

    } catch (e) {
      if (e instanceof CombinedGraphQLErrors) {
        console.log('create user error ', 
          e.errors?.[0]?.message)
      } else {
        console.log('create user error',(e as {message?: string}).message||e)
      }
      throw e
    }
  }

  const errorSubmit = (e: typeof errors)=> {
    console.log('error submit', e)

  }

  const onSubmit =()=> {
    trigger()
    console.log('submit', getValues())

    handleSubmit(successSubmit, errorSubmit)()
  }
  
  return (<>
    <View style={style.form}>
      <View>
        <Controller 
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput 
              style={[style.formItem, (errors.username&&style.formItemError)]}
              placeholder="Username"
              placeholderTextColor='grey'
              onChangeText={onChange}
              value={value}
              onBlur={()=> trigger('username')}
            />
          )}
          name="username"
        />
        {errors.username && <Text style={style.errorText}>{errors.username.message}</Text>}
                
      </View>
      <View>
        <Controller 
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput 
              style={[style.formItem, (errors.password&&style.formItemError)]}
              placeholder="Password"
              placeholderTextColor='grey'
              onChangeText={onChange}
              value={value}
              onBlur={()=> trigger('password')}
            />
          )}
          name="password"
        />
        {errors.password && <Text style={style.errorText}>{errors.password.message}</Text>}
                
      </View>
      <View>
        <Controller 
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput 
              style={[style.formItem, (errors.passwordConfirm&&style.formItemError)]}
              placeholder="Password confirmation"
              placeholderTextColor='grey'
              onChangeText={onChange}
              value={value}
              onBlur={()=> trigger('passwordConfirm')}
            />
          )}
          name="passwordConfirm"
        />
        {errors.passwordConfirm && <Text style={style.errorText}>{errors.passwordConfirm.message}</Text>}
      </View>

      <Pressable 
        style={[style.formSignButton]}
        onPress={onSubmit}>
        <Text style={style.formSignText}>Sign up</Text>
      </Pressable>
    
    </View>
  </>)
}