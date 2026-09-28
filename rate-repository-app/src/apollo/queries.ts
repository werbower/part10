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

export const getRepo = gql`
query getRepo($repositoryId: ID!) {
  repository(id: $repositoryId) {
    id
    ownerName
    name
    
    createdAt
    fullName
    
    ratingAverage
    reviewCount
    stargazersCount
    watchersCount
    forksCount
    openIssuesCount
    url
    ownerAvatarUrl
    description
    language
    userHasReviewed
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