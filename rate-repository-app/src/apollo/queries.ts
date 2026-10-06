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
    reviews {
      edges {
        node {
          id
          rating
          text
          createdAt
          userId
          user {
            id
            username
          }
        }
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

export const mutCreateReview = gql`
mutation CreateReview($review: CreateReviewInput) {
  createReview(review: $review) {
    createdAt
    id
    rating
    repository {
      id
      language
      name
      ownerName
    }
    repositoryId
    text
    user {
      id
      username
    }
    userId
  }
}`

export interface CreatedReview {
  createdAt: string
  id: string
  rating: number
  repository: {
    id: string
    language: string
    name: string
    ownerName: string
  }
  repositoryId: string
  text: string
  user: {
    id: string
    username: string
  }
  userId: string
}

export interface ReviewCreateArgs {
  ownerName: string,
  rating: number,
  repositoryName: string,
  text?: string
}