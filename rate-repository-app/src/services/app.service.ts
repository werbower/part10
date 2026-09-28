import { apolloClient } from "../apollo/apollo.service"
import { getRepositories, mutAuth } from "../apollo/queries"
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