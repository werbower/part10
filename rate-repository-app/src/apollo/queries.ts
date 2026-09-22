import { gql  } from "@apollo/client"

export const getRepositories = gql`
query getRepositories {
  repositories {
    edges {
      node {
        id
        fullName
        description
        language
        forksCount
        stargazersCount
        ratingAverage
        reviewCount
        ownerAvatarUrl
      }
    }
  }
}`

export const getMe = gql`
query getMe {
  me {
    id
    username
  }
}`

export const mutAuth = gql`
mutation mutAuth($credentials: AuthenticateInput) {
  authenticate(credentials: $credentials) {
    accessToken
    expiresAt
    user {
      id
      username
    }
  }
}`