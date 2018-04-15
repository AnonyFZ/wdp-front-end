import EDITOR_MODE, { setEditorMode, getDataFromGlobal, getPassDataBeforeClear } from '../utility/editorMode'

export default () => {
  // NOTE: get all data for delete line
  const { lineId, line } = getPassDataBeforeClear()
  const nodes = getDataFromGlobal('NODES')
  const lines = getDataFromGlobal('LINES')
  const graph = getDataFromGlobal('GRAPH')
  const { beginId, endId } = lines[lineId]
  const beginNode = nodes[beginId]
  const endNode = nodes[endId]

  // NOTE: lazy code
  beginNode.lines = beginNode.lines.filter(xline => xline !== lineId)
  endNode.lines = endNode.lines.filter(xline => xline !== lineId)

  // NOTE: remove edge from graph data
  graph.removeEdge(beginId, endId)

  // NOTE: delete target line
  d3.select($(`#${lineId}`).get(0)).remove()

  // NOTE: confirm delete node
  delete lines[lineId]

  // NOTE: delete target line
  line.remove()

  // NOTE: reset mode to NORMAL
  setEditorMode(EDITOR_MODE.NORMAL)
}