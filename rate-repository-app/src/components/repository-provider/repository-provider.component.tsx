import { createContext, PropsWithChildren, useState } from "react"
import { RepositoryListService } from "./repository-list.service"
export const RepositoryContext = createContext<RepositoryListService>(null)


export const RepositoryProvider = ({children}: PropsWithChildren)=> {
  const [repositoryService] = useState(new RepositoryListService())
  
  return (<RepositoryContext value={repositoryService}>
    {children}
  </RepositoryContext>)
        

}