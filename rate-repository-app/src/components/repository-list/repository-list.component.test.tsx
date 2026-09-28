
import { useQuery } from '@apollo/client/react'
import { repositories  } from "./repository-list.data"
import {render, screen } from '@testing-library/react-native'
import { RepositoryList } from "./repository-list.component"



jest.mock('@apollo/client/react', () => {
  const original = jest.requireActual<typeof import('@apollo/client/react')>('@apollo/client/react')
  return {
    
    ...original,
    useQuery: jest.fn(),
  }})


  
describe('repository-list.component', ()=> {
  it('renders name, description, language, forks count, stargazers count, rating average, review count', async ()=> {
    (useQuery as any).mockImplementation((x: any) => (repositories))
    await render(<RepositoryList />)

    const rItems = screen.getAllByTestId('RepositoryItem')
    
    expect(rItems.length).toBe(repositories.length)
    rItems.forEach((_, idx) => {
      expect(rItems[idx]).toHaveTextContent(new RegExp(repositories[idx].fullName))
      expect(rItems[idx]).toHaveTextContent(new RegExp(repositories[idx].description))
      expect(rItems[idx]).toHaveTextContent(new RegExp(repositories[idx].language))
      expect(rItems[idx]).toHaveTextContent(new RegExp(''+repositories[idx].forksCount))
      expect(rItems[idx]).toHaveTextContent(new RegExp(''+repositories[idx].stargazersCount))
      expect(rItems[idx]).toHaveTextContent(new RegExp(''+repositories[idx].ratingAverage))
      expect(rItems[idx]).toHaveTextContent(new RegExp(''+repositories[idx].reviewCount))
    })  
  })
})