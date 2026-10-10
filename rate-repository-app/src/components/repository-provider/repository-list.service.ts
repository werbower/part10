import * as zu from 'zustand'
import { repositories, RepositoryData } from '../repository-list/repository-list.data'
import { apolloClient } from '../../apollo/apollo.service'
import { getRepositories } from '../../apollo/queries'

export type OrderType = ''|'latest'|'lowest rate'|'highest rate'

export type OrderDirection = 'ASC'|'DESC'
export type OrderBy = 'CREATED_AT'|'RATING_AVERAGE'

interface QueryArgs {
  orderDirection?: OrderDirection
  orderBy?: OrderBy
}

export const ordering: Record<OrderType, 
  {direction: OrderDirection, by: OrderBy, descr: string }> = {
  '': {direction: 'ASC', by: 'CREATED_AT', descr: 'Earliest repositories'},
  'latest': {direction: 'DESC', by: 'CREATED_AT', descr: 'Latest repositories'},
  'highest rate': {direction: 'DESC', by: 'RATING_AVERAGE', descr: 'Highest rated repositories'},
  'lowest rate': {direction: 'ASC', by: 'RATING_AVERAGE', descr: 'Lowest rated repositories'}
}


export interface RepoState {
  orderType: OrderType
  repoData: RepositoryData[]
}

export interface RepoStore extends RepoState {
  setOrderType: (x: OrderType)=> void
  setRepoData: (x: RepositoryData[])=>void
}

export const defaultRepoState: RepoState = {
  orderType: '',
  repoData: repositories
  
}

export class RepositoryListService {
  useStore: zu.UseBoundStore<zu.StoreApi<RepoStore>>
  constructor() {

    this.useStore = this.initStore()
  }

  initStore() {
    return zu.create<RepoStore>()((set)=> {
      return {
        orderType: defaultRepoState.orderType,
        repoData: defaultRepoState.repoData,

        setOrderType: (x: OrderType)=> {
          set(()=> {
            return {orderType: x}
          })
        },
        setRepoData: (x: RepositoryData[])=> {
          set(()=> {
            return {repoData: x}
          })
        }
      }
    })
  }



  setOrderType(orderType: OrderType) {
    this.useStore.getState().setOrderType(orderType)
  }
  setRepoData(repoData: RepositoryData[]) {
    this.useStore.getState().setRepoData(repoData)
  }


  
  getVariables() {
    const vars: QueryArgs = {}
    const orderType = this.useStore.getState().orderType
    if (orderType){
      vars.orderBy = ordering[orderType].by
      vars.orderDirection = ordering[orderType].direction
    }
    return vars
  }

  async loadRepoData() {
    const rData = await apolloClient.query({
      query: getRepositories,
      variables: this.getVariables()
    })
    return rData
  }

}


