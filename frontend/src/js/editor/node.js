import generateId from '../utility/generateId'
import { getDrawArea, getDiagramSize } from '../utility/getArea'
import { isAddLineMode, getDataFromGlobal, isNormalMode } from '../utility/editorMode'
import updateLine from './updateLine'
import addLineMode from '../mode/addLineMode'
import updateNodeLabel from './updateNodeLabel'
import saveMode from '../mode/saveMode'

export default class {
  constructor(options) {
    this.render(options)
  }

  render = ({
    id = generateId(),
    x,
    y,
    limitInput,
    files,
    settings,
    type,
    label,
    fill,
    stroke,
    lines = [],
    documentation,
  }) => {
    const drawArea = getDrawArea()
    const nodes = getDataFromGlobal('NODES')

    this.defaultFill = fill

    nodes[id] = {
      id,
      position: [x, y],
      lines,
      limitInput,
      type,
      label,
      documentation,
      settings,
      files,
    }

    const nodeGroup = drawArea
      .data([{ x, y }])
      .append('g')
      .attr('class', 'node')
      .attr('id', id)
      .attr('transform', data => `translate(${data.x}, ${data.y})`)

    const nodeBox = nodeGroup
      .insert('rect', ':first-child')
      .attr('class', 'node-box')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', fill)
      .attr('stroke', stroke)

    const nodeBG = nodeGroup
      .insert('rect', ':first-child')
      .attr('class', 'node-bg')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', 'white')

    const nodeLabel = nodeGroup
      .append('text')
      .attr('class', 'node-label')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('stroke', stroke)
      .attr('stroke-width', 1)

    // add node to graph data
    const graph = getDataFromGlobal('GRAPH')
    graph.addNode(id)

    // upload node label
    updateNodeLabel(id)

    this.loadEvent({
      nodeGroup,
      nodeLabel,
      nodeBox,
      nodeBG,
    })
  }

  loadEvent = ({ nodeGroup }) => {
    nodeGroup
      .on('mouseover', this.handleNodeGroupMouseOver)
      .on('click', this.handleNodeGroupClick)
      .call(
        d3
          .drag()
          .on('drag', this.handleNodeGroupDragging)
          .on('end', this.handleNodeGroupDragEnd)
      )
  }

  handleNodeGroupDragging(data) {
    // on drag active on NORMAL mode
    if (isNormalMode()) {
      // Calculate coordinate
      const node = d3.select(this)
      const { width, height } = node.node().getBBox()
      const { width: svgWidth, height: svgHeight } = getDiagramSize()
      const strokeWidth = 3

      data.x = Math.max(strokeWidth, Math.min(svgWidth - width - strokeWidth, d3.event.x))
      data.y = Math.max(strokeWidth, Math.min(svgHeight - height - strokeWidth, d3.event.y))

      // set transform from [x, y]
      node.attr('transform', `translate(${data.x}, ${data.y})`)

      // update line
      updateLine({ node, data })
    }
  }

  handleNodeGroupDragEnd = () => {
    // auto save on NORMAL mode
    if (isNormalMode()) saveMode()
  }

  handleNodeGroupMouseOver() {
    d3.select(this).raise()
  }

  handleNodeGroupClick() {
    if (isAddLineMode()) {
      addLineMode.bind(this)()
    }
  }
}
