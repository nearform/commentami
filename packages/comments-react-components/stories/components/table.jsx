import React from 'react'
import { style } from 'typestyle'

import { CommentableBlock } from '../../src/components/CommentableBlock'

const tableClassName = style({
  borderSpacing: 1
})

const headerClassName = style({
  height: '30px',
  textAlign: 'left',
  textTransform: 'capitalize',
  backgroundColor: '#ddd',
  border: '1px solid #aaa'
})

const cellClassName = style({
  textAlign: 'left',
  height: '30px',
  border: '1px solid #aaa'
})

const cellContentsClassName = style({
  backgroundColor: '#f3f3f3',
  padding: '8px'
})

const highlightCellContentsClassName = style({
  backgroundColor: '#e3ead4',
  padding: '8px'
})

const commentLabelClassName = style({
  height: '10px',
  width: '10px',
  position: 'relative',
  float: 'right',
  top: '-8px',
  right: '-8px',
  backgroundColor: '#f3704c'
})

export const Table = ({ data, columns }) => (
  <table className={tableClassName}>
    <tbody>
      <Header columns={columns} />
      {data.map(row => <Row key={row._id} data={row} columns={columns} />)}
    </tbody>
  </table>
)

export const CommentLabel = ({ rootRef, handleToggleComment }) => (
  <div className={commentLabelClassName} ref={rootRef} onDoubleClick={handleToggleComment} onClick={handleToggleComment} />
)

export const Cell = ({ id, data }) => (
  <td className={cellClassName}>
    <CommentableBlock referenceId={id} markerComponent={CommentLabel} className={cellContentsClassName} highlightedClassName={highlightCellContentsClassName}>
      {data}
    </CommentableBlock>
  </td>
)

export const HeadCell = ({ data }) => <th className={headerClassName}>{data}</th>

export const Row = ({ data, columns }) => (
  <tr>
    {Object.entries(data)
      .filter(([key]) => columns.includes(key))
      .sort(([keyA], [keyB]) => columns.findIndex(key => key === keyA) - columns.findIndex(key => key === keyB))
      .map(([key, value]) => <Cell key={key} id={`${data._id}-${key}`} data={value} />)}
  </tr>
)

export const Header = ({ columns }) => (
  <tr>
    {columns.map(key => {
      return <HeadCell key={key} data={key} />
    })}
  </tr>
)
