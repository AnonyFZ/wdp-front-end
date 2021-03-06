import { select } from 'd3'
import { getDataFromGlobal } from '../utility/editorMode'
import diagonal from './diagonal'

export default ({ node, data }) => {
  // get (nodes, lines) data from global
  const nodes = getDataFromGlobal('NODES')
  const lines = getDataFromGlobal('LINES')

  // get node id (this node from event)
  const nodeId = node.attr('id')
  const {
    [nodeId]: { lines: linesData },
  } = nodes

  const nodeData = nodes[nodeId]
  nodeData.position = [data.x, data.y]

  // update line when node moving
  linesData.map(lineId => {
    const {
      [lineId]: { beginId },
    } = lines
    const line = select(document.getElementById(lineId).querySelector('.line-path'))
    const lineBackground = select(document.getElementById(lineId).querySelector('.line-background-path'))
    const source = nodeId === beginId ? nodeData : nodes[beginId]
    const link = diagonal({ source })

    line.attr('d', link)
    lineBackground.attr('d', link)

    return true
  })
}
