import { useQuery } from "@apollo/client/react"
import { getMe } from "../../apollo/queries"
import { Text, View } from "react-native"
import { Review } from "../repository-details/repository-details.component"
import { ReviewsList } from "../reviews-list/reviews-list.component"



interface ReviewsData {
  me?: { reviews?: {edges: Array<{node: Review}>}}
}
const mapReviews = (x: ReviewsData): Review[] => {
  return x.me?.reviews?.edges.map(item=> item.node)
}

export const MyReviews = ()=> {
  const { data, loading } = useQuery(getMe, {
    variables: {includeReviews: true}
  })
  if (loading) return (<Text>loading...</Text>)
  console.log('data', data)
  const reviews = mapReviews(data) || []
  console.log('reviews ', reviews)


  return (<>
    {reviews.length>0 && <View>
      <ReviewsList reviews={reviews} showUser={false} showRepo={true}/>
    </View>}
  </>)
}