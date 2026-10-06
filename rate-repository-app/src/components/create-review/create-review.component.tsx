import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { TextInput, View, Text, Pressable, StyleSheet } from 'react-native'
import { useNavigate } from 'react-router-native'
import * as z from 'zod'
import { theme } from '../../theme'
import { createReview } from '../../services/app.service'
import { CombinedGraphQLErrors } from '@apollo/client'


interface FormData {
  ownerName: string
  repositoryName: string
  rating: string
  text?: string|undefined
}

const zodSchema = z.object({
  ownerName: z.string('owner name is required').trim().min(1, 'owner name is required'),
  repositoryName: z.string('repository name is required').trim().min(1, 'repository name is required'),
  rating: z.preprocess(x=> !x?undefined:x,
    z.coerce.number<string>('rating(number) is required').min(0, 'min rating is 0').max(100, 'max rating is 100')),
  text: z.string().optional()
})

type ParsedData = z.infer<typeof zodSchema>

const defaultData: Record<keyof FormData, string> = {ownerName: '', repositoryName: '', rating: '', text: ''}

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
  formItemError: {
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  
  formSubmitButton: {
    padding: 8,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  formSubmitText: {
    color: 'white'
  },
  errorText: {
    color: theme.colors.error
  }
  
})

export const CreateReview = ()=> {
  const navigate = useNavigate()
  
  const { trigger,
    handleSubmit, control, getValues, formState: {errors}}= useForm<FormData, any, ParsedData>({
    defaultValues: defaultData,
    resolver: zodResolver(zodSchema) as any
  })

  const successSubmit =  async (data: ParsedData)=> {
    console.log('success submit ', data)
    try{
      const result = await createReview(data)
      const newReview = result.data.createReview
      navigate(`/details/${newReview.repositoryId}`)
      
    } catch(e) {
      if (e instanceof CombinedGraphQLErrors) {
        console.log('create review error ', 
          e.errors?.[0]?.message)
      } else {
        console.log('create review error',(e as {message?: string}).message||e)
      }
      throw e
    }
    
    

  }
  const errorSubmit = ()=> {
    console.log('error submit data', getValues())
    console.log('errors ', errors)
  }
  const submitHandler = ()=> {
    trigger()
    handleSubmit(successSubmit, errorSubmit)()
  }


  return(<>
    <View style={style.form}>
      <View>
        <Controller 
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              style={[style.formItem, (errors.ownerName&&style.formItemError)]}
              placeholder="Repository owner name"
              placeholderTextColor='grey'
              onChangeText={onChange}
              value={value}
                  
              onBlur={()=> trigger('ownerName')}
            />
          )}
          name="ownerName"
        />
        {errors.ownerName && <Text style={style.errorText}>{errors.ownerName.message}</Text>}
      </View>
      <View>
        <Controller 
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              style={[style.formItem, (errors.repositoryName&&style.formItemError)]}
              placeholder="Repository name"
              placeholderTextColor='grey'
              onChangeText={onChange}
              value={value}
                  
              onBlur={()=> trigger('repositoryName')}
            />
          )}
          name="repositoryName"
        />
        {errors.repositoryName && <Text style={style.errorText}>{errors.repositoryName.message}</Text>}
      </View>
      <View>
        <Controller 
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              style={[style.formItem, (errors.rating&&style.formItemError)]}
              placeholder="Rating between 0 and 100"
              placeholderTextColor='grey'
              onChangeText={onChange}
              value={value}
              keyboardType='numeric'
              onBlur={()=> trigger('rating')}
            />
          )}
          name="rating"
        />
        {errors.rating && <Text style={style.errorText}>{errors.rating.message}</Text>}
      </View>

      <View>
        <Controller 
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              style={[style.formItem, (errors.text&&style.formItemError)]}
              placeholder="Review"
              placeholderTextColor='grey'
              onChangeText={onChange}
              value={value}
              multiline={true}
              onBlur={()=> trigger('text')}
            />
          )}
          name="text"
        />
        {errors.text && <Text style={style.errorText}>{errors.text.message}</Text>}
      </View>

      <Pressable
        style={style.formSubmitButton}
        onPress={submitHandler}>
        <Text style={style.formSubmitText}>Create a review</Text>
      </Pressable>

    </View>
  </>)

}