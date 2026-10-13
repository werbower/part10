import * as zu from 'zustand'
import { repositories, RepositoryData } from '../repository-list/repository-list.data'
import { apolloClient } from '../../apollo/apollo.service'
import { getRepositories } from '../../apollo/queries'
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs'

export type OrderType = ''|'latest'|'lowest rate'|'highest rate'

export type OrderDirection = 'ASC'|'DESC'
export type OrderBy = 'CREATED_AT'|'RATING_AVERAGE'

interface QueryArgs {
  orderDirection?: OrderDirection
  orderBy?: OrderBy
  searchKeyword?: string
  first?: number,
  after?: string
}

export const ordering: Record<OrderType, 
  {direction: OrderDirection, by: OrderBy, descr: string }> = {
  '': {direction: 'ASC', by: 'CREATED_AT', descr: 'Earliest repositories'},
  'latest': {direction: 'DESC', by: 'CREATED_AT', descr: 'Latest repositories'},
  'highest rate': {direction: 'DESC', by: 'RATING_AVERAGE', descr: 'Highest rated repositories'},
  'lowest rate': {direction: 'ASC', by: 'RATING_AVERAGE', descr: 'Lowest rated repositories'}
}

export interface FilterState {
  orderType: OrderType
  search: string
}

export interface RepoState extends FilterState {
  repoData: RepositoryData[]
  totalCount: number
  cursor: string
  hasNextPage: boolean
}

export interface RepoStore extends RepoState {
  setOrderType: (x: OrderType)=> void
  setRepoData: (x: RepositoryData[], y: number, c: string, hnp: boolean)=>void
  setSearch: (x: string)=>void
}

export const defaultRepoState: RepoState = {
  orderType: '',
  search: '',

  repoData: repositories,
  totalCount: repositories.length,
  cursor: '',
  hasNextPage: false
}

export class RepositoryListService {

  orderType$ = new BehaviorSubject<OrderType>(defaultRepoState.orderType)
  search$ = new BehaviorSubject<string>(defaultRepoState.search)
  
  filter$ = combineLatest([
    this.orderType$.pipe( distinctUntilChanged()),
    this.search$.pipe(debounceTime(500), distinctUntilChanged())
  ]).pipe(map(([orderType, search])=> {
    return {orderType, search}
  }))

  
  useStore: zu.UseBoundStore<zu.StoreApi<RepoStore>>
  constructor() {
    this.useStore = this.initStore()
  }

  initStore() {
    return zu.create<RepoStore>()((set)=> {
      return {
        orderType: defaultRepoState.orderType,
        search: defaultRepoState.search,
        repoData: defaultRepoState.repoData,
        totalCount: defaultRepoState.totalCount,
        cursor: defaultRepoState.cursor,

        setOrderType: (x: OrderType)=> {
          set(()=> {
            return {orderType: x}
          })
        },
        setRepoData: (x: RepositoryData[], y: number, c: string, hnp: boolean)=> {
          set(()=> {
            return {repoData: x, totalCount: y, cursor: c, hasNextPage: hnp}
          })
        },
        setSearch: (x: string)=> set(()=> ({search: x}))
      }
    })
  }
  
  setOrderType(orderType: OrderType) {
    this.useStore.getState().setOrderType(orderType)
    this.orderType$.next(orderType)
  }
  setSearch(search: string) {
    const prev = this.useStore.getState().search
    if (prev === search) return

    this.useStore.getState().setSearch(search)
    this.search$.next(search)
  }
  
  setRepoData(repoData: RepositoryData[], totalCount: number, cursor = '', hasNextPage= false) {
    this.useStore.getState().setRepoData(repoData, totalCount, cursor, hasNextPage)
  }
  
  getVariables(pageSize?: number, more?: boolean) {
    const vars: QueryArgs = {}
    const orderType = this.useStore.getState().orderType
    
    vars.orderBy = ordering[orderType].by
    vars.orderDirection = ordering[orderType].direction
    const search = this.useStore.getState().search
    if (search) {
      vars.searchKeyword=search
    }
    if (pageSize) {
      vars.first = pageSize
    }
    
    const cursor = this.useStore.getState().cursor
    if (more && cursor) {
      vars.after = cursor
    }

    
    
    
    return vars
  }

  async loadRepoData(pageSize?: number, more= false) {
    const rData = await apolloClient.query({
      query: getRepositories,
      variables: this.getVariables(pageSize, more)
    })
    return rData
  }

}


