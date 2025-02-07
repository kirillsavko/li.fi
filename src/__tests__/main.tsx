import '../main.tsx'

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}))

describe('Entry point (main.tsx)', () => {
  test('calls createRoot with the correct element', () => {
    const { createRoot } = jest.requireMock('react-dom/client')

    expect(createRoot).toHaveBeenCalledTimes(1)
    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'))

    const rootInstance = createRoot.mock.results[0].value
    expect(rootInstance.render).toHaveBeenCalledTimes(1)
  })
})
