import { gql  } from "@apollo/client"

export const getRepositories = gql`
query getRepositories($orderDirection: OrderDirection, 
$orderBy: AllRepositoriesOrderBy, $searchKeyword: String) {
  repositories(orderDirection: $orderDirection, orderBy: $orderBy, 
  searchKeyword: $searchKeyword) {
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
query getMe($includeReviews: Boolean = false) {
  me {
    id
    username

    reviews @include(if: $includeReviews) {
      edges {
        node {
          id
          rating
          repositoryId
          repository {
            id
            name
          }
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

export const mutCreateUser = gql`
mutation CreateUser($user: CreateUserInput) {
  createUser(user: $user) {
    id
    username
  }
}`
export interface CreateUserArgs {
  password: string
  username: string
}
export interface CreatedUser {
  id: string
  username: string
}

export const mutDeleteReview = gql`
mutation DeleteReview($deleteReviewId: ID!) {
  deleteReview(id: $deleteReviewId)
}`