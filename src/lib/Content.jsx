import styled from 'styled-components'

const Content = styled.div`
  height: 400px;
  overflow-y: scroll;
  margin-top: 2px;
  padding-top: 6px;

  @media screen and (max-width: 768px) {
    height: calc(100% - 112px);
  }
`

export default Content
