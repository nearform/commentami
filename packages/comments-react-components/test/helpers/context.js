export function getComponentWithContext(component, context, contextName, componentFile, contextFile) {
  jest.doMock(contextFile, () => {
    return {
      [contextName]: {
        Consumer: props => props.children(context)
      }
    }
  })

  return require(componentFile)[component]
}
