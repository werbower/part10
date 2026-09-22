import { StyleProp, StyleSheet, Text, TextStyle } from "react-native"
import { theme } from "../../theme"
import { ReactNode } from "react"

export const StyledText = (props: unknown&{style?: StyleProp<TextStyle>, children?: ReactNode})=> {
  const style = StyleSheet.create({
    default: {
      fontFamily: theme.fonts.main
    }
  })


  return <Text {...props} style = {[style.default, props.style]} >{props.children}</Text>
}