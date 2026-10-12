import { apolloClient } from "../apollo/apollo.service"
import { CreatedReview, CreatedUser, CreateUserArgs, getRepo, getRepositories, mutAuth, mutCreateReview, mutCreateUser, mutDeleteReview, ReviewCreateArgs } from "../apollo/queries"
import { authStorage } from "./storage.service"

export interface SignInData {
  username: string,
  password: string
}

export const signIn = async (data: SignInData)=> {
  console.log('submit data ', data)
  const results  = await apolloClient.mutate({mutation: mutAuth,
    variables: {credentials: {...data}},
    awaitRefetchQueries: true,
    refetchQueries: [getRepositories]
  })

  console.log('results ', results)
  const dataVal = results.data as {authenticate: {accessToken: string}}
  authStorage.setAccessToken(dataVal.authenticate.accessToken)
  apolloClient.resetStore()
}

export const createReview = async (data: ReviewCreateArgs)=> {
  console.log('create review ', data)
  
  const results  = await apolloClient.mutate({mutation: mutCreateReview,
    variables: {review: {...data}},
    awaitRefetchQueries: true    
  })
  console.log('results ', results)
  apolloClient.resetStore()
  return results as any as {data: { createReview: CreatedReview}}
  
}

export const signUp = async (data: CreateUserArgs)=> {
  console.log('sign up ', data)
  
  const results  = await apolloClient.mutate({mutation: mutCreateUser,
    variables: {user: {...data}},
    awaitRefetchQueries: true
  })
  console.log('results create user', results)
  apolloClient.resetStore()
  return results as any as {data: { createUser: CreatedUser}}
  
}

export const deleteReview = async (id: string)=> {
  const result = await apolloClient.mutate({
    mutation: mutDeleteReview,
    variables: {deleteReviewId: id}
  })
  console.log('result of delete review', result)
  apolloClient.resetStore()
  return result as any
}