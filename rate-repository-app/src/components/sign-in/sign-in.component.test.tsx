 
import { fireEvent, render, screen } from "@testing-library/react-native"
import { SignIn } from "./sign-in.component"
import { signIn, SignInData } from "../../services/app.service"
import { useNavigate } from "react-router-native"


jest.mock('../../services/app.service', ()=> {
  return {
    signIn: jest.fn()
  }
})
const signInMock = jest.mocked(signIn)

jest.mock('@react-native-async-storage/async-storage', () => ({}))
jest.mock('react-router-native', ()=> {
  return { useNavigate: jest.fn() }
})

const useNavigateMock = jest.mocked(useNavigate)

describe('sign in component', ()=> {
  it('on submit is correct', async ()=> {
    signInMock.mockImplementation(async (_x: SignInData)=>{})
    
    const navigateMock = jest.fn()
    useNavigateMock.mockReturnValue(navigateMock)
    
    await render(<SignIn/>)
    await fireEvent.changeText(screen.getByPlaceholderText('Username'), 'user')
    await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password')
    await fireEvent.press(screen.getByText('Sign in'))
    

    expect(signInMock).toHaveBeenCalled()
    expect(signInMock).toHaveBeenLastCalledWith({username: 'user',  password: 'password'})
    expect(navigateMock).toHaveBeenCalled()
  })
})